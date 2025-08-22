import type { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import type { PublicClient } from 'viem';
import { encodeFunctionData } from 'viem';

import LdFundingArtifact from './abi/LdFunding.json';
// Import contract ABIs
import LdInvestmentCoreArtifact from './abi/LdInvestmentCore.json';
import LdMilestoneManagerArtifact from './abi/LdMilestoneManager.json';
// import LdTimeLockArtifact from './abi/LdTimeLock.json';

// Extract ABIs from artifacts
const INVESTMENT_CORE_ABI = LdInvestmentCoreArtifact.abi;
const FUNDING_MODULE_ABI = LdFundingArtifact.abi;
const MILESTONE_MANAGER_ABI = LdMilestoneManagerArtifact.abi;
// const TIMELOCK_ABI = LdTimeLockArtifact.abi;

export interface InvestmentContractAddresses {
  core: string;
  funding: string;
  milestone: string;
  timeLock: string;
}

export class InvestmentContract {
  private addresses: InvestmentContractAddresses;
  private chainId: number;
  private sendTransaction: ReturnType<typeof usePrivy>['sendTransaction'];
  private client: PublicClient;

  constructor(
    addresses: InvestmentContractAddresses,
    chainId: number,
    sendTransaction: ReturnType<typeof usePrivy>['sendTransaction'],
    client: PublicClient,
  ) {
    this.addresses = addresses;
    this.chainId = chainId;
    this.sendTransaction = sendTransaction;
    this.client = client;
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
    feePercentage: number;
    validators: string[];
    tierSettings?: {
      bronze?: { enabled: boolean; maxAmount: string };
      silver?: { enabled: boolean; maxAmount: string };
      gold?: { enabled: boolean; maxAmount: string };
      platinum?: { enabled: boolean; maxAmount: string };
    };
  }) {
    try {
      // Validate inputs
      if (!params.name || params.name.trim() === '') {
        throw new Error('Program name is required');
      }

      if (!params.validators || params.validators.length === 0) {
        throw new Error('At least one validator is required');
      }

      const fundingGoalWei = ethers.utils.parseEther(params.fundingGoal);

      // Convert dates to timestamps
      const applicationStartTime = Math.floor(
        new Date(params.applicationStartDate).getTime() / 1000,
      );
      const applicationEndTime = Math.floor(new Date(params.applicationEndDate).getTime() / 1000);
      const fundingStartTime = Math.floor(new Date(params.fundingStartDate).getTime() / 1000);
      const fundingEndTime = Math.floor(new Date(params.fundingEndDate).getTime() / 1000);

      // Validate dates
      const currentTime = Math.floor(Date.now() / 1000);
      if (applicationStartTime < currentTime) {
        throw new Error('Application start date must be in the future');
      }
      if (fundingStartTime < currentTime) {
        throw new Error('Funding start date must be in the future');
      }

      // Encode the transaction data
      // Function signature: createInvestmentProgram(string,address[],uint256,uint256,uint256,uint256,uint256,uint256,uint8,uint256,address)
      const args = [
        params.name, // _name
        params.validators as `0x${string}`[], // _validators
        1, // _requiredApprovals (default to 1 for now)
        fundingGoalWei, // _maxFundingPerProject (using funding goal as max per project)
        applicationStartTime, // _applicationStartTime
        applicationEndTime, // _applicationEndTime
        fundingStartTime, // _fundingStartTime
        fundingEndTime, // _fundingEndTime
        params.tierSettings ? 1 : 0, // _condition (0 = Open, 1 = Tier)
        params.feePercentage, // _feePercentage
        params.fundingToken as `0x${string}`, // _token
      ];

      const data = encodeFunctionData({
        abi: INVESTMENT_CORE_ABI,
        functionName: 'createInvestmentProgram',
        args,
      });

      // Send the transaction
      const tx = await this.sendTransaction(
        {
          to: this.addresses.core as `0x${string}`,
          data,
          chainId: this.chainId,
        },
        {
          uiOptions: {
            showWalletUIs: true,
            description: `Creating investment program: ${params.name}`,
            buttonText: 'Create Program',
            transactionInfo: {
              title: 'Create Investment Program',
              action: 'Create',
            },
            successHeader: 'Program Created Successfully!',
            successDescription: 'Your investment program has been created and is now live.',
          },
        },
      );

      // Wait for transaction receipt with timeout
      let receipt: Awaited<ReturnType<typeof this.client.waitForTransactionReceipt>>;
      try {
        receipt = await this.client.waitForTransactionReceipt({
          hash: tx.hash,
          confirmations: 1,
        });
      } catch (receiptError) {
        console.error('Error getting receipt:', receiptError);
        // Even if we can't get the receipt, the transaction might have succeeded
        return { txHash: tx.hash, programId: null };
      }

      // Check if transaction was successful
      if (receipt.status !== 'success') {
        throw new Error('Transaction failed');
      }

      // Try multiple approaches to extract program ID

      // Approach 1: Standard event signature matching
      const eventSignature = ethers.utils.id(
        'InvestmentProgramCreated(uint256,address,string,uint256,address)',
      );

      // Find the event in the logs
      const event = receipt.logs.find((log) => {
        return log.topics[0]?.toLowerCase() === eventSignature.toLowerCase();
      });

      if (event?.topics[1]) {
        // The program ID is in the first indexed parameter (topics[1])
        const programId = Number.parseInt(event.topics[1], 16);
        return { txHash: tx.hash, programId };
      }

      // Approach 2: Try to find logs from core contract
      if (!event && receipt.logs && receipt.logs.length > 0) {
        try {
          const coreLogs = receipt.logs.filter(
            (log) => log.address?.toLowerCase() === this.addresses.core.toLowerCase(),
          );

          if (coreLogs.length > 0) {
            const programLog = coreLogs[0];
            if (programLog.topics?.[1]) {
              const programId = Number.parseInt(programLog.topics[1], 16);
              if (programId >= 0 && programId < 1000000) {
                return { txHash: tx.hash, programId };
              }
            }
          }
        } catch (_parseError) {
          // Silent fail, try next approach
        }
      }

      // Approach 3: Fallback to first log
      if (receipt.logs && receipt.logs.length > 0) {
        const firstLog = receipt.logs[0];
        if (firstLog.topics?.[1]) {
          const possibleProgramId = Number.parseInt(firstLog.topics[1], 16);
          if (possibleProgramId >= 0 && possibleProgramId < 1000000) {
            return { txHash: tx.hash, programId: possibleProgramId };
          }
        }
      }

      // Return 0 as a default program ID if extraction fails
      return { txHash: tx.hash, programId: 0 };
    } catch (error) {
      console.error('Error in investment creation:', error);
      throw error;
    }
  }

  async invest(projectId: number, amount: string, tokenAddress: string) {
    const isNative = tokenAddress === '0x0000000000000000000000000000000000000000';
    const amountWei = ethers.utils.parseEther(amount);

    const data = encodeFunctionData({
      abi: FUNDING_MODULE_ABI,
      functionName: isNative ? 'investFund' : 'investWithToken',
      args: isNative ? [projectId] : [projectId, amountWei],
    });

    const tx = await this.sendTransaction(
      {
        to: this.addresses.funding as `0x${string}`,
        data,
        value: isNative ? BigInt(amountWei.toString()) : BigInt(0),
        chainId: this.chainId,
      },
      {
        uiOptions: {
          showWalletUIs: true,
          description: `Investing ${amount} in project`,
          buttonText: 'Invest',
          transactionInfo: {
            title: 'Investment',
            action: 'Invest',
          },
          successHeader: 'Investment Successful!',
          successDescription: 'Your investment has been recorded.',
        },
      },
    );

    await this.client.waitForTransactionReceipt({
      hash: tx.hash,
    });

    return tx;
  }

  async checkReclaimEligibility(programId: number, projectId: number, investor: string) {
    try {
      const data = await this.client.readContract({
        address: this.addresses.core as `0x${string}`,
        abi: INVESTMENT_CORE_ABI,
        functionName: 'checkReclaimEligibility',
        args: [programId, projectId, investor as `0x${string}`],
      });

      const [canReclaim, reason, reclaimAmount] = data as [boolean, string, bigint];

      return {
        canReclaim,
        reason,
        reclaimAmount: Number(ethers.utils.formatEther(reclaimAmount)),
      };
    } catch (error) {
      console.error('Failed to check reclaim eligibility:', error);
      return {
        canReclaim: false,
        reason: 'Failed to check eligibility',
        reclaimAmount: 0,
      };
    }
  }

  async approveMilestone(projectId: number, milestoneIndex: number) {
    // Call approveMilestone which only records the approval (no funds transferred)
    const data = encodeFunctionData({
      abi: MILESTONE_MANAGER_ABI,
      functionName: 'approveMilestone',
      args: [projectId, milestoneIndex],
    });

    const tx = await this.sendTransaction(
      {
        to: this.addresses.milestone as `0x${string}`,
        data,
        chainId: this.chainId,
      },
      {
        uiOptions: {
          showWalletUIs: true,
          description: 'Approving milestone (recording validator approval)',
          buttonText: 'Approve Milestone',
          transactionInfo: {
            title: 'Milestone Approval',
            action: 'Approve',
          },
          successHeader: 'Milestone Approved!',
          successDescription:
            'Your approval has been recorded. If this was the final approval needed, funds will be released automatically.',
        },
      },
    );

    // Wait for transaction to be mined
    await this.client.waitForTransactionReceipt({
      hash: tx.hash,
    });

    return { txHash: tx.hash };
  }

  async reclaimFunds(programId: number, projectId: number) {
    try {
      const data = encodeFunctionData({
        abi: INVESTMENT_CORE_ABI,
        functionName: 'reclaimFund',
        args: [programId, projectId],
      });

      const tx = await this.sendTransaction(
        {
          to: this.addresses.core as `0x${string}`,
          data,
          chainId: this.chainId,
        },
        {
          uiOptions: {
            showWalletUIs: true,
            description: 'Reclaiming your investment funds',
            buttonText: 'Reclaim Funds',
            transactionInfo: {
              title: 'Reclaim Investment',
              action: 'Reclaim',
            },
            successHeader: 'Funds Reclaimed!',
            successDescription: 'Your investment has been successfully refunded.',
          },
        },
      );

      return { txHash: tx.hash };
    } catch (error) {
      console.error('Failed to reclaim funds:', error);
      throw error;
    }
  }

  async getProjectFundingProgress(programId: number, projectId: number) {
    try {
      // Read project details from the blockchain
      const data = await this.client.readContract({
        address: this.addresses.core as `0x${string}`,
        abi: INVESTMENT_CORE_ABI,
        functionName: 'getProjectDetails',
        args: [programId, projectId],
      });

      const [name, owner, targetFunding, totalInvested, status, returnedProgramId] = data as [
        string,
        string,
        bigint,
        bigint,
        number,
        bigint,
      ];

      // Calculate funding progress percentage
      const targetAmount = Number(ethers.utils.formatEther(targetFunding));
      const investedAmount = Number(ethers.utils.formatEther(totalInvested));
      const progress = targetAmount > 0 ? (investedAmount / targetAmount) * 100 : 0;

      return {
        name,
        owner,
        targetFunding: targetAmount,
        totalInvested: investedAmount,
        fundingProgress: Math.min(progress, 100),
        status,
        programId: Number(returnedProgramId),
      };
    } catch (error) {
      console.error('Failed to get project funding progress:', error);
      // Return default values if the read fails
      return {
        name: '',
        owner: '',
        targetFunding: 0,
        totalInvested: 0,
        fundingProgress: 0,
        status: 0,
        programId: 0,
      };
    }
  }

  async signValidateProject(params: {
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
    const targetFundingWei = ethers.utils.parseEther(params.targetFunding);

    // Convert milestones to contract format
    const milestonesForContract = params.milestones.map((m) => ({
      title: m.title,
      description: m.description || '',
      percentage: m.percentage * 100, // Convert to basis points (1% = 100)
      deadline: Math.floor(new Date(m.deadline).getTime() / 1000),
    }));

    const data = encodeFunctionData({
      abi: INVESTMENT_CORE_ABI,
      functionName: 'signValidate',
      args: [
        params.programId,
        params.projectOwner as `0x${string}`,
        params.projectName,
        targetFundingWei,
        milestonesForContract,
      ],
    });

    const tx = await this.sendTransaction(
      {
        to: this.addresses.core as `0x${string}`,
        data,
        chainId: this.chainId,
      },
      {
        uiOptions: {
          showWalletUIs: true,
          description: `Validating project: ${params.projectName}`,
          buttonText: 'Validate Project',
          transactionInfo: {
            title: 'Project Validation',
            action: 'Validate',
          },
          successHeader: 'Project Validated!',
          successDescription: 'The project has been registered on the blockchain.',
        },
      },
    );

    // Wait for transaction receipt
    const receipt = await this.client.waitForTransactionReceipt({
      hash: tx.hash,
    });

    // Extract project ID from events
    // Event: ProjectValidated(uint256 indexed programId, uint256 indexed projectId, address projectOwner, string projectName, uint256 targetFunding)
    const eventSignature = ethers.utils.id(
      'ProjectValidated(uint256,uint256,address,string,uint256)',
    );

    const event = receipt.logs.find((log) => {
      return log.topics[0]?.toLowerCase() === eventSignature.toLowerCase();
    });

    if (event?.topics[2]) {
      // Project ID is the second indexed parameter (topics[2])
      const projectId = Number.parseInt(event.topics[2], 16);
      return { txHash: tx.hash, projectId };
    }

    // Try to extract from any log that might contain the project ID
    if (receipt.logs.length > 0) {
      // Look for logs from the core contract
      const coreLogs = receipt.logs.filter(
        (log) => log.address?.toLowerCase() === this.addresses.core.toLowerCase(),
      );

      if (coreLogs.length > 0 && coreLogs[0].topics?.[2]) {
        const possibleProjectId = Number.parseInt(coreLogs[0].topics[2], 16);
        return { txHash: tx.hash, projectId: possibleProjectId };
      }

      // Last resort - check first log
      if (
        receipt.logs[0].topics?.length &&
        receipt.logs[0].topics.length > 2 &&
        receipt.logs[0].topics[2]
      ) {
        const possibleProjectId = Number.parseInt(receipt.logs[0].topics[2], 16);
        return { txHash: tx.hash, projectId: possibleProjectId };
      }
    }

    // Fallback to ID 0 if extraction fails
    return { txHash: tx.hash, projectId: 0 };
  }
}
