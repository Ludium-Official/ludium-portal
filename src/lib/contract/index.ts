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
    const event = receipt.logs.find((log) => log.topics[0] === eventSignature);

    if (event) {
      return ethers.BigNumber.from(event.topics[1]).toNumber();
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

      if (receiptResult) {
        return { txHash: tx.hash, programId: receiptResult };
      }

      return null;
    } catch (error) {
      console.error('Failed to create program:', error);
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
    } catch (error) {
      console.error('Failed to accept milestone:', error);
      throw error;
    }
  }
}

export default ChainContract;
