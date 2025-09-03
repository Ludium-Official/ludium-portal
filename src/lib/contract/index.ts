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

    const eventSignature = ethers.utils.id(signature);

    const event = receipt.logs.find((log) => {
      return log.topics[0] === eventSignature;
    });

    if (event?.topics[1]) {
      const programId = ethers.BigNumber.from(event.topics[1]).toNumber();

      return programId;
    }

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

      const price = isNative
        ? ethers.utils.parseEther(program.price || '0')
        : ethers.utils.parseUnits(program.price || '0', program.token?.decimal ?? 18);

      if (!isNative) {
        const allowance = await this.getAllowance(useToken, program.ownerAddress);
        const priceInWei = BigInt(price.toString());

        if (allowance < priceInWei) {
          await this.approveToken(useToken, price, program.token);
        }
      }

      const nowInSec = Math.floor(Date.now() / 1000);
      const deadlineInSec = Math.floor(new Date(program.deadline).getTime() / 1000);

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
      console.error('Failed to create program:', error);

      // Check for common revert reasons
      const errorMessage =
        (error instanceof Error ? error.message : '') ||
        (error as { reason?: string })?.reason ||
        '';

      // Check for whitelist error (common cause)
      if (
        errorMessage.includes('execution reverted') ||
        errorMessage.includes('Execution reverted')
      ) {
        const useToken = program.token?.address ?? NATIVE_TOKEN;
        const isNative = useToken === NATIVE_TOKEN;

        if (isNative) {
          throw new Error(
            'Transaction failed: The native EDU token (0x0000...0000) is not whitelisted in the smart contract. Please contact the contract administrator to whitelist the native token.',
          );
        }
        throw new Error(
          `Transaction failed: The ${program.token?.name || 'selected'} token may not be whitelisted in the smart contract. Please contact the contract administrator.`,
        );
      }

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
      const reward = isNative
        ? ethers.utils.parseEther(amount || '0')
        : ethers.utils.parseUnits(amount || '0', token?.decimal);

      const data = encodeFunctionData({
        abi: contractJson.abi,
        functionName: 'acceptMilestone',
        args: [programId, builderAddress, reward],
      });

      const tx = await this.sendTransaction(
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

      const receiptResult = await this.findReceipt(
        tx.hash,
        'MilestoneAccepted(uint256,address,uint256,address)',
      );

      if (receiptResult) {
        return { txHash: tx.hash };
      }

      return null;
    } catch (error: unknown) {
      console.error('Failed to accept milestone:', error);
      throw error;
    }
  }
}

export default ChainContract;
