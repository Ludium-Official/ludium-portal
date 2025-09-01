import type { usePrivy } from '@privy-io/react-auth';
import * as ethers from 'ethers';
import type { Abi, PublicClient } from 'viem';
import { encodeFunctionData } from 'viem';

import LdFundingArtifact from './abi/LdFunding.json';
import LdInvestmentCoreArtifact from './abi/LdInvestmentCore.json';
import LdMilestoneManagerArtifact from './abi/LdMilestoneManager.json';

// Extract ABIs from artifacts
const INVESTMENT_CORE_ABI = LdInvestmentCoreArtifact.abi as Abi;
const FUNDING_MODULE_ABI = LdFundingArtifact.abi as Abi;
const MILESTONE_MANAGER_ABI = LdMilestoneManagerArtifact.abi as Abi;

export interface InvestmentContractAddresses {
  core: string;
  funding: string;
  milestone: string;
  timeLock: string;
}

export class InvestmentContract {
  private addresses: InvestmentContractAddresses;
  private sendTransaction: ReturnType<typeof usePrivy>['sendTransaction'];
  private client: PublicClient;
  private chainId?: number;

  constructor(
    addresses: InvestmentContractAddresses,
    sendTransaction: ReturnType<typeof usePrivy>['sendTransaction'],
    client: PublicClient,
    chainId?: number,
  ) {
    this.addresses = addresses;
    this.sendTransaction = sendTransaction;
    this.client = client;
    this.chainId = chainId;

    console.log('InvestmentContract initialized with:', {
      addresses: addresses,
      chainId: chainId,
    });
  }

  private async waitForTransaction(hash: `0x${string}`) {
    const receipt = await this.client.waitForTransactionReceipt({ hash });
    return receipt;
  }

  async signValidate(params: {
    programId: number;
    projectOwner: string;
    projectName: string;
    targetFunding: string;
    milestones: Array<{
      title: string;
      description: string;
      percentage: number;
      deadline: string;
    }>;
  }) {
    try {
      console.log('=== signValidate (Accept Application) Debug ===');
      console.log('Input params:', {
        programId: params.programId,
        projectOwner: params.projectOwner,
        projectName: params.projectName,
        targetFunding: params.targetFunding,
        milestonesCount: params.milestones.length,
      });

      // Convert milestones to contract format (MilestoneInput struct)
      const milestonesForContract = params.milestones.map((m) => ({
        title: m.title,
        description: m.description,
        percentage: m.percentage * 100, // Convert to basis points
        deadline: Math.floor(new Date(m.deadline).getTime() / 1000),
      }));

      console.log('Milestones for contract:', milestonesForContract);

      // Convert target funding to wei
      const targetFundingWei = ethers.utils.parseEther(params.targetFunding);

      console.log('Target funding conversion:', {
        originalAmount: params.targetFunding,
        weiAmount: targetFundingWei.toString(),
        ethAmount: ethers.utils.formatEther(targetFundingWei),
      });

      const data = encodeFunctionData({
        abi: INVESTMENT_CORE_ABI,
        functionName: 'signValidate',
        args: [
          params.programId,
          params.projectOwner,
          params.projectName,
          targetFundingWei,
          milestonesForContract,
        ],
      });

      console.log('Encoded function data:', {
        functionName: 'signValidate',
        args: [
          params.programId,
          params.projectOwner,
          params.projectName,
          targetFundingWei.toString(),
          'milestones...',
        ],
        contractAddress: this.addresses.core,
      });

      const txResult = await this.sendTransaction(
        {
          to: this.addresses.core as `0x${string}`,
          data,
          value: BigInt(0),
          chainId: this.chainId,
        } as Parameters<typeof this.sendTransaction>[0],
        {
          uiOptions: {
            showWalletUIs: true,
            transactionInfo: {
              title: 'Approve Project Application',
              action: 'Approve',
            },
            description: 'Approving project application',
            successHeader: 'Application Approved!',
            successDescription: 'The project application has been approved.',
          },
        },
      );

      const receipt = await this.waitForTransaction(txResult.hash);

      // Check if project was created
      let projectCreated = false;
      let projectId = null;

      // Event: ProjectValidated(uint256 indexed programId, uint256 indexed projectId, address indexed owner, string name, uint256 targetFunding)
      const projectCreatedTopic = ethers.utils.id(
        'ProjectValidated(uint256,uint256,address,string,uint256)',
      );
      const log = receipt.logs.find(
        (log) =>
          'topics' in log && Array.isArray(log.topics) && log.topics[0] === projectCreatedTopic,
      );
      if (log && 'topics' in log && Array.isArray(log.topics)) {
        projectCreated = true;
        // The project ID is the second indexed parameter (topics[2])
        projectId = Number.parseInt(log.topics[2] as string, 16);
      }

      return {
        txHash: receipt.transactionHash,
        projectCreated,
        projectId,
      };
    } catch (error) {
      console.error('Failed to approve application:', error);
      throw error;
    }
  }

