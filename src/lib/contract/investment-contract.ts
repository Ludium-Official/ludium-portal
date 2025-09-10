import type { usePrivy } from '@privy-io/react-auth';
import * as ethers from 'ethers';
import type { Abi, PublicClient } from 'viem';
import { encodeFunctionData } from 'viem';

import LdFundingABI from './abi/LdFunding.json';
import LdInvestmentCoreABI from './abi/LdInvestmentCore.json';
import LdMilestoneManagerABI from './abi/LdMilestoneManager.json';

// Use ABIs directly as they are already ABI arrays
const INVESTMENT_CORE_ABI = LdInvestmentCoreABI as Abi;
const FUNDING_MODULE_ABI = LdFundingABI as Abi;
const MILESTONE_MANAGER_ABI = LdMilestoneManagerABI as Abi;

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
  private userAddress?: string;

  constructor(
    addresses: InvestmentContractAddresses,
    sendTransaction: ReturnType<typeof usePrivy>['sendTransaction'],
    client: PublicClient,
    chainId?: number,
    userAddress?: string,
  ) {
    this.addresses = addresses;
    this.sendTransaction = sendTransaction;
    this.client = client;
    this.chainId = chainId;
    this.userAddress = userAddress;
  }

  private async waitForTransaction(hash: `0x${string}`) {
    const receipt = await this.client.waitForTransactionReceipt({ hash });
    return receipt;
  }

  private async getUserAddress(): Promise<string | null> {
    try {
      if (this.userAddress) {
        console.log('Using provided user address:', this.userAddress);
        return this.userAddress;
      }
      console.warn('No user address provided to InvestmentContract');
      return null;
    } catch (error) {
      console.error('Failed to get user address:', error);
      return null;
    }
  }

  async signValidate(params: {
    programId: number;
    projectOwner: string;
    projectName: string;
    targetFunding: string;
    tokenDecimals?: number; // Optional token decimals, defaults to 18
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

      // Convert target funding to smallest unit (wei for ETH/EDU, or token's smallest unit)
      const decimals = params.tokenDecimals ?? 18; // Default to 18 decimals for native tokens
      const targetFundingWei = ethers.utils.parseUnits(params.targetFunding, decimals);

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
    tokenDecimals?: number; // Optional token decimals, defaults to 18
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
      // Convert funding goal to smallest unit based on token decimals
      const decimals = params.tokenDecimals ?? 18; // Default to 18 decimals
      const fundingGoalWei = ethers.utils.parseUnits(params.fundingGoal, decimals);

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

  // ERC20 token approval function
  async approveTokenForInvestment(params: {
    tokenAddress: string;
    amount: string; // Amount in Wei
    tokenName?: string;
    tokenDecimals?: number;
  }) {
    try {
      const ERC20_ABI = [
        {
          constant: false,
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          name: 'approve',
          outputs: [{ name: '', type: 'bool' }],
          type: 'function',
        },
        {
          constant: true,
          inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
          ],
          name: 'allowance',
          outputs: [{ name: '', type: 'uint256' }],
          type: 'function',
        },
      ];

      const displayAmount =
        params.tokenDecimals !== undefined
          ? ethers.utils.formatUnits(params.amount, params.tokenDecimals)
          : ethers.utils.formatUnits(params.amount, 18);

      const data = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [this.addresses.funding, BigInt(params.amount)], // Approve the funding module
      });

      const txResult = await this.sendTransaction(
        {
          to: params.tokenAddress as `0x${string}`,
          data,
          value: BigInt(0),
          chainId: this.chainId,
        } as Parameters<typeof this.sendTransaction>[0],
        {
          uiOptions: {
            showWalletUIs: true,
            transactionInfo: {
              title: 'Approve Token',
              action: 'Approve',
            },
            description: `Approve ${displayAmount} ${params.tokenName || 'tokens'} for investment`,
            buttonText: 'Approve',
            successHeader: 'Token Approved!',
            successDescription: `You have approved ${displayAmount} ${params.tokenName || 'tokens'} for investment.`,
          },
        },
      );

      const receipt = await this.waitForTransaction(txResult.hash);
      return {
        txHash: receipt.transactionHash,
        approved: true,
      };
    } catch (error) {
      console.error('Failed to approve token:', error);
      throw error;
    }
  }

  // Check token allowance
  async checkTokenAllowance(tokenAddress: string, userAddress: string): Promise<bigint> {
    const ERC20_ABI = [
      {
        constant: true,
        inputs: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        type: 'function',
      },
    ];

    try {
      const data = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [userAddress, this.addresses.funding],
      });

      const result = await this.client.call({
        to: tokenAddress as `0x${string}`,
        data,
      });

      if (result.data) {
        const decoded = ethers.utils.defaultAbiCoder.decode(['uint256'], result.data as string);
        return BigInt(decoded[0].toString());
      }
      return BigInt(0);
    } catch (error) {
      console.error('Failed to check allowance:', error);
      return BigInt(0);
    }
  }

  async investFund(params: {
    projectId: number;
    amount: string; // Amount in Wei (or smallest unit for tokens)
    token?: string; // Optional token address, if not provided uses native token
    tokenName?: string; // Token name for display (EDU, USDT, etc.)
    tokenDecimals?: number; // Token decimals for display formatting
    userAddress?: string; // User address for checking allowance
  }) {
    try {
      // Validate amount before conversion
      if (!params.amount || params.amount === '') {
        throw new Error('Investment amount is required');
      }

      // Amount is already in Wei as a string, convert directly to BigInt
      let amountBigInt: bigint;
      try {
        amountBigInt = BigInt(params.amount);
      } catch (error) {
        console.error('Invalid amount for BigInt conversion:', params.amount, error);
        throw new Error('Invalid investment amount format');
      }

      // Check for zero amount
      if (amountBigInt === BigInt(0)) {
        throw new Error('Investment amount must be greater than 0');
      }

      const isNative = !params.token || params.token === ethers.constants.AddressZero;

      // Format amount for display
      const displayAmount =
        params.tokenDecimals !== undefined
          ? ethers.utils.formatUnits(params.amount, params.tokenDecimals)
          : ethers.utils.formatEther(params.amount);
      const tokenDisplay = params.tokenName || 'native token';

      // For ERC20 tokens, check and handle approval
      if (!isNative && params.userAddress && params.token) {
        const allowance = await this.checkTokenAllowance(params.token, params.userAddress);

        if (allowance < amountBigInt) {
          // Need approval first
          throw new Error('TOKEN_APPROVAL_REQUIRED');
        }
      }

      let data: `0x${string}`;
      let value: bigint;

      if (isNative) {
        // Native token investment - use delegateInvestFund from core contract
        // This routes through the funding module with proper validation
        data = encodeFunctionData({
          abi: INVESTMENT_CORE_ABI,
          functionName: 'delegateInvestFund',
          args: [params.projectId],
        });
        value = amountBigInt;
      } else {
        // ERC20 token investment - call funding module directly
        // Cannot use delegateInvestWithToken because it would make msg.sender the core contract
        console.log('ERC20 investment: Calling funding module directly for', params.token);

        data = encodeFunctionData({
          abi: FUNDING_MODULE_ABI,
          functionName: 'investWithToken',
          args: [params.projectId, amountBigInt],
        });
        value = BigInt(0);
      }

      // Determine target address based on investment type
      const targetAddress = isNative ? this.addresses.core : this.addresses.funding;

      const txResult = await this.sendTransaction(
        {
          to: targetAddress as `0x${string}`,
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
    console.log('=== RECLAIM FUND DEBUG START ===');
    console.log('Project ID:', projectId);
    console.log('Contract addresses:', this.addresses);
    console.log('Chain ID:', this.chainId);

    try {
      // First, verify the project exists on-chain
      try {
        console.log('Checking if project exists on-chain...');
        const projectDetails = await this.getProjectInvestmentDetails(projectId);
        console.log('Project details from blockchain:', projectDetails);

        if (!projectDetails || !projectDetails.targetAmount) {
          throw new Error(
            `Project ${projectId} does not exist on the blockchain. The project may not have been deployed yet.`,
          );
        }

        // Log more details about the project
        console.log('Project found on-chain with details:');
        console.log('- Target Amount:', projectDetails.targetAmount);
        console.log('- Total Raised:', projectDetails.totalRaised);
        console.log('- Investor Count:', projectDetails.investorCount);
        console.log('- Funding Successful:', projectDetails.fundingSuccessful);
      } catch (projectCheckError) {
        console.error('Project verification failed:', projectCheckError);
        throw new Error(
          `Cannot reclaim: Project ${projectId} not found on blockchain. Please ensure the project was properly deployed.`,
        );
      }

      // Then, try to get user address and check investment
      const userAddress = await this.getUserAddress();
      console.log('User address:', userAddress);

      if (!userAddress) {
        throw new Error('No wallet address found. Please connect your wallet.');
      }

      // Check the user's investment amount in the Funding module
      let hasInvestment = false;
      try {
        console.log('Checking user investment amount in Funding module...');
        const investmentData = await this.client.readContract({
          address: this.addresses.funding as `0x${string}`,
          abi: FUNDING_MODULE_ABI,
          functionName: 'getInvestmentAmount',
          args: [projectId, userAddress as `0x${string}`],
        });
        console.log('User investment amount on-chain:', investmentData);

        hasInvestment = Boolean(investmentData && Number(investmentData) > 0);

        if (!hasInvestment) {
          console.log('No investment found for user:', userAddress);
          throw new Error(
            `No investment found for your wallet address ${userAddress} in project ${projectId}`,
          );
        }

        console.log('Investment confirmed! Amount:', investmentData, 'Proceeding with reclaim...');

        // Check the actual reclaim eligibility to understand why it might fail
        try {
          console.log('Checking detailed reclaim eligibility...');
          const eligibilityData = await this.client.readContract({
            address: this.addresses.core as `0x${string}`,
            abi: INVESTMENT_CORE_ABI,
            functionName: 'checkReclaimEligibility',
            args: [projectId, userAddress as `0x${string}`],
          });

          const [canReclaim, reason, reclaimAmount] = eligibilityData as [boolean, string, bigint];
          console.log('Detailed eligibility check:');
          console.log('- Can reclaim:', canReclaim);
          console.log('- Reason:', reason);
          console.log('- Reclaim amount:', reclaimAmount);

          if (!canReclaim) {
            console.error('RECLAIM NOT ALLOWED:', reason);
            console.log('The contract says:', reason);
            console.log('Possible reasons:');
            console.log('1. "No investment found" - Investment not recorded on-chain');
            console.log(
              '2. "Cannot reclaim from successful project" - Project completed successfully',
            );
            console.log(
              '3. "Project still active" - Project is ongoing, not failed or past funding deadline',
            );

            // Don't proceed with transaction - throw error immediately
            if (reason === 'Project still active') {
              throw new Error(
                'The project is still active. Reclaim is only available if the project fails or the funding period ends without reaching the target.',
              );
            }
            if (reason === 'Cannot reclaim from successful project') {
              throw new Error(
                'This project completed successfully. Funds have been or will be distributed according to milestones.',
              );
            }
            if (reason === 'No investment found') {
              throw new Error('No investment found on the blockchain for your wallet address.');
            }
            throw new Error(`Cannot reclaim: ${reason}`);
          }

          console.log('Reclaim eligibility confirmed! Can proceed with transaction.');
        } catch (err) {
          console.error('Eligibility check error:', err);
          throw err; // Always re-throw to stop execution
        }
      } catch (e) {
        console.error('Investment check error:', e);
        // Re-throw any error to stop the transaction
        throw e;
      }

      // Call delegateReclaimFund on Core, which will delegate to Funding module
      // The Core contract orchestrates the reclaim process
      console.log('Encoding function data for delegateReclaimFund on Core contract...');
      console.log('Using Core contract at:', this.addresses.core);
      console.log('This will delegate to Funding contract at:', this.addresses.funding);
      const data = encodeFunctionData({
        abi: INVESTMENT_CORE_ABI,
        functionName: 'delegateReclaimFund',
        args: [projectId],
      });
      console.log('Encoded data:', data);
      console.log('Target contract (core):', this.addresses.core);

      console.log('Sending transaction...');
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
              title: 'Reclaim Investment',
              action: 'Reclaim',
            },
            description: `Reclaiming funds from project #${projectId}`,
            successHeader: 'Funds Reclaimed!',
            successDescription: 'Your investment has been returned.',
          },
        },
      );
      console.log('Transaction sent, hash:', txResult.hash);

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

      console.log('Transaction receipt:', receipt);
      console.log('Transaction status:', receipt.status);

      return {
        txHash: receipt.transactionHash,
        amount: reclaimedAmount,
        projectId,
      };
    } catch (error) {
      console.error('=== RECLAIM FUND ERROR ===');
      console.error('Error object:', error);

      // Try to extract more detailed error information
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error message:', errorMessage);

      // Check if it's a contract revert error
      if (errorMessage.includes('execution reverted')) {
        // Try to extract the revert reason
        const revertMatch = errorMessage.match(/execution reverted: (.*?)(?:\n|$)/);
        if (revertMatch) {
          console.error('Revert reason:', revertMatch[1]);
          throw new Error(`Contract reverted: ${revertMatch[1]}`);
        }

        // Check for common revert reasons
        if (errorMessage.includes('Project not found')) {
          throw new Error('Project not found on blockchain');
        }
        if (errorMessage.includes('Not investor')) {
          throw new Error('You are not an investor in this project');
        }
        if (errorMessage.includes('Cannot reclaim')) {
          throw new Error(
            'Project is not eligible for reclaim (may still be active or already completed successfully)',
          );
        }
        if (errorMessage.includes('Already reclaimed')) {
          throw new Error('You have already reclaimed your investment');
        }
        if (errorMessage.includes('No funds to reclaim')) {
          throw new Error('No funds available to reclaim');
        }
      }

      console.error('=== END RECLAIM FUND ERROR ===');
      throw error;
    }
  }

  async feeClaim(programId: number) {
    try {
      // Use delegateFeeClaim from core contract
      const data = encodeFunctionData({
        abi: INVESTMENT_CORE_ABI,
        functionName: 'delegateFeeClaim',
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

  async assignUserTier(params: {
    projectId: number;
    user: string;
    tierName: string;
    maxInvestment: string; // In smallest unit (wei)
  }) {
    try {
      const data = encodeFunctionData({
        abi: INVESTMENT_CORE_ABI,
        functionName: 'assignUserTier',
        args: [params.projectId, params.user, params.tierName, BigInt(params.maxInvestment)],
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
              title: 'Assign User Tier',
              action: 'Assign',
            },
            description: `Assigning ${params.tierName} tier to user for project #${params.projectId}`,
            successHeader: 'Tier Assigned!',
            successDescription: 'User tier has been assigned successfully.',
          },
        },
      );

      const receipt = await this.waitForTransaction(txResult.hash);
      return {
        txHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error('Failed to assign user tier:', error);
      throw error;
    }
  }

  async assignUserTierToProgram(params: {
    programId: number;
    user: string;
    tierName: string;
    maxInvestment: string; // In smallest unit (wei)
  }) {
    try {
      const data = encodeFunctionData({
        abi: INVESTMENT_CORE_ABI,
        functionName: 'assignUserTierToProgram',
        args: [params.programId, params.user, params.tierName, BigInt(params.maxInvestment)],
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
              title: 'Assign User Tier to Program',
              action: 'Assign',
            },
            description: `Assigning ${params.tierName} tier to user for program #${params.programId}`,
            successHeader: 'Tier Assigned!',
            successDescription: 'User tier has been assigned to the program successfully.',
          },
        },
      );

      const receipt = await this.waitForTransaction(txResult.hash);
      return {
        txHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error('Failed to assign user tier to program:', error);
      throw error;
    }
  }

  async submitProjectApplication(params: {
    programId: number;
    projectName: string;
    description: string;
    targetFunding: string;
    tokenDecimals?: number; // Optional token decimals, defaults to 18
    additionalData?: Record<string, unknown>;
  }) {
    try {
      // Convert target funding to smallest unit based on token decimals
      const decimals = params.tokenDecimals ?? 18; // Default to 18 decimals
      const targetFundingWei = ethers.utils.parseUnits(params.targetFunding, decimals);

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
      // First get the basic status
      const statusData = await this.client.readContract({
        address: this.addresses.core as `0x${string}`,
        abi: INVESTMENT_CORE_ABI,
        functionName: 'getProgramStatus',
        args: [programId],
      });

      // Then get the program details to check funding period
      const detailsData = await this.client.readContract({
        address: this.addresses.core as `0x${string}`,
        abi: INVESTMENT_CORE_ABI,
        functionName: 'getProgramDetails',
        args: [programId],
      });

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

  async debugContractInvestmentState(projectId: number, userAddress?: string) {
    try {
      // Get total investment from Funding contract
      const totalInvestmentWei = (await this.client.readContract({
        address: this.addresses.funding as `0x${string}`,
        abi: FUNDING_MODULE_ABI,
        functionName: 'getTotalInvestment',
        args: [projectId],
      })) as bigint;

      // Get project details for target funding
      const projectData = await this.client.readContract({
        address: this.addresses.core as `0x${string}`,
        abi: INVESTMENT_CORE_ABI,
        functionName: 'getProjectDetails',
        args: [projectId],
      });

      const details = projectData as [
        string, // name
        string, // applicant
        bigint, // targetFunding
        number, // status
        bigint, // createdAt
        bigint, // programId
      ];

      const targetFunding = details[2];

      // If user address provided, get their investment amount
      let userInvestmentWei = BigInt(0);
      if (userAddress) {
        userInvestmentWei = (await this.client.readContract({
          address: this.addresses.funding as `0x${string}`,
          abi: FUNDING_MODULE_ABI,
          functionName: 'getInvestmentAmount',
          args: [projectId, userAddress],
        })) as bigint;
      }

      return {
        totalInvestmentWei: totalInvestmentWei.toString(),
        targetFundingWei: targetFunding.toString(),
        isFull: totalInvestmentWei >= targetFunding,
        userInvestmentWei: userInvestmentWei.toString(),
      };
    } catch (error) {
      console.error('Failed to debug contract state:', error);
      throw error;
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
      console.log('Checking reclaim eligibility for project:', projectId, 'investor:', investor);
      console.log('Using core contract at:', this.addresses.core);

      const data = await this.client.readContract({
        address: this.addresses.core as `0x${string}`,
        abi: INVESTMENT_CORE_ABI,
        functionName: 'canReclaimFunds',
        args: [projectId, investor as `0x${string}`],
      });

      const [canReclaim, reason] = data as [boolean, string];
      console.log('Eligibility result - canReclaim:', canReclaim, 'reason:', reason);

      return { canReclaim, reason };
    } catch (error) {
      console.error('Failed to check reclaim eligibility:', error);

      // Try to extract more info from the error
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Eligibility check error details:', errorMessage);

      return { canReclaim: false, reason: `Failed to check eligibility: ${errorMessage}` };
    }
  }

  /**
   * Mark a project as failed (admin/owner only) - useful for testing reclaim
   */
  async markProjectAsFailed(projectId: number, reason = 'Test failure for reclaim testing') {
    try {
      console.log('Marking project as failed:', projectId);
      console.log('Reason:', reason);

      const data = encodeFunctionData({
        abi: INVESTMENT_CORE_ABI,
        functionName: 'markProjectAsFailed',
        args: [projectId, reason],
      });

      const txResult = await this.sendTransaction({
        to: this.addresses.core as `0x${string}`,
        data,
        value: BigInt(0),
        chainId: this.chainId,
      } as Parameters<typeof this.sendTransaction>[0]);

      console.log('Transaction hash:', txResult.hash);

      // Wait for transaction confirmation
      const receipt = await this.waitForTransaction(txResult.hash as `0x${string}`);
      console.log('Project marked as failed successfully');

      return {
        txHash: receipt.transactionHash,
        projectId,
      };
    } catch (error) {
      console.error('Failed to mark project as failed:', error);
      throw error;
    }
  }

  async checkInvestmentEligibility(
    projectId: number,
    investor: string,
    amount: string,
  ): Promise<{ eligible: boolean; reason: string }> {
    try {
      // Validate amount before conversion
      if (!amount || amount === '') {
        return { eligible: false, reason: 'Investment amount is required' };
      }

      // Convert amount string (in Wei) directly to BigInt
      let amountBigInt: bigint;
      try {
        amountBigInt = BigInt(amount);
      } catch (error) {
        console.error('Invalid amount for BigInt conversion:', amount, error);
        return { eligible: false, reason: 'Invalid investment amount format' };
      }

      // Check for zero amount
      if (amountBigInt === BigInt(0)) {
        return { eligible: false, reason: 'Investment amount must be greater than 0' };
      }

      const data = await this.client.readContract({
        address: this.addresses.funding as `0x${string}`,
        abi: FUNDING_MODULE_ABI,
        functionName: 'isUserEligibleToInvest',
        args: [projectId, investor as `0x${string}`, amountBigInt],
      });

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
