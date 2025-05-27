import contractJson from "@/lib/contract/contract.json";
import { User } from "@/types/types.generated";
import { usePrivy } from "@privy-io/react-auth";
import { ethers } from "ethers";
import type { PublicClient } from "viem";
import { encodeFunctionData } from "viem";

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
];

class ChainContract {
  private contractAddress: string;
  private chainId: number;
  private sendTransaction: ReturnType<typeof usePrivy>["sendTransaction"];
  private client: PublicClient;

  constructor(
    contractAddress: string,
    chainId: number,
    sendTransaction: ReturnType<typeof usePrivy>["sendTransaction"],
    client: PublicClient
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
      functionName: "balanceOf",
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

  async createProgram(program: {
    name?: string;
    price?: string;
    deadline: string;
    validatorAddress?: User;
  }) {
    try {
      const data = encodeFunctionData({
        abi: contractJson.abi,
        functionName: "createEduProgram",
        args: [
          program.name,
          ethers.utils.parseEther(program.price || "0"),
          Math.floor(Math.floor(Date.now()) / 1000),
          Math.floor(Math.floor(new Date(program.deadline).getTime()) / 1000),
          program.validatorAddress?.walletAddress,
        ],
      });

      const tx = await this.sendTransaction({
        to: this.contractAddress,
        data,
        value: BigInt(ethers.utils.parseEther(program.price || "0").toString()),
        chainId: this.chainId,
      });

      const receiptResult = await this.findReceipt(
        tx.hash,
        "ProgramCreated(uint256,address,address,uint256)"
      );

      if (receiptResult) {
        return { txHash: tx.hash, programId: receiptResult };
      }

      return null;
    } catch (error) {
      console.error("Failed to create program:", error);
      throw error;
    }
  }

  async acceptMilestone(
    programId: number,
    builderAddress: string,
    amount: string
  ) {
    try {
      const reward = ethers.utils.parseEther(amount);

      const data = encodeFunctionData({
        abi: contractJson.abi,
        functionName: "acceptMilestone",
        args: [programId, builderAddress, reward],
      });

      const tx = await this.sendTransaction({
        to: this.contractAddress,
        data,
        chainId: this.chainId,
      });

      const receiptResult = await this.findReceipt(
        tx.hash,
        "MilestoneAccepted(uint256,address,uint256)"
      );

      if (receiptResult) {
        return { txHash: tx.hash };
      }

      return null;
    } catch (error) {
      console.error("Failed to accept milestone:", error);
      throw error;
    }
  }
}

export default ChainContract;
