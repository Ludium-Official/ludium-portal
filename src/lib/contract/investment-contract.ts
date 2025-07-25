import type { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import type { PublicClient } from 'viem';
import { encodeFunctionData } from 'viem';

// Import contract ABIs
import LdInvestmentCoreArtifact from './abi/LdInvestmentCore.json';
import LdFundingArtifact from './abi/LdFunding.json';
// import LdMilestoneManagerArtifact from './abi/LdMilestoneManager.json';
// import LdTimeLockArtifact from './abi/LdTimeLock.json';

// Extract ABIs from artifacts
const INVESTMENT_CORE_ABI = LdInvestmentCoreArtifact.abi;
const FUNDING_MODULE_ABI = LdFundingArtifact.abi;
// const MILESTONE_MANAGER_ABI = LdMilestoneManagerArtifact.abi;
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
      const fundingGoalWei = ethers.utils.parseEther(params.fundingGoal);

      // Convert dates to timestamps
      const applicationStartTime = Math.floor(
        new Date(params.applicationStartDate).getTime() / 1000,
      );
      const applicationEndTime = Math.floor(new Date(params.applicationEndDate).getTime() / 1000);
      const fundingStartTime = Math.floor(new Date(params.fundingStartDate).getTime() / 1000);
      const fundingEndTime = Math.floor(new Date(params.fundingEndDate).getTime() / 1000);

      // Encode the transaction data
      // Function signature: createInvestmentProgram(string,address[],uint256,uint256,uint256,uint256,uint256,uint256,uint8,uint256,address)
      const data = encodeFunctionData({
        abi: INVESTMENT_CORE_ABI,
        functionName: 'createInvestmentProgram',
        args: [
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
        ],
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

      // Wait for transaction receipt
      const receipt = await this.client.waitForTransactionReceipt({
        hash: tx.hash,
      });

      // Extract program ID from events
      // Event: InvestmentProgramCreated(uint256 indexed programId, address indexed creator)
      const eventSignature = ethers.utils.id('InvestmentProgramCreated(uint256,address)');
      const event = receipt.logs.find((log) => log.topics[0] === eventSignature);

      if (event) {
        const programId = ethers.BigNumber.from(event.topics[1]).toNumber();
        return { txHash: tx.hash, programId };
      }

      return { txHash: tx.hash, programId: null };
    } catch (error) {
      console.error('Failed to create investment program:', error);
      throw error;
    }
  }

  async invest(programId: number, projectId: number, amount: string, tokenAddress: string) {
    try {
      const isNative = tokenAddress === '0x0000000000000000000000000000000000000000';
      const amountWei = ethers.utils.parseEther(amount);

      const data = encodeFunctionData({
        abi: FUNDING_MODULE_ABI,
        functionName: 'invest',
        args: [programId, projectId, amountWei],
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
}