  async createInvestmentProgram(params: {
    name: string;
    description: string;
    fundingGoal: string;
    fundingToken: string;
    applicationStartDate: string;
    applicationEndDate: string;
    fundingStartDate: string;
    fundingEndDate: string;
    validators: string[];
    requiredValidations: number;
    feePercentage?: number;
    fundingCondition?: 'open' | 'tier';
  }) {
    try {
      const fundingGoalWei = ethers.utils.parseEther(params.fundingGoal);

      // Note: description is not used in the contract, only kept in params for future use
      const data = encodeFunctionData({
        abi: INVESTMENT_CORE_ABI,
        functionName: 'createInvestmentProgram',
        args: [
          params.name, // _name
          params.validators, // _validators
          params.requiredValidations, // _requiredApprovals
          fundingGoalWei, // _maxFundingPerProject
          Math.floor(new Date(params.applicationStartDate).getTime() / 1000), // _applicationStartTime
          Math.floor(new Date(params.applicationEndDate).getTime() / 1000), // _applicationEndTime
          Math.floor(new Date(params.fundingStartDate).getTime() / 1000), // _fundingStartTime
          Math.floor(new Date(params.fundingEndDate).getTime() / 1000), // _fundingEndTime
          params.fundingCondition === 'tier' ? 1 : 0, // _condition (0 = open, 1 = tier)
          params.feePercentage || 300, // _feePercentage (3% default in basis points)
          params.fundingToken || ethers.constants.AddressZero, // _token
        ],
      });

      const txResult = await this.sendTransaction(
        {
          to: this.addresses.core as `0x${string}`,
          data,
          value: BigInt(0),
          chainId: this.chainId,
        } as Parameters<typeof this.sendTransaction>[0],
        {
          uiOptions: {
            showWalletUIs: true,
            transactionInfo: {
              title: 'Create Investment Program',
              action: 'Create',
            },
            description: `Creating program: ${params.name}`,
            successHeader: 'Program Created!',
            successDescription: 'Investment program has been created successfully.',
          },
        },
      );

      const receipt = await this.waitForTransaction(txResult.hash);

      // Extract program ID from event
      // Event: InvestmentProgramCreated(uint256 indexed id, address indexed host, string name, uint256 maxFundingPerProject, address token)
      const eventTopic = ethers.utils.id(
        'InvestmentProgramCreated(uint256,address,string,uint256,address)',
      );
      let programId = null;

      const log = receipt.logs.find(
        (log) => 'topics' in log && Array.isArray(log.topics) && log.topics[0] === eventTopic,
      );
      if (log && 'topics' in log && Array.isArray(log.topics)) {
        // The program ID is the first indexed parameter (topics[1])
        programId = Number.parseInt(log.topics[1] as string, 16);
      }

      return {
        txHash: receipt.transactionHash,
        programId,
      };
    } catch (error) {
      console.error('Failed to create investment program:', error);
      throw error;
    }
  }

