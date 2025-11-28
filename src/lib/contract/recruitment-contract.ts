import type { usePrivy } from '@privy-io/react-auth';
import type { ConnectedWallet } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { type PublicClient, encodeFunctionData } from 'viem';
import type { Chain } from 'viem';
import ERC20Abi from './abi/ERC20';
import LdRecruitmentAbi from './abi/LdRecruitment';

class RecruitmentContract {
  private contractAddress: string;
  private chainId: number;
  private sendTransaction: ReturnType<typeof usePrivy>['sendTransaction'];
  private client: PublicClient;
  private signMessage?: (
    message: string | Uint8Array,
    wallet?: ConnectedWallet,
    chain?: Chain,
  ) => Promise<string>;

  constructor(
    contractAddress: string,
    chainId: number,
    sendTransaction: ReturnType<typeof usePrivy>['sendTransaction'],
    client: PublicClient,
    signMessage?: (
      message: string | Uint8Array,
      wallet?: ConnectedWallet,
      chain?: Chain,
    ) => Promise<string>,
  ) {
    this.contractAddress = contractAddress;
    this.chainId = chainId;
    this.sendTransaction = sendTransaction;
    this.client = client;
    this.signMessage = signMessage;
  }

  async createProgramV2(token: `0x${string}`, durationDays: bigint) {
    try {
      const data = encodeFunctionData({
        abi: LdRecruitmentAbi,
        functionName: 'createProgram',
        args: [token, durationDays],
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
            description: `Create Program`,
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
        'ProgramCreated(uint256,address,address)',
      );

      if (receiptResult !== null) {
        return { txHash: tx.hash, programId: receiptResult };
      }

      return { txHash: tx.hash, programId: null };
    } catch (err) {
      console.error('Failed to create program - Full error:', err);
    }
  }

  async getSponsorFeePercentage(): Promise<bigint> {
    try {
      const sponsorFee = await this.client.readContract({
        address: this.contractAddress as `0x${string}`,
        abi: LdRecruitmentAbi,
        functionName: 'sponsorFeePercentage',
      });

      return sponsorFee as bigint;
    } catch (err) {
      console.error('Failed to get sponsor fee percentage - Full error:', err);
      throw err;
    }
  }

  async getContract(contractId: number | string | bigint) {
    try {
      const contract = await this.client.readContract({
        address: this.contractAddress as `0x${string}`,
        abi: LdRecruitmentAbi,
        functionName: 'getContract',
        args: [BigInt(contractId)],
      });

      const contractData = contract as {
        id: bigint;
        programId: bigint;
        sponsor: `0x${string}`;
        builder: `0x${string}`;
        token: `0x${string}`;
        totalAmount: bigint;
        paidAmount: bigint;
        status: number;
        builderSig: `0x${string}`;
        snapshotHash: `0x${string}`;
        deadline: bigint;
      };

      const decimals = await this.getTokenDecimals(contractData.token);

      return {
        id: contractData.id.toString(),
        programId: contractData.programId.toString(),
        sponsor: contractData.sponsor,
        builder: contractData.builder,
        token: contractData.token,
        totalAmount: ethers.utils.formatUnits(contractData.totalAmount, decimals),
        paidAmount: ethers.utils.formatUnits(contractData.paidAmount, decimals),
        status: contractData.status,
        deadline: new Date(Number(contractData.deadline) * 1000).toISOString(),
        builderSig: contractData.builderSig,
        snapshotHash: contractData.snapshotHash,
      };
    } catch (err) {
      console.error('Failed to get contract - Full error:', err);
      throw err;
    }
  }

  async getContractAmounts(contractId: number | string | bigint) {
    try {
      const contract = await this.client.readContract({
        address: this.contractAddress as `0x${string}`,
        abi: LdRecruitmentAbi,
        functionName: 'getContract',
        args: [BigInt(contractId)],
      });

      const contractData = contract as {
        id: bigint;
        programId: bigint;
        sponsor: `0x${string}`;
        builder: `0x${string}`;
        token: `0x${string}`;
        totalAmount: bigint;
        paidAmount: bigint;
        status: number;
        builderSig: `0x${string}`;
        snapshotHash: `0x${string}`;
        deadline: bigint;
      };

      const decimals = await this.getTokenDecimals(contractData.token);

      return {
        totalAmount: ethers.utils.formatUnits(contractData.totalAmount, decimals),
        paidAmount: ethers.utils.formatUnits(contractData.paidAmount, decimals),
      };
    } catch (err) {
      console.error('Failed to get contract amounts - Full error:', err);
      throw err;
    }
  }

  async createContract(
    programId: number,
    builder: `0x${string}`,
    totalAmount: bigint,
    builderSig: `0x${string}`,
    contractSnapshotHash: `0x${string}`,
    durationDays = 2n,
    tokenAddress?: `0x${string}`,
    ownerAddress?: string,
    tokenName?: string,
    tokenDecimals?: number,
  ) {
    try {
      const sponsorFee = await this.getSponsorFeePercentage();
      const platformFee = (totalAmount * sponsorFee) / 10000n;
      const totalDeposit = totalAmount + platformFee;

      const isNativeToken = !tokenAddress || tokenAddress === ethers.constants.AddressZero;

      if (!isNativeToken && ownerAddress && tokenAddress) {
        const balance = await this.getAmount(tokenAddress, ownerAddress);
        if (balance < totalDeposit) {
          const decimals = tokenDecimals ?? 18;

          const displayAmount = ethers.utils.formatUnits(totalDeposit, decimals);
          const displayBalance = ethers.utils.formatUnits(balance, decimals);
          throw new Error(
            `Insufficient ${
              tokenName || 'token'
            } balance. Required: ${displayAmount}, Available: ${displayBalance}`,
          );
        }

        const allowance = await this.getAllowance(tokenAddress, ownerAddress);

        if (allowance < totalDeposit) {
          await this.approveToken(tokenAddress, totalDeposit, tokenName, tokenDecimals);
        }
      }

      const data = encodeFunctionData({
        abi: LdRecruitmentAbi,
        functionName: 'createContract',
        args: [
          BigInt(programId),
          builder,
          totalAmount,
          durationDays,
          builderSig,
          `0x${contractSnapshotHash}`,
        ],
      });

      const tx = await this.sendTransaction(
        {
          to: this.contractAddress,
          data,
          value: isNativeToken ? totalDeposit : 0n,
          chainId: this.chainId,
        },
        {
          uiOptions: {
            showWalletUIs: true,
            description: `Create Contract`,
            buttonText: 'Submit Transaction',
            transactionInfo: {
              title: 'Transaction Details',
              action: 'Create Contract',
            },
            successHeader: 'Contract Created Successfully!',
            successDescription: 'Your contract has been created.',
          },
        },
      );

      const receiptResult = await this.findReceipt(
        tx.hash,
        'ContractCreated(uint256,address,address,uint256)',
      );

      if (receiptResult !== null) {
        return { txHash: tx.hash, onchainContractId: receiptResult };
      }

      return { txHash: tx.hash, onchainContractId: null };
    } catch (err) {
      console.error('Failed to create contract - Full error:', err);
      throw err;
    }
  }

  async updateContract(
    contractId: number | string | bigint,
    newAmount: bigint,
    durationDays: bigint,
    builderSig: `0x${string}`,
    contractSnapshotHash: `0x${string}`,
    tokenAddress?: `0x${string}`,
    ownerAddress?: string,
    tokenName?: string,
    tokenDecimals?: number,
  ) {
    try {
      const currentContract = await this.client.readContract({
        address: this.contractAddress as `0x${string}`,
        abi: LdRecruitmentAbi,
        functionName: 'getContract',
        args: [BigInt(contractId)],
      });

      const contractData = currentContract as {
        totalAmount: bigint;
        token: `0x${string}`;
      };

      const currentAmount = contractData.totalAmount;
      const isNativeToken = !tokenAddress || tokenAddress === ethers.constants.AddressZero;

      let totalDeposit = 0n;
      if (newAmount > currentAmount) {
        const sponsorFee = await this.getSponsorFeePercentage();
        const amountDifference = newAmount - currentAmount;
        const additionalFee = (amountDifference * sponsorFee) / 10000n;
        totalDeposit = amountDifference + additionalFee;

        if (!isNativeToken && ownerAddress && tokenAddress) {
          const balance = await this.getAmount(tokenAddress, ownerAddress);
          if (balance < totalDeposit) {
            const decimals = tokenDecimals ?? 18;

            const displayAmount = ethers.utils.formatUnits(totalDeposit, decimals);
            const displayBalance = ethers.utils.formatUnits(balance, decimals);
            throw new Error(
              `Insufficient ${
                tokenName || 'token'
              } balance. Required: ${displayAmount}, Available: ${displayBalance}`,
            );
          }

          const allowance = await this.getAllowance(tokenAddress, ownerAddress);

          if (allowance < totalDeposit) {
            await this.approveToken(tokenAddress, totalDeposit, tokenName, tokenDecimals);
          }
        }
      }

      const data = encodeFunctionData({
        abi: LdRecruitmentAbi,
        functionName: 'updateContract',
        args: [
          BigInt(contractId),
          newAmount,
          durationDays,
          builderSig,
          `0x${contractSnapshotHash}`,
        ],
      });

      const tx = await this.sendTransaction(
        {
          to: this.contractAddress,
          data,
          value: isNativeToken ? totalDeposit : 0n,
          chainId: this.chainId,
        },
        {
          uiOptions: {
            showWalletUIs: true,
            description: `Update Contract`,
            buttonText: 'Submit Transaction',
            transactionInfo: {
              title: 'Transaction Details',
              action: 'Update Contract',
            },
            successHeader: 'Contract Updated Successfully!',
            successDescription: 'Your contract has been updated.',
          },
        },
      );

      await this.client.waitForTransactionReceipt({
        hash: tx.hash,
      });

      return { txHash: tx.hash };
    } catch (err) {
      console.error('Failed to update contract - Full error:', err);
      throw err;
    }
  }

  async createBuilderSignature(
    programId: number,
    builderAddress: `0x${string}`,
    totalAmount: bigint,
    durationDays: bigint,
  ): Promise<`0x${string}`> {
    try {
      if (!this.contractAddress || this.contractAddress === '') {
        throw new Error('Contract address is not set');
      }

      if (!ethers.utils.isAddress(this.contractAddress)) {
        throw new Error(`Invalid contract address: ${this.contractAddress}`);
      }

      const contractHash = ethers.utils.solidityKeccak256(
        ['uint256', 'address', 'uint256', 'uint256', 'uint256', 'address'],
        [programId, builderAddress, totalAmount, durationDays, this.chainId, this.contractAddress],
      );

      if (!contractHash || contractHash === '') {
        throw new Error('Failed to generate contract hash');
      }

      if (!this.signMessage) {
        throw new Error('signMessage function is not available');
      }

      const signature = await this.signMessage(contractHash);

      return signature as `0x${string}`;
    } catch (err) {
      console.error('Failed to create builder signature - Full error:', err);
      throw err;
    }
  }

  async findReceipt(hash: `0x${string}`, eventName: string) {
    const receipt = await this.client.waitForTransactionReceipt({
      hash,
    });

    if (receipt.status === 'reverted') {
      console.error('Transaction reverted');
      throw new Error('Transaction reverted on-chain');
    }

    const eventSignature = ethers.utils.id(eventName);

    const event = receipt.logs.find((log) => {
      return log.topics[0] === eventSignature;
    });

    if (event?.topics[1] !== undefined) {
      const id = ethers.BigNumber.from(event.topics[1]).toNumber();
      return id;
    }

    console.warn('Event not found in logs, but transaction succeeded');
    return null;
  }

  async getBalance(walletAddress: string) {
    const balance = await this.client.getBalance({
      address: walletAddress as `0x${string}`,
    });

    return balance;
  }

  async getAmount(tokenAddress: string, walletAddress: string): Promise<bigint> {
    const balance = await this.client.readContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20Abi,
      functionName: 'balanceOf',
      args: [walletAddress as `0x${string}`],
    });

