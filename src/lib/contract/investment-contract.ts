import type { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import type { PublicClient } from 'viem';
import { encodeFunctionData } from 'viem';

// Import contract ABIs
import LdInvestmentCoreArtifact from './abi/LdInvestmentCore.json';
import LdFundingArtifact from './abi/LdFunding.json';
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
      console.log('Contract createInvestmentProgram called with:', params);

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
        console.error('Application start date is in the past:', new Date(applicationStartTime * 1000).toISOString());
        console.error('Current time:', new Date(currentTime * 1000).toISOString());
        throw new Error('Application start date must be in the future');
      }
      if (fundingStartTime < currentTime) {
        console.error('Funding start date is in the past:', new Date(fundingStartTime * 1000).toISOString());
        throw new Error('Funding start date must be in the future');
      }

      // Log the contract address
      console.log('Using contract address:', this.addresses.core);
      console.log('Chain ID:', this.chainId);

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

      console.log('Function args:', args);
      console.log('Number of args:', args.length);

      const data = encodeFunctionData({
        abi: INVESTMENT_CORE_ABI,
        functionName: 'createInvestmentProgram',
        args,
      });

      // Send the transaction
      console.log('Sending transaction to:', this.addresses.core);
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

      console.log('Transaction sent, hash:', tx.hash);
      console.log('Waiting for transaction receipt...');

      // Wait for transaction receipt with timeout
      let receipt;
      try {
        receipt = await this.client.waitForTransactionReceipt({
          hash: tx.hash,
          confirmations: 1,
        });
        console.log('Transaction confirmed!');
      } catch (receiptError) {
        console.error('Error getting receipt:', receiptError);
        // Even if we can't get the receipt, the transaction might have succeeded
        return { txHash: tx.hash, programId: null };
      }

      console.log('Transaction receipt:', receipt);
      console.log('Receipt status:', receipt.status);
      
      // Check if transaction was successful
      if (receipt.status !== 'success') {
        console.error('Transaction failed with status:', receipt.status);
        throw new Error('Transaction failed');
      }
      
      console.log('Number of logs:', receipt.logs?.length || 0);
      
      // Log all events for debugging
      if (receipt.logs && receipt.logs.length > 0) {
        receipt.logs.forEach((log, index) => {
          console.log(`Log ${index}:`, {
            address: log.address,
            topics: log.topics,
            data: log.data,
            logIndex: log.logIndex,
            transactionHash: log.transactionHash,
          });
        });
      } else {
        console.warn('No logs found in receipt');
      }

      // Try multiple approaches to extract program ID
      
      // Approach 1: Standard event signature matching
      const eventSignature = ethers.utils.id('InvestmentProgramCreated(uint256,address,string,uint256,address)');
      console.log('Looking for event signature:', eventSignature);
      
      // Find the event in the logs
      const event = receipt.logs.find((log) => {
        const matches = log.topics[0]?.toLowerCase() === eventSignature.toLowerCase();
        if (matches) {
          console.log('Found matching event!');
        }
        return matches;
      });

      if (event && event.topics[1]) {
        // The program ID is in the first indexed parameter (topics[1])
        const programId = parseInt(event.topics[1], 16);
        console.log('Extracted program ID:', programId);
        return { txHash: tx.hash, programId };
      }

      // Approach 2: Try to decode using viem's parseEventLogs
      if (!event && receipt.logs && receipt.logs.length > 0) {
        console.log('Trying to parse events with viem...');
        try {
          // Try to find any log from the core contract address
          const coreLogs = receipt.logs.filter(log => 
            log.address?.toLowerCase() === this.addresses.core.toLowerCase()
          );
          
          if (coreLogs.length > 0) {
            console.log(`Found ${coreLogs.length} logs from core contract`);
            // The first log from core contract is likely the program creation
            const programLog = coreLogs[0];
            if (programLog.topics && programLog.topics[1]) {
              const programId = parseInt(programLog.topics[1], 16);
              console.log('Extracted program ID from core contract log:', programId);
              if (programId >= 0 && programId < 1000000) {
                return { txHash: tx.hash, programId };
              }
            }
          }
        } catch (parseError) {
          console.error('Error parsing events:', parseError);
        }
      }

      // Approach 3: Fallback to first log
      if (receipt.logs && receipt.logs.length > 0) {
        console.log('Trying fallback extraction from first log...');
        const firstLog = receipt.logs[0];
        
        // Try to parse as program ID from topics[1] (first indexed param)
        if (firstLog.topics && firstLog.topics[1]) {
          const possibleProgramId = parseInt(firstLog.topics[1], 16);
          console.log('Possible program ID from first log:', possibleProgramId);
          
          // Sanity check - program ID should be a reasonable number
          if (possibleProgramId >= 0 && possibleProgramId < 1000000) {
            return { txHash: tx.hash, programId: possibleProgramId };
          }
        }
      }

      console.warn('Could not extract program ID from transaction logs');
      // Return 0 as a default program ID for testing
      console.log('Using default program ID 0 for testing');
      return { txHash: tx.hash, programId: 0 };
    } catch (error: any) {
      console.error('Failed to create investment program:', error);
      
      // Try to extract revert reason
      if (error?.cause?.reason) {
        console.error('Revert reason:', error.cause.reason);
      }
      if (error?.shortMessage) {
        console.error('Error message:', error.shortMessage);
      }
      
      // Log the parameters for debugging
      console.log('Parameters sent:', {
        name: params.name,
        validators: params.validators,
        fundingGoal: params.fundingGoal,
        fundingToken: params.fundingToken,
        dates: {
          applicationStart: params.applicationStartDate,
          applicationEnd: params.applicationEndDate,
          fundingStart: params.fundingStartDate,
          fundingEnd: params.fundingEndDate,
        },
        feePercentage: params.feePercentage,
      });
      
      throw error;
    }
  }

  async invest(projectId: number, amount: string, tokenAddress: string) {
    try {
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
    } catch (error) {
      console.error('Failed to invest:', error);
      throw error;
    }
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
    try {
      console.log('Approving milestone for project:', projectId, 'milestone:', milestoneIndex);
      console.log('Using milestone contract address:', this.addresses.milestone);
      
      // Call approveMilestone which only records the approval (no funds transferred)
      const data = encodeFunctionData({
        abi: MILESTONE_MANAGER_ABI,
        functionName: 'approveMilestone',
        args: [projectId, milestoneIndex],
      });
      
      console.log('Encoded function data:', data);

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
            successDescription: 'Your approval has been recorded. If this was the final approval needed, funds will be released automatically.',
          },
        },
      );

      // Wait for transaction to be mined
      await this.client.waitForTransactionReceipt({
        hash: tx.hash,
      });

      return { txHash: tx.hash };
    } catch (error) {
      console.error('Failed to approve milestone:', error);
      throw error;
    }
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
    try {
      console.log('=== signValidateProject called ===');
      console.log('Full params:', JSON.stringify(params, null, 2));

      const targetFundingWei = ethers.utils.parseEther(params.targetFunding);

      // Convert milestones to contract format
      const milestonesForContract = params.milestones.map(m => ({
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

      console.log('Project validation receipt:', receipt);
      console.log('Project validation logs:', receipt.logs);

      // Extract project ID from events
      // Event: ProjectValidated(uint256 indexed programId, uint256 indexed projectId, address projectOwner, string projectName, uint256 targetFunding)
      const eventSignature = ethers.utils.id('ProjectValidated(uint256,uint256,address,string,uint256)');
      console.log('Looking for ProjectValidated event signature:', eventSignature);
      
      const event = receipt.logs.find((log) => {
        console.log('Checking log topic:', log.topics[0]);
        return log.topics[0]?.toLowerCase() === eventSignature.toLowerCase();
      });

      if (event && event.topics[2]) {
        // Project ID is the second indexed parameter (topics[2])
        const projectId = parseInt(event.topics[2], 16);
        console.log('✅ Successfully extracted project ID:', projectId);
        return { txHash: tx.hash, projectId };
      }

      console.warn('⚠️ Could not find ProjectValidated event in transaction logs');
      
      // Try to extract from any log that might contain the project ID
      if (receipt.logs.length > 0) {
        console.log('Attempting fallback extraction from logs...');
        
        // Look for logs from the core contract
        const coreLogs = receipt.logs.filter(log => 
          log.address?.toLowerCase() === this.addresses.core.toLowerCase()
        );
        
        if (coreLogs.length > 0 && coreLogs[0].topics[2]) {
          const possibleProjectId = parseInt(coreLogs[0].topics[2], 16);
          console.log('📝 Using project ID from core contract log:', possibleProjectId);
          return { txHash: tx.hash, projectId: possibleProjectId };
        }
        
        // Last resort - check first log
        if (receipt.logs[0].topics && receipt.logs[0].topics.length > 2) {
          const possibleProjectId = parseInt(receipt.logs[0].topics[2], 16);
          console.log('📝 Using project ID from first log (fallback):', possibleProjectId);
          return { txHash: tx.hash, projectId: possibleProjectId };
        }
      }

      console.error('❌ Could not extract project ID. Using ID 0 as fallback.');
      return { txHash: tx.hash, projectId: 0 };
    } catch (error) {
      console.error('Failed to validate project:', error);
      throw error;
    }
  }
}
