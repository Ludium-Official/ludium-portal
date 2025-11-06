import { usePrivy } from "@privy-io/react-auth";
import { encodeFunctionData, type PublicClient } from "viem";
import LdRecruitmentAbi from "./abi/LdRecruitment";
import { ethers } from "ethers";
import type { ConnectedWallet } from "@privy-io/react-auth";
import type { Chain } from "viem";

class RecruitmentContract {
  private contractAddress: string;
  private chainId: number;
  private sendTransaction: ReturnType<typeof usePrivy>["sendTransaction"];
  private client: PublicClient;
  private signMessage?: (
    message: string,
    wallet?: ConnectedWallet,
    chain?: Chain
  ) => Promise<string>;

  constructor(
    contractAddress: string,
    chainId: number,
    sendTransaction: ReturnType<typeof usePrivy>["sendTransaction"],
    client: PublicClient,
    signMessage?: (
      message: string,
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

      const data = encodeFunctionData({
        abi: LdRecruitmentAbi,
        functionName: "createContract",
        args: [
          BigInt(programId),
          builder,
          totalAmount,
          durationDays,
          builderSig,
          contractSnapshotHash,
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

      const contractHash = ethers.utils.solidityKeccak256(
        ["uint256", "address", "uint256", "uint256", "uint256", "address"],
        [
          BigInt(programId),
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

      if (this.signMessage) {
        const humanReadableMessage = `Please sign Employment contract
          Builder Address: ${builderAddress}
          Total Amount: ${totalAmount.toString()}
          Contract Address: ${this.contractAddress}
        `;

        const signature = await this.signMessage(humanReadableMessage);

        return signature as `0x${string}`;
      }

      const messageBytes = ethers.utils.arrayify(contractHash);

      const signature = await this.sendTransaction(
        {
          to: builderAddress,
          data: ethers.utils.hexlify(messageBytes) as `0x${string}`,
          chainId: this.chainId,
        },
        {
          uiOptions: {
            showWalletUIs: true,
            description: "Sign Contract",
            buttonText: "Sign",
            transactionInfo: {
              title: "Contract Signature",
              action: "Sign Employment Contract",
            },
            successHeader: "Signature Created Successfully!",
            successDescription: "You have signed the employment contract.",
          },
        }
      );

      return signature.hash;
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

    if (event?.topics[1]) {
      // For ContractCreated event, topics[1] is contractId (first indexed parameter)
      const id = ethers.BigNumber.from(event.topics[1]).toNumber();
      return id;
    }

    console.warn("Event not found in logs, but transaction succeeded");
    return null;
  }
}

export default RecruitmentContract;