  async acceptMilestone(projectId: number, milestoneIndex: number) {
    try {
      const data = encodeFunctionData({
        abi: MILESTONE_MANAGER_ABI,
        functionName: 'approveMilestone',
        args: [projectId, milestoneIndex],
      });

      const txResult = await this.sendTransaction(
        {
          to: this.addresses.milestone as `0x${string}`,
          data,
          value: BigInt(0),
          chainId: this.chainId,
        } as Parameters<typeof this.sendTransaction>[0],
        {
          uiOptions: {
            showWalletUIs: true,
            transactionInfo: {
              title: 'Approve Milestone',
              action: 'Approve',
            },
            description: `Approving milestone #${milestoneIndex + 1} for project #${projectId}`,
            successHeader: 'Milestone Approved!',
            successDescription: 'The milestone has been approved and funds will be released.',
          },
        },
      );

      const receipt = await this.waitForTransaction(txResult.hash);
      return {
        txHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error('Failed to approve milestone:', error);
      throw error;
    }
  }

  async investFund(params: {
    projectId: number;
    amount: string; // Amount in Wei (or smallest unit for tokens)
    token?: string; // Optional token address, if not provided uses native token
    tokenName?: string; // Token name for display (EDU, USDT, etc.)
    tokenDecimals?: number; // Token decimals for display formatting
  }) {
    try {
      console.log('=== investFund Debug Info ===');
      console.log('Input params:', {
        projectId: params.projectId,
        amount: params.amount,
        token: params.token,
        tokenName: params.tokenName,
        tokenDecimals: params.tokenDecimals,
      });

      // Amount is already in Wei, no conversion needed
      const valueInWei = ethers.BigNumber.from(params.amount);
      console.log('valueInWei (BigNumber):', valueInWei.toString());
      console.log('valueInWei (hex):', valueInWei.toHexString());
      
      const amountBigInt = BigInt(params.amount);
      const isNative = !params.token || params.token === ethers.constants.AddressZero;
      console.log('Is native token:', isNative);

      // Format amount for display
      const displayAmount =
        params.tokenDecimals !== undefined
          ? ethers.utils.formatUnits(params.amount, params.tokenDecimals)
          : ethers.utils.formatEther(params.amount);
      const tokenDisplay = params.tokenName || 'native token';

      let data: `0x${string}`;
      let value: bigint;

      if (isNative) {
        // Native token investment
        console.log('Calling investFund with args:', [params.projectId]);
        console.log('Project ID type:', typeof params.projectId);

        data = encodeFunctionData({
          abi: FUNDING_MODULE_ABI,
          functionName: 'investFund',
          args: [params.projectId],
        });

        // Decode to verify what we're sending
        const testDecode = ethers.utils.defaultAbiCoder.decode(['uint256'], `0x${data?.slice(10)}`);
        console.log('Test decode of projectId from data:', testDecode);

        value = BigInt(valueInWei.toString());
        console.log('Encoded data:', data);
        console.log('Function selector (first 4 bytes):', data?.slice(0, 10));
        console.log('Value to send (bigint):', value.toString());
        console.log('Value to send (hex):', `0x${value.toString(16)}`);
      } else {
        // ERC20 token investment
        console.log('Calling investWithToken with args:', [
          params.projectId,
          params.token,
          valueInWei,
        ]);
        data = encodeFunctionData({
          abi: FUNDING_MODULE_ABI,
          functionName: 'investWithToken',
          args: [params.projectId, params.token as `0x${string}`, amountBigInt],
        });
        value = BigInt(0);
        console.log('Encoded data:', data);
      }

      console.log('Transaction parameters:', {
        to: this.addresses.funding,
        data: data,
        value: value.toString(),
        chainId: this.chainId,
      });

      const txResult = await this.sendTransaction(
        {
          to: this.addresses.funding as `0x${string}`,
          data,
          value,
          chainId: this.chainId,
        } as Parameters<typeof this.sendTransaction>[0],
        {
          uiOptions: {
            showWalletUIs: true,
            transactionInfo: {
              title: 'Invest in Project',
              action: 'Invest',
            },
            description: `Investing ${displayAmount} ${tokenDisplay} in project #${params.projectId}`,
            successHeader: 'Investment Successful!',
            successDescription: 'Your investment has been confirmed.',
          },
        },
      );

      const receipt = await this.waitForTransaction(txResult.hash);

      // Parse investment event
      const investmentEventTopic = ethers.utils.id('InvestmentMade(uint256,address,uint256)');
      let investmentAmount = null;

      const log = receipt.logs.find(
        (log) =>
          'topics' in log && Array.isArray(log.topics) && log.topics[0] === investmentEventTopic,
      );

      if (log && 'data' in log) {
        const decoded = ethers.utils.defaultAbiCoder.decode(['uint256'], log.data);
        // Format based on token decimals
        investmentAmount =
          params.tokenDecimals !== undefined
            ? ethers.utils.formatUnits(decoded[0], params.tokenDecimals)
            : ethers.utils.formatEther(decoded[0]);
      }

      return {
        txHash: receipt.transactionHash,
        amount: investmentAmount || displayAmount,
        projectId: params.projectId,
      };
    } catch (error) {
      console.error('Failed to invest:', error);
      throw error;
    }
  }

  async reclaimFund(projectId: number) {
    try {
      const data = encodeFunctionData({
        abi: FUNDING_MODULE_ABI,
        functionName: 'reclaimFund',
        args: [projectId],
      });

      const txResult = await this.sendTransaction(
        {
          to: this.addresses.funding as `0x${string}`,
          data,
          value: BigInt(0),
          chainId: this.chainId,
        } as Parameters<typeof this.sendTransaction>[0],
        {
          uiOptions: {
            showWalletUIs: true,
            transactionInfo: {
              title: 'Reclaim Investment',
              action: 'Reclaim',
            },
            description: `Reclaiming funds from project #${projectId}`,
            successHeader: 'Funds Reclaimed!',
            successDescription: 'Your investment has been returned.',
          },
        },
      );

      const receipt = await this.waitForTransaction(txResult.hash);

      // Parse reclaim event
      const reclaimEventTopic = ethers.utils.id('FundsReclaimed(uint256,address,uint256)');
      let reclaimedAmount = null;

      const log = receipt.logs.find(
        (log) =>
          'topics' in log && Array.isArray(log.topics) && log.topics[0] === reclaimEventTopic,
      );

      if (log && 'data' in log) {
        const decoded = ethers.utils.defaultAbiCoder.decode(['uint256'], log.data);
        reclaimedAmount = ethers.utils.formatEther(decoded[0]);
      }

      return {
        txHash: receipt.transactionHash,
        amount: reclaimedAmount,
        projectId,
      };
    } catch (error) {
      console.error('Failed to reclaim funds:', error);
      throw error;
    }
  }

  async feeClaim(programId: number) {
    try {
      const data = encodeFunctionData({
        abi: FUNDING_MODULE_ABI,
        functionName: 'feeClaim',
        args: [programId],
      });

      const txResult = await this.sendTransaction(
        {
          to: this.addresses.funding as `0x${string}`,
          data,
          value: BigInt(0),
          chainId: this.chainId,
        } as Parameters<typeof this.sendTransaction>[0],
        {
          uiOptions: {
            showWalletUIs: true,
            transactionInfo: {
              title: 'Claim Program Fees',
              action: 'Claim',
            },
            description: `Claiming fees for program #${programId}`,
            successHeader: 'Fees Claimed!',
            successDescription: 'Program fees have been transferred to your wallet.',
          },
        },
      );

      const receipt = await this.waitForTransaction(txResult.hash);

      // Parse fee claim event
      const feeClaimEventTopic = ethers.utils.id('FeeClaimed(uint256,address,uint256)');
      let claimedAmount = null;

      const log = receipt.logs.find(
        (log) =>
          'topics' in log && Array.isArray(log.topics) && log.topics[0] === feeClaimEventTopic,
      );

      if (log && 'data' in log) {
        const decoded = ethers.utils.defaultAbiCoder.decode(['uint256'], log.data);
        claimedAmount = ethers.utils.formatEther(decoded[0]);
      }

      return {
        txHash: receipt.transactionHash,
        amount: claimedAmount,
        programId,
      };
    } catch (error) {
      console.error('Failed to claim fees:', error);
      throw error;
    }
  }

  async submitProjectApplication(params: {
    programId: number;
    projectName: string;
    description: string;
    targetFunding: string;
    additionalData?: Record<string, unknown>;
  }) {
    try {
      const targetFundingWei = ethers.utils.parseEther(params.targetFunding);

      // Encode additional data if provided
      const additionalDataBytes = params.additionalData
        ? ethers.utils.defaultAbiCoder.encode(['string'], [JSON.stringify(params.additionalData)])
        : '0x';

      const data = encodeFunctionData({
        abi: INVESTMENT_CORE_ABI,
        functionName: 'submitProjectApplication',
        args: [
          params.programId,
          params.projectName,
          params.description,
          targetFundingWei,
          additionalDataBytes,
        ],
      });

      const txResult = await this.sendTransaction(
        {
          to: this.addresses.core as `0x${string}`,
          data,
          value: BigInt(0),
          chainId: this.chainId,
        } as Parameters<typeof this.sendTransaction>[0],
        {
          uiOptions: {
            showWalletUIs: true,
            transactionInfo: {
              title: 'Submit Project Application',
              action: 'Submit',
            },
            description: `Applying to program with project: ${params.projectName}`,
            successHeader: 'Application Submitted!',
            successDescription: 'Your project application has been submitted.',
          },
        },
      );

      const receipt = await this.waitForTransaction(txResult.hash);

      // Extract application ID from event
      let applicationId = null;
      if (receipt.logs && receipt.logs.length > 0) {
        const eventTopic = ethers.utils.id(
          'ProjectApplicationSubmitted(uint256,uint256,address,string,uint256)',
        );
        const log = receipt.logs.find(
          (log) => 'topics' in log && Array.isArray(log.topics) && log.topics[0] === eventTopic,
        );
        if (log && 'topics' in log && Array.isArray(log.topics)) {
          applicationId = Number.parseInt(log.topics[2] as string, 16);
        }
      }

      return {
        txHash: receipt.transactionHash,
        applicationId,
      };
    } catch (error) {
      console.error('Failed to submit project application:', error);
      throw error;
    }
  }

  async getProgramStatusDetailed(programId: number) {
    try {
      console.log('Getting program status for programId:', programId);
      console.log('Using core contract address:', this.addresses.core);

      // First get the basic status
      const statusData = await this.client.readContract({
        address: this.addresses.core as `0x${string}`,
        abi: INVESTMENT_CORE_ABI,
        functionName: 'getProgramStatus',
        args: [programId],
      });

      console.log('Program status:', statusData);

      // Then get the program details to check funding period
      const detailsData = await this.client.readContract({
        address: this.addresses.core as `0x${string}`,
        abi: INVESTMENT_CORE_ABI,
        functionName: 'getProgramDetails',
        args: [programId],
      });

      console.log('Program details:', detailsData);

      // Extract details
      const details = detailsData as [
        string, // name
        string, // host
        bigint, // maxFundingPerProject
        bigint, // applicationStartTime
        bigint, // applicationEndTime
        bigint, // fundingStartTime
        bigint, // fundingEndTime
        number, // condition
        bigint, // feePercentage
        number, // status
        string, // token
        bigint, // requiredValidations
      ];

      const status = statusData as number;
      const now = Math.floor(Date.now() / 1000);
      const applicationStartTime = Number(details[3]);
      const applicationEndTime = Number(details[4]);
      const fundingStartTime = Number(details[5]);
      const fundingEndTime = Number(details[6]);

      const isInApplicationPeriod = now >= applicationStartTime && now <= applicationEndTime;
      const isInFundingPeriod = now >= fundingStartTime && now <= fundingEndTime;
      const isInPendingPeriod = now < applicationStartTime;

      let timeUntilNextPhase = 0;
      if (now < applicationStartTime) {
        timeUntilNextPhase = applicationStartTime - now;
      } else if (now < applicationEndTime) {
        timeUntilNextPhase = applicationEndTime - now;
      } else if (now < fundingStartTime) {
        timeUntilNextPhase = fundingStartTime - now;
      } else if (now < fundingEndTime) {
        timeUntilNextPhase = fundingEndTime - now;
      }

      const statusNames = ['Ready', 'Active', 'Successful', 'Failed', 'Pending'];

      console.log('Calculated periods:', {
        now,
        applicationStartTime,
        applicationEndTime,
        fundingStartTime,
        fundingEndTime,
        isInApplicationPeriod,
        isInFundingPeriod,
        isInPendingPeriod,
      });

      return {
        status: statusNames[status] || 'Unknown',
        statusCode: status,
        isInApplicationPeriod,
        isInFundingPeriod,
        isInPendingPeriod,
        timeUntilNextPhase,
      };
    } catch (error) {
      console.error('Failed to get program status:', error);
      console.error('Error details:', {
        programId,
        coreAddress: this.addresses.core,
        error: error instanceof Error ? error.message : String(error),
      });

      // Return a default status to allow debugging
      return {
        status: 'Unknown',
        statusCode: -1,
        isInApplicationPeriod: false,
        isInFundingPeriod: false,
        isInPendingPeriod: false,
        timeUntilNextPhase: 0,
      };
    }
  }

  async getProjectInvestmentDetails(projectId: number) {
    try {
      // Get project details from Core contract
      const projectData = await this.client.readContract({
        address: this.addresses.core as `0x${string}`,
        abi: INVESTMENT_CORE_ABI,
        functionName: 'getProjectDetails',
        args: [projectId],
      });

      console.log('Project details from core:', projectData);

      // Project details returns: name, owner, targetFunding, totalInvested, fundingSuccessful, programId
      const [_name, _owner, targetFunding, _totalInvested, fundingSuccessful, _programId] =
        projectData as [string, string, bigint, bigint, boolean, bigint];

      // Get total investments from Funding contract
      const totalRaised = await this.client.readContract({
        address: this.addresses.funding as `0x${string}`,
        abi: FUNDING_MODULE_ABI,
        functionName: 'totalProjectInvestments',
        args: [projectId],
      });

      console.log('Total raised from funding:', totalRaised);
      console.log('Raw values:', {
        targetFundingWei: targetFunding.toString(),
        totalRaisedWei: totalRaised?.toString(),
        targetFundingEth: ethers.utils.formatEther(targetFunding),
        totalRaisedEth: ethers.utils.formatEther(totalRaised as bigint),
      });

      const totalRaisedBigInt = totalRaised as bigint;

      return {
        totalRaised: ethers.utils.formatEther(totalRaisedBigInt),
        targetAmount: ethers.utils.formatEther(targetFunding),
        fundingSuccessful,
        investorCount: 0, // We don't have this easily available
        fundingProgress:
          targetFunding > 0 ? (Number(totalRaisedBigInt) * 100) / Number(targetFunding) : 0,
      };
    } catch (error) {
      console.error('Failed to get project investment details:', error);
      throw error;
    }
  }

  async canClaimFees(programId: number, userAddress: string): Promise<boolean> {
    try {
      const data = await this.client.readContract({
        address: this.addresses.funding as `0x${string}`,
        abi: FUNDING_MODULE_ABI,
        functionName: 'canClaimFees',
        args: [programId, userAddress as `0x${string}`],
      });

      return data as boolean;
    } catch (error) {
      console.error('Failed to check fee claim eligibility:', error);
      return false;
    }
  }

  async isInApplicationPeriod(programId: number): Promise<boolean> {
    const status = await this.getProgramStatusDetailed(programId);
    return status.isInApplicationPeriod;
  }

  async isInFundingPeriod(programId: number): Promise<boolean> {
    const status = await this.getProgramStatusDetailed(programId);
    return status.isInFundingPeriod;
  }

  async updateProgramStatus(programId: number) {
    try {
      console.log('Updating program status for programId:', programId);

      const data = encodeFunctionData({
        abi: INVESTMENT_CORE_ABI,
        functionName: 'updateProgramStatus',
        args: [programId],
      });

      const txResult = await this.sendTransaction(
        {
          to: this.addresses.core as `0x${string}`,
          data,
          value: BigInt(0),
          chainId: this.chainId,
        } as Parameters<typeof this.sendTransaction>[0],
        {
          uiOptions: {
            showWalletUIs: true,
            transactionInfo: {
              title: 'Update Program Status',
              action: 'Update',
            },
            description: `Updating status for program #${programId}`,
            successHeader: 'Status Updated!',
            successDescription: 'The program status has been updated.',
          },
        },
      );

      await this.waitForTransaction(txResult.hash);

      // Get the updated status
      const newStatus = await this.getProgramStatusDetailed(programId);
      console.log('New program status:', newStatus);

      return {
        txHash: txResult.hash,
        newStatus: newStatus.status,
        statusCode: newStatus.statusCode,
      };
    } catch (error) {
      console.error('Failed to update program status:', error);
      throw error;
    }
  }

  /**
   * Alias for acceptMilestone (backward compatibility)
   */
  async approveMilestone(projectId: number, milestoneIndex: number) {
    return this.acceptMilestone(projectId, milestoneIndex);
  }

  /**
   * Alias for reclaimFund (backward compatibility)
   */
  async reclaimFunds(projectId: number) {
    // programId parameter is ignored for backward compatibility
    return this.reclaimFund(projectId);
  }

  async checkReclaimEligibility(
    projectId: number,
    investor: string,
  ): Promise<{ canReclaim: boolean; reason?: string }> {
    try {
      const data = await this.client.readContract({
        address: this.addresses.funding as `0x${string}`,
        abi: FUNDING_MODULE_ABI,
        functionName: 'canReclaimFunds',
        args: [projectId, investor as `0x${string}`],
      });

      const [canReclaim, reason] = data as [boolean, string];
      return { canReclaim, reason };
    } catch (error) {
      console.error('Failed to check reclaim eligibility:', error);
      return { canReclaim: false, reason: 'Failed to check eligibility' };
    }
  }

  async checkInvestmentEligibility(
    projectId: number,
    investor: string,
    amount: string,
  ): Promise<{ eligible: boolean; reason: string }> {
    try {
      console.log('Checking investment eligibility:', {
        projectId,
        investor,
        amount,
        fundingAddress: this.addresses.funding,
      });

      const data = await this.client.readContract({
        address: this.addresses.funding as `0x${string}`,
        abi: FUNDING_MODULE_ABI,
        functionName: 'isUserEligibleToInvest',
        args: [projectId, investor as `0x${string}`, ethers.BigNumber.from(amount)],
      });

      console.log('Eligibility check response:', data);

      const [eligible, reason] = data as [boolean, string];
      return { eligible, reason: reason || 'Eligible to invest' };
    } catch (error) {
      console.error('Failed to check investment eligibility:', error);

      // Try to extract more specific error message
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('InvalidProjectId') || errorMessage.includes('project')) {
        return { eligible: false, reason: `Project #${projectId} not found on blockchain` };
      }

      if (errorMessage.includes('execution reverted')) {
        return {
          eligible: false,
          reason: 'Contract call failed - project may not exist or be invalid',
        };
      }

      return { eligible: false, reason: `Failed to check eligibility: ${errorMessage}` };
    }
  }

  async getProjectFundingProgress(projectId: number) {
    return this.getProjectInvestmentDetails(projectId);
  }
}
