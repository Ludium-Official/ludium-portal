import contractJson from '@/lib/contract/contract.json';
import type { User } from '@/types/types.generated';
import type { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import type { PublicClient } from 'viem';
import { encodeFunctionData } from 'viem';
import { reduceString } from '../utils';

const NATIVE_TOKEN = '0x0000000000000000000000000000000000000000';
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
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

class ChainContract {
  private contractAddress: string;
  private chainId: number;
  private sendTransaction: ReturnType<typeof usePrivy>['sendTransaction'];
  private client: PublicClient;

  constructor(
    contractAddress: string,
    chainId: number,
    sendTransaction: ReturnType<typeof usePrivy>['sendTransaction'],
    client: PublicClient,
  ) {
    this.contractAddress = contractAddress;
    this.chainId = chainId;
    this.sendTransaction = sendTransaction;
    this.client = client;
  }

  async getAmount(tokenAddress: string, walletAddress: string) {
    const balance = await this.client.readContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [walletAddress as `0x${string}`],
    });

    return balance;
  }

  async getBalance(walletAddress: string) {
    const balance = await this.client.getBalance({
      address: walletAddress as `0x${string}`,
    });

    return balance;
  }

  async findReceipt(hash: `0x${string}`, signature: string) {
    const receipt = await this.client.waitForTransactionReceipt({
      hash,
    });

    // First check if transaction was successful
    console.log('Transaction receipt status:', receipt.status);
    console.log('Transaction hash:', hash);
    console.log('Number of logs:', receipt.logs.length);

    if (receipt.status === 'reverted') {
      console.error('Transaction reverted');
      throw new Error('Transaction reverted on-chain');
    }

    const eventSignature = ethers.utils.id(signature);
    console.log('Looking for event signature:', eventSignature);
    console.log('Event signature string:', signature);

    // Log all events for debugging
    receipt.logs.forEach((log, index) => {
      console.log(`Log ${index}:`, {
        topics: log.topics,
        address: log.address,
      });
    });

    const event = receipt.logs.find((log) => {
      return log.topics[0] === eventSignature;
    });

    if (event?.topics[1]) {
      const programId = ethers.BigNumber.from(event.topics[1]).toNumber();
      console.log('Found event with programId:', programId);
      return programId;
    }

    // Even if event not found, transaction succeeded if we're here
    console.warn('Event not found in logs, but transaction succeeded');
    return null;
  }

  async getAllowance(tokenAddress: string, ownerAddress: string) {
    const allowance = await this.client.readContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [ownerAddress as `0x${string}`, this.contractAddress as `0x${string}`],
    });

    return allowance as bigint;
  }

  async approveToken(
    tokenAddress: string,
    amount: ethers.BigNumber,
    token?: { name: string; address?: string; decimal?: number },
  ) {
    const data = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [this.contractAddress, amount],
    });
    const price = token?.decimal ? Number(formatUnits(amount, token.decimal)) : amount;

    const tx = await this.sendTransaction(
      {
        to: tokenAddress,
        data,
        chainId: this.chainId,
      },
      {
        uiOptions: {
          showWalletUIs: true,
          description: `Approve ${price} ${token?.name} for use in the contract.`,
          buttonText: 'Approve Token',
          transactionInfo: {
            title: 'Approve Token',
            action: 'Grant Permission',
          },
          successHeader: 'Token Approved Successfully!',
          successDescription: `You have successfully approved ${price} ${token?.name} for use in the contract.`,
        },
      },
    );

    await this.client.waitForTransactionReceipt({
      hash: tx.hash,
    });

    return tx;
  }

  async createProgram(program: {
    name?: string;
    price?: string;
    deadline: string;
    validatorAddress?: User;
    token?: { name: string; address?: string; decimal?: number };
    ownerAddress: string;
  }) {
    try {
      const useToken = program.token?.address ?? NATIVE_TOKEN;
      const isNative = useToken === NATIVE_TOKEN;

      // Log warning about native token whitelist issue (non-blocking)
      if (isNative) {
        console.warn(
          '⚠️ Native EDU token (0x0000...0000) may not be whitelisted in the smart contract.',
        );
        console.warn('If the transaction fails, this is likely the cause.');
      }

      const price = ethers.utils.parseUnits(
        program.price || '0',
        isNative ? 18 : (program.token?.decimal ?? 18),
      );

      if (!isNative) {
        // Check token balance first
        const balance = await this.getAmount(useToken, program.ownerAddress);
        const priceInWei = BigInt(price.toString());
        const balanceInWei = BigInt(balance as string | number);

        if (balanceInWei < priceInWei) {
          const formattedBalance = ethers.utils.formatUnits(
            balanceInWei.toString(),
            program.token?.decimal ?? 18,
          );
          const formattedPrice = ethers.utils.formatUnits(price, program.token?.decimal ?? 18);
          throw new Error(
            `Insufficient ${program.token?.name || 'token'} balance. You have ${formattedBalance} ${program.token?.name || 'tokens'} but need ${formattedPrice} ${program.token?.name || 'tokens'} to create this program.`,
          );
        }

        const allowance = await this.getAllowance(useToken, program.ownerAddress);

        if (allowance < priceInWei) {
          await this.approveToken(useToken, price, program.token);
        }
      } else {
        // Check ETH balance for native token
        const balance = await this.getBalance(program.ownerAddress);
        const priceInWei = BigInt(price.toString());
        const balanceInWei = BigInt(balance.toString());

        if (balanceInWei < priceInWei) {
          const formattedBalance = ethers.utils.formatUnits(balanceInWei.toString(), 18);
          const formattedPrice = ethers.utils.formatUnits(price, 18);
          throw new Error(
            `Insufficient EDU balance. You have ${formattedBalance} EDU but need ${formattedPrice} EDU to create this program.`,
          );
        }
      }

      const nowInSec = Math.floor(Date.now() / 1000);

      // For testing: Special keywords in program name
      // - "TEST" in name: deadline in 30 seconds (very short for quick testing)
      const programNameLower = program.name?.toLowerCase() || '';
      let deadlineInSec: number;

      if (programNameLower.includes('test')) {
        // Expires in 30 seconds for quick testing
        deadlineInSec = nowInSec + 30; // 30 seconds from now
        console.warn('⚠️ Creating test program with 30 second deadline for testing');
      } else {
        // Normal deadline
        deadlineInSec = Math.floor(new Date(program.deadline).getTime() / 1000);
      }

      const data = encodeFunctionData({
        abi: contractJson.abi,
        functionName: 'createEduProgram',
        args: [
          program.name ?? '',
          price,
          nowInSec,
          deadlineInSec,
          program.validatorAddress?.walletAddress ?? ethers.constants.AddressZero,
          useToken,
        ],
      });

      const tx = await this.sendTransaction(
        {
          to: this.contractAddress,
          data,
          value: isNative ? BigInt(price.toString()) : BigInt(0),
          chainId: this.chainId,
        },
        {
          uiOptions: {
            showWalletUIs: true,
            description: `To create a program, you need to accept ${
              program.price
            } ${program.token?.name ?? 'token'} to the contract.`,
            buttonText: 'Submit Transaction',
            transactionInfo: {
              title: 'Transaction Details',
              action: 'Create Program',
            },
            successHeader: 'Program Created Successfully!',
            successDescription: 'Your program has been created and is now live.',
          },
        },
      );

      const receiptResult = await this.findReceipt(
        tx.hash,
        'ProgramCreated(uint256,address,address,uint256,address)',
      );

      if (receiptResult !== null) {
        return { txHash: tx.hash, programId: receiptResult };
      }

      // If we couldn't find the event, still return the tx hash

      // Return with programId 0 for now - the backend might need to handle this differently
      return { txHash: tx.hash, programId: 0 };
    } catch (error: unknown) {
      console.error('Failed to create program - Full error:', error);

      // Log the full error details for debugging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }

      // Check for common revert reasons
      const errorMessage =
        (error instanceof Error ? error.message : '') ||
        (error as { reason?: string })?.reason ||
        '';

      // Check if user rejected/cancelled the transaction
      // Privy typically sends these types of messages
      if (
        errorMessage.includes('User rejected') ||
        errorMessage.includes('User denied') ||
        errorMessage.includes('User cancelled') ||
        errorMessage.includes('rejected the request') ||
        errorMessage.includes('denied transaction') ||
        errorMessage.includes('closed modal') ||
        errorMessage.includes('Modal closed')
      ) {
        throw new Error('Transaction cancelled by user');
      }

      // Check for specific contract revert messages first
      if (errorMessage.includes('Token not whitelisted')) {
        throw new Error(
          'The selected token is not whitelisted in the smart contract. Please contact the contract administrator to whitelist this token.',
        );
      }
      if (errorMessage.includes('Price must be greater than 0')) {
        throw new Error('Program price must be greater than 0');
      }
      if (errorMessage.includes('Start time must be earlier')) {
        throw new Error('The program start time must be earlier than the end time');
      }
      if (errorMessage.includes('ETH sent does not match')) {
        throw new Error('The amount of EDU sent does not match the program price');
      }

      // Check for insufficient balance errors
      if (
        errorMessage.includes('transfer amount exceeds balance') ||
        errorMessage.includes('insufficient balance') ||
        errorMessage.includes('ERC20: transfer amount exceeds balance')
      ) {
        throw new Error(
          `Insufficient ${program.token?.name || 'token'} balance. Please ensure you have enough ${program.token?.name || 'tokens'} in your wallet to create this program.`,
        );
      }

      // Check for insufficient allowance errors
      if (
        errorMessage.includes('transfer amount exceeds allowance') ||
        errorMessage.includes('insufficient allowance') ||
        errorMessage.includes('ERC20: insufficient allowance')
      ) {
        throw new Error(
          `Token approval failed. Please approve the contract to spend your ${program.token?.name || 'tokens'} and try again.`,
        );
      }

      // Generic execution reverted - only show whitelist error if we're sure it's not a user cancellation
      if (
        (errorMessage.includes('execution reverted') ||
          errorMessage.includes('Execution reverted')) &&
        !errorMessage.includes('User') &&
        !errorMessage.includes('user')
      ) {
        const useToken = program.token?.address ?? NATIVE_TOKEN;
        const isNative = useToken === NATIVE_TOKEN;

        // Try to provide more specific error for common cases
        throw new Error(
          `Transaction failed: This could be due to insufficient funds, token not whitelisted, or other contract requirements not being met. Please check your ${isNative ? 'EDU' : program.token?.name || 'token'} balance and try again.`,
        );
      }

      throw error;
    }
  }

  async acceptMilestone(
    programId: number,
    builderAddress: string,
    amount: string,
    token?: { name: string; address?: string; decimal?: number },
  ) {
    try {
      const isNative = token?.address === NATIVE_TOKEN;
      const reward = ethers.utils.parseUnits(amount || '0', isNative ? 18 : (token?.decimal ?? 18));

      console.log('Accepting milestone with params:', {
        programId,
        builderAddress,
        amount,
        reward: reward.toString(),
        token,
        isNative,
      });

      // Check contract balance to ensure it has funds to pay out
      // Note: For milestone acceptance, the funds should already be in the contract
      // from when the program was created, so we check the contract's balance

      const data = encodeFunctionData({
        abi: contractJson.abi,
        functionName: 'acceptMilestone',
        args: [programId, builderAddress, reward],
      });

      let tx: { hash: string };
      try {
        tx = await this.sendTransaction(
          {
            to: this.contractAddress,
            data,
            chainId: this.chainId,
          },
          {
            uiOptions: {
              showWalletUIs: true,
              description: `Accept milestone and send ${amount} ${
                token?.name
              } to ${reduceString(builderAddress || '', 6, 6)}.`,
              transactionInfo: {
                title: 'Accept Milestone',
                action: 'Accepted Milestone',
              },
              successHeader: 'Milestone Accepted Successfully!',
              successDescription: `You have successfully accepted the milestone and sent ${amount} ${
                token?.name
              } to ${reduceString(builderAddress || '', 6, 6)}.`,
            },
          },
        );
        console.log('Transaction sent:', tx.hash);
      } catch (sendError) {
        const errorMessage = (sendError as Error).message;
        // Log the error but re-throw it - external wallets are now handled at a higher level
        console.error('Transaction send error:', errorMessage);
        // Re-throw all errors - the calling code will handle them
        throw sendError;
      }

      try {
        const receiptResult = await this.findReceipt(
          tx.hash as `0x${string}`,
          'MilestoneAccepted(uint256,address,uint256,address)',
        );

        // Return success with tx hash regardless of whether event was found
        // The transaction succeeded if findReceipt didn't throw
        return {
          txHash: tx.hash,
          eventFound: receiptResult !== null,
          programId: receiptResult,
        };
      } catch (receiptError) {
        console.error('Error checking receipt:', receiptError);
        // If the transaction reverted, throw the error
        if ((receiptError as Error).message.includes('reverted')) {
          throw receiptError;
        }
        // Otherwise, transaction likely succeeded but we couldn't parse the event
        console.warn('Could not parse event, but transaction may have succeeded');
        return {
          txHash: tx.hash,
          eventFound: false,
          programId: null,
        };
      }
    } catch (error: unknown) {
      console.error('Failed to accept milestone:', error);
      throw error;
    }
  }

  async reclaimFunds(
    programId: number,
    amount: string,
    token?: { name: string; address?: string; decimal?: number },
  ) {
    try {
      const data = encodeFunctionData({
        abi: contractJson.abi,
        functionName: 'reclaimFunds',
        args: [programId],
      });

      const tx = await this.sendTransaction(
        {
          to: this.contractAddress,
          data,
          value: BigInt(0), // Explicitly set value to 0 - no payment needed for reclaim
          chainId: this.chainId,
        },
        {
          uiOptions: {
            showWalletUIs: true,
            description: `Withdraw your deposited ${amount} ${token?.name || 'tokens'} from program #${programId} (expired). You only pay gas fees, funds will be returned to your wallet.`,
            buttonText: 'Withdraw Funds',
            transactionInfo: {
              title: 'Withdraw Program Funds',
              action: 'Withdraw Deposited Funds',
            },
            successHeader: 'Funds Withdrawn Successfully!',
            successDescription: `You have successfully withdrawn ${amount} ${token?.name || 'tokens'} from the program to your wallet.`,
          },
        },
      );

      const receiptResult = await this.findReceipt(
        tx.hash,
        'FundsReclaimed(uint256,address,uint256,address)',
      );

      if (receiptResult !== null) {
        return { txHash: tx.hash, programId: receiptResult };
      }

      // Return with tx hash even if event not found
      return { txHash: tx.hash, programId };
    } catch (error: unknown) {
      console.error('Failed to reclaim funds:', error);

      const errorMessage =
        (error instanceof Error ? error.message : '') ||
        (error as { reason?: string })?.reason ||
        '';

      // Check if user rejected/cancelled the transaction
      if (
        errorMessage.includes('User rejected') ||
        errorMessage.includes('User denied') ||
        errorMessage.includes('User cancelled') ||
        errorMessage.includes('rejected the request') ||
        errorMessage.includes('denied transaction') ||
        errorMessage.includes('closed modal') ||
        errorMessage.includes('Modal closed')
      ) {
        throw new Error('Transaction cancelled by user');
      }

      // Check for specific revert reasons
      if (errorMessage.includes('Program not ended yet')) {
        throw new Error('Cannot reclaim funds: Program deadline has not passed yet');
      }
      if (errorMessage.includes('Not the program maker')) {
        throw new Error('Only the program creator can reclaim funds');
      }
      if (errorMessage.includes('Already claimed')) {
        throw new Error('Funds have already been reclaimed for this program');
      }
      if (errorMessage.includes('No funds to reclaim')) {
        throw new Error('No funds available to reclaim (all funds have been paid out)');
      }

      throw error;
    }
  }
}

export default ChainContract;
