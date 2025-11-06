import { usePrivy } from "@privy-io/react-auth";
import { encodeFunctionData, type PublicClient } from "viem";
import LdRecruitmentAbi from "./abi/LdRecruitment";
import { ethers } from "ethers";
import type { ConnectedWallet } from "@privy-io/react-auth";
import type { Chain } from "viem";
import ERC20Abi from "./abi/ERC20";

class RecruitmentContract {
  private contractAddress: string;
  private chainId: number;
  private sendTransaction: ReturnType<typeof usePrivy>["sendTransaction"];
  private client: PublicClient;
  private signMessage?: (
    message: string | Uint8Array,
    wallet?: ConnectedWallet,
    chain?: Chain
  ) => Promise<string>;

  constructor(
    contractAddress: string,
    chainId: number,
    sendTransaction: ReturnType<typeof usePrivy>["sendTransaction"],
    client: PublicClient,
    signMessage?: (
      message: string | Uint8Array,
      wallet?: ConnectedWallet,
      chain?: Chain
    ) => Promise<string>
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
        functionName: "createProgram",
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
            buttonText: "Submit Transaction",
            transactionInfo: {
              title: "Transaction Details",
              action: "Create Program",
            },
            successHeader: "Program Created Successfully!",
            successDescription:
              "Your program has been created and is now live.",
          },
        }
      );

      const receiptResult = await this.findReceipt(
        tx.hash,
        "ProgramCreated(uint256,address,address)"
      );

      if (receiptResult !== null) {
        return { txHash: tx.hash, programId: receiptResult };
      }

      return { txHash: tx.hash, programId: null };
    } catch (err) {
      console.error("Failed to create program - Full error:", err);
    }
  }

  async getSponsorFeePercentage(): Promise<bigint> {
    try {
      const sponsorFee = await this.client.readContract({
        address: this.contractAddress as `0x${string}`,
        abi: LdRecruitmentAbi,
        functionName: "sponsorFeePercentage",
      });

      return sponsorFee as bigint;
    } catch (err) {
      console.error("Failed to get sponsor fee percentage - Full error:", err);
      throw err;
    }
  }

  async createContract(
    programId: number,
    builder: `0x${string}`,
    totalAmount: bigint,
    builderSig: `0x${string}`,
    contractSnapshotHash: `0x${string}`,
    durationDays: bigint = 3n
  ) {
    try {
      const sponsorFee = await this.getSponsorFeePercentage();
      const platformFee = (totalAmount * sponsorFee) / 10000n;
      const totalDeposit = totalAmount + platformFee;

      // 들어가는 값: 0n '0xf260B6bA650be86379f6059673A4a09C9977dE76' 10000000000000000n 3n '0x89b13c7d43cbda11a366160d034c91e0921cd0e0ade991460cd880839cb822bd028155be47425d9d9abd11c54a9604ed03b65ae5718cebe32dc6868faeb6e4951c' '6943568db2162726c3f61f58b23ec7411ad75bb1e86b4dc9dc0b46b19d13fcc0'
      const data = encodeFunctionData({
        abi: LdRecruitmentAbi,
        functionName: "createContract",
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
          value: totalDeposit,
          chainId: this.chainId,
        },
        {
          uiOptions: {
            showWalletUIs: true,
            description: `Create Contract`,
            buttonText: "Submit Transaction",
            transactionInfo: {
              title: "Transaction Details",
              action: "Create Contract",
            },
            successHeader: "Contract Created Successfully!",
            successDescription: "Your contract has been created.",
          },
        }
      );

      const receiptResult = await this.findReceipt(
        tx.hash,
        "ContractCreated(uint256,address,address,uint256)"
      );

      if (receiptResult !== null) {
        return { txHash: tx.hash, onchainContractId: receiptResult };
      }

      return { txHash: tx.hash, onchainContractId: null };
    } catch (err) {
      console.error("Failed to create contract - Full error:", err);
      throw err;
    }
  }

  async createBuilderSignature(
    programId: number,
    builderAddress: `0x${string}`,
    totalAmount: bigint,
    durationDays: number
  ): Promise<`0x${string}`> {
    try {
      if (!this.contractAddress || this.contractAddress === "") {
        throw new Error("Contract address is not set");
      }

      if (!ethers.utils.isAddress(this.contractAddress)) {
        throw new Error(`Invalid contract address: ${this.contractAddress}`);
      }

      // 들어가는 값: 0n '0xf260B6bA650be86379f6059673A4a09C9977dE76' 10000000000000000n 3 656476 '0x115b100BC2F2d1F74a017f9275cE463B47Ab87a3'
      const contractHash = ethers.utils.solidityKeccak256(
        ["uint256", "address", "uint256", "uint256", "uint256", "address"],
        [
          programId,
          builderAddress,
          totalAmount,
          durationDays,
          this.chainId,
          this.contractAddress,
        ]
      );

      if (!contractHash || contractHash === "") {
        throw new Error("Failed to generate contract hash");
      }

      if (!this.signMessage) {
        throw new Error("signMessage function is not available");
      }

      const contractHashBytes = ethers.utils.arrayify(contractHash);
      const signature = await this.signMessage(contractHashBytes);

      return signature as `0x${string}`;
    } catch (err) {
      console.error("Failed to create builder signature - Full error:", err);
      throw err;
    }
  }

  async findReceipt(hash: `0x${string}`, eventName: string) {
    const receipt = await this.client.waitForTransactionReceipt({
      hash,
    });

    if (receipt.status === "reverted") {
      console.error("Transaction reverted");
      throw new Error("Transaction reverted on-chain");
    }

    const eventSignature = ethers.utils.id(eventName);

    const event = receipt.logs.find((log) => {
      return log.topics[0] === eventSignature;
    });

    if (event?.topics[1] !== undefined) {
      const id = ethers.BigNumber.from(event.topics[1]).toNumber();
      return id;
    }

    console.warn("Event not found in logs, but transaction succeeded");
    return null;
  }

  async getBalance(walletAddress: string) {
    const balance = await this.client.getBalance({
      address: walletAddress as `0x${string}`,
    });

    return balance;
  }

  async getAmount(tokenAddress: string, walletAddress: string) {
    const balance = await this.client.readContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20Abi,
      functionName: "balanceOf",
      args: [walletAddress as `0x${string}`],
    });

    return balance;
  }
}

export default RecruitmentContract;
