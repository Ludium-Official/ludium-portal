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
      // Convert milestones to contract format (MilestoneInput struct)
      const milestonesForContract = params.milestones.map((m) => ({
        title: m.title,
        description: m.description,
        percentage: m.percentage * 100, // Convert to basis points
        deadline: Math.floor(new Date(m.deadline).getTime() / 1000),
      }));

      // Convert target funding to wei
      const targetFundingWei = ethers.utils.parseEther(params.targetFunding);

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
    amount: string; // Amount in ETH
    token?: string; // Optional token address, if not provided uses ETH
  }) {
    try {
      const valueInWei = ethers.utils.parseEther(params.amount);
      const isNative = !params.token || params.token === ethers.constants.AddressZero;

      let data: `0x${string}`;
      let value: bigint;

      if (isNative) {
        // ETH investment
        data = encodeFunctionData({
          abi: FUNDING_MODULE_ABI,
          functionName: 'investFund',
          args: [params.projectId],
        });
        value = BigInt(valueInWei.toString());
      } else {
        // ERC20 token investment
        data = encodeFunctionData({
          abi: FUNDING_MODULE_ABI,
          functionName: 'investWithToken',
          args: [params.projectId, params.token as `0x${string}`, valueInWei],
        });
        value = BigInt(0);
      }

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
            description: `Investing ${params.amount} ${isNative ? 'ETH' : 'tokens'} in project #${params.projectId}`,
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
        investmentAmount = ethers.utils.formatEther(decoded[0]);
      }

      return {
        txHash: receipt.transactionHash,
        amount: investmentAmount || params.amount,
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
      const data = await this.client.readContract({
        address: this.addresses.core as `0x${string}`,
        abi: INVESTMENT_CORE_ABI,
        functionName: 'getProgramStatusDetailed',
        args: [programId],
      });

      const [
        status,
        isInApplicationPeriod,
        isInFundingPeriod,
        isInPendingPeriod,
        timeUntilNextPhase,
      ] = data as [number, boolean, boolean, boolean, bigint];

      const statusNames = [
        'Ready',
        'ApplicationOngoing',
        'ApplicationClosed',
        'FundingOngoing',
        'ProjectOngoing',
        'ProgramCompleted',
        'Failed',
        'Pending',
      ];

      return {
        status: statusNames[status] || 'Unknown',
        statusCode: status,
        isInApplicationPeriod,
        isInFundingPeriod,
        isInPendingPeriod,
        timeUntilNextPhase: Number(timeUntilNextPhase),
      };
    } catch (error) {
      console.error('Failed to get program status:', error);
      throw error;
    }
  }

  async getProjectInvestmentDetails(projectId: number) {
    try {
      const data = await this.client.readContract({
        address: this.addresses.funding as `0x${string}`,
        abi: [
          'function getProjectDetails(uint256) view returns (uint256 totalRaised, uint256 targetAmount, bool fundingSuccessful, uint256 investorCount)',
        ],
        functionName: 'getProjectDetails',
        args: [projectId],
      });

      const [totalRaised, targetAmount, fundingSuccessful, investorCount] = data as [
        bigint,
        bigint,
        boolean,
        bigint,
      ];

      return {
        totalRaised: ethers.utils.formatEther(totalRaised),
        targetAmount: ethers.utils.formatEther(targetAmount),
        fundingSuccessful,
        investorCount: Number(investorCount),
        fundingProgress: targetAmount > 0 ? (Number(totalRaised) * 100) / Number(targetAmount) : 0,
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
        abi: ['function canClaimFees(uint256,address) view returns (bool)'],
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
        abi: ['function canReclaimFunds(uint256,address) view returns (bool,string)'],
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

  async getProjectFundingProgress(projectId: number) {
    return this.getProjectInvestmentDetails(projectId);
  }
}