    return balance as bigint;
  }

  async getAllowance(tokenAddress: string, ownerAddress: string): Promise<bigint> {
    try {
      const allowance = await this.client.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20Abi,
        functionName: 'allowance',
        args: [ownerAddress as `0x${string}`, this.contractAddress as `0x${string}`],
      });

      return allowance as bigint;
    } catch (error) {
      console.error('Failed to check allowance:', error);
      return BigInt(0);
    }
  }

  async getTokenDecimals(tokenAddress: `0x${string}`): Promise<number> {
    try {
      const decimals = await this.client.readContract({
        address: tokenAddress,
        abi: ERC20Abi,
        functionName: 'decimals',
      });

      return Number(decimals);
    } catch (error) {
      console.error('Failed to get token decimals:', error);
      return 18;
    }
  }

  async approveToken(
    tokenAddress: `0x${string}`,
    amount: bigint,
    tokenName?: string,
    tokenDecimals?: number,
  ) {
    const data = encodeFunctionData({
      abi: ERC20Abi,
      functionName: 'approve',
      args: [this.contractAddress, amount],
    });

    const displayAmount =
      tokenDecimals !== undefined
        ? ethers.utils.formatUnits(amount, tokenDecimals)
        : ethers.utils.formatUnits(amount, 18);

    const tx = await this.sendTransaction(
      {
        to: tokenAddress,
        data,
        chainId: this.chainId,
      },
      {
        uiOptions: {
          showWalletUIs: true,
          description: `Approve ${displayAmount} ${tokenName || 'tokens'} for use in the contract.`,
          buttonText: 'Approve Token',
          transactionInfo: {
            title: 'Approve Token',
            action: 'Grant Permission',
          },
          successHeader: 'Token Approved Successfully!',
          successDescription: `You have successfully approved ${displayAmount} ${
            tokenName || 'tokens'
          } for use in the contract.`,
        },
      },
    );

    await this.client.waitForTransactionReceipt({
      hash: tx.hash,
    });

    return tx;
  }

  async completeMilestone(contractId: number | string | bigint, amount: bigint) {
    try {
      const data = encodeFunctionData({
        abi: LdRecruitmentAbi,
        functionName: 'completeMilestone',
        args: [BigInt(contractId), amount],
      });

      const tx = await this.sendTransaction(
        {
          to: this.contractAddress,
          data,
          value: 0n,
          chainId: this.chainId,
        },
        {
          uiOptions: {
            showWalletUIs: true,
            description: `Complete Milestone`,
            buttonText: 'Submit Transaction',
            transactionInfo: {
              title: 'Transaction Details',
              action: 'Complete Milestone',
            },
            successHeader: 'Milestone Completed Successfully!',
            successDescription: 'The milestone has been completed.',
          },
        },
      );

      await this.client.waitForTransactionReceipt({
        hash: tx.hash,
      });

      return { txHash: tx.hash };
    } catch (err) {
      console.error('Failed to complete milestone - Full error:', err);
      throw err;
    }
  }

  async completeProgram(programId: number | string | bigint) {
    try {
      const data = encodeFunctionData({
        abi: LdRecruitmentAbi,
        functionName: 'completeProgram',
        args: [BigInt(programId)],
      });

      const tx = await this.sendTransaction(
        {
          to: this.contractAddress,
          data,
          value: 0n,
          chainId: this.chainId,
        },
        {
          uiOptions: {
            showWalletUIs: true,
            description: `Complete Program`,
            buttonText: 'Submit Transaction',
            transactionInfo: {
              title: 'Transaction Details',
              action: 'Complete Program',
            },
            successHeader: 'Program Completed Successfully!',
            successDescription: 'The program has been completed.',
          },
        },
      );

      await this.client.waitForTransactionReceipt({
        hash: tx.hash,
      });

      return { txHash: tx.hash };
    } catch (err) {
      console.error('Failed to complete program - Full error:', err);
      throw err;
    }
  }
}

export default RecruitmentContract;
