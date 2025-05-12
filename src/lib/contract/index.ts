import { wepinProvider } from "@/lib/wepin";
import { ethers } from "ethers";
import contractJson from "./contract.json";

export const contractAbi = contractJson.abi;

export class Educhain {
  private contract: ethers.Contract | null = null;

  private async ensureContract() {
    if (!this.contract) {
      this.contract = await this.init();
    }
    return this.contract;
  }

  async init() {
    const wpnProvider = await wepinProvider.getProvider(
      import.meta.env.VITE_EDUCHAIN_PROVIDER
    );
    const provider = new ethers.providers.Web3Provider(wpnProvider);
    this.contract = new ethers.Contract(
      import.meta.env.VITE_EDUCHAIN_CONTRACT_ADDRESS,
      contractAbi,
      provider
    );
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      import.meta.env.VITE_EDUCHAIN_CONTRACT_ADDRESS,
      contractAbi,
      signer
    );
    return contract;
  }

  async getProgram(programId: number) {
    try {
      if (Number.isNaN(programId)) {
        throw new Error("Invalid program ID");
      }

      const contract = await this.ensureContract();
      const program = await contract.eduPrograms(programId);
      if (!program || !program.id) {
        throw new Error("Program not found");
      }

      return program;
    } catch (error) {
      console.error(
        { error, programId },
        "Failed to retrieve program from blockchain"
      );
      throw new Error("Program not found or blockchain error occurred");
    }
  }

  /* -------------------------- Sponsor methods start ------------------------- */
  async createProgram(params: {
    name: string;
    price: string;
    startTime: number;
    endTime: number;
    validatorAddress: string;
  }) {
    try {
      // Parameter validation
      if (
        !params.price ||
        Number.isNaN(Number(params.price)) ||
        Number(params.price) <= 0
      ) {
        throw new Error("Valid positive price is required");
      }

      if (params.startTime >= params.endTime) {
        throw new Error("Start time must be earlier than end time");
      }

      // Current time validation
      const now = new Date();
      if (params.startTime < now.getTime()) {
        throw new Error("Start time cannot be in the past");
      }

      // Convert price from ETH string to wei
      const price = ethers.utils.parseEther(params.price);

      // Convert dates to Unix timestamps (seconds)
      const startTimestamp = Math.floor(params.startTime / 1000);
      const endTimestamp = Math.floor(params.endTime / 1000);

      // Ensure validator address is available
      if (!params.validatorAddress) {
        throw new Error("Validator address not configured");
      }

      const contract = await this.ensureContract();
      const tx = await contract.createEduProgram(
        params.name,
        price,
        startTimestamp,
        endTimestamp,
        params.validatorAddress,
        { value: price }
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      // Find the ProgramCreated event
      const event = receipt.events.find(
        (e: { event: string }) => e.event === "ProgramCreated"
      );

      if (!event || !event.args || !event.args[0]) {
        throw new Error(
          "Program creation event not found in transaction receipt"
        );
      }

      // Extract the program ID from the event args
      const programId = Number(event.args[0]);
      return { programId, txHash: tx.hash };
    } catch (error) {
      console.error(
        { error, params },
        "Failed to create program on blockchain"
      );
      throw new Error("Program not created due to blockchain error");
    }
  }

  /* -------------------------- Sponsor methods end --------------------------- */

  /* -------------------------- Validator methods start ----------------------- */

  async acceptMilestone(
    milestoneId: string,
    programId: number,
    builderAddress: string,
    amount: string
  ) {
    try {
      if (!milestoneId || !programId || !builderAddress || !amount) {
        throw new Error("Invalid milestone ID");
      }

      const reward = ethers.utils.parseEther(amount);

      const contract = await this.ensureContract();
      const tx = await contract.acceptMilestone(
        programId,
        milestoneId,
        builderAddress,
        reward
      );
      const receipt = await tx.wait();
      const event = receipt.events.find(
        (e: { event: string }) => e.event === "MilestoneAccepted"
      );
      if (!event) {
        throw new Error(
          "MilestoneAccepted event not found in transaction receipt"
        );
      }

      return event;
    } catch (error) {
      console.error(
        { error, milestoneId },
        "Failed to accept milestone on blockchain"
      );
      throw new Error("Milestone not accepted due to blockchain error");
    }
  }

  /* -------------------------- Validator methods end --------------------------- */
}
