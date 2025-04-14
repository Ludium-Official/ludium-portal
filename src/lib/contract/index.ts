import { wepinProvider } from '@/lib/wepin';
import { ethers } from 'ethers';
import contractJson from './contract.json';

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
    const wpnProvider = await wepinProvider.getProvider('evmopencampus-testnet');
    const provider = new ethers.providers.Web3Provider(wpnProvider);
    this.contract = new ethers.Contract(
      import.meta.env.VITE_EDUCHAIN_CONTRACT_ADDRESS,
      contractAbi,
      provider,
    );
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      import.meta.env.VITE_EDUCHAIN_CONTRACT_ADDRESS,
      contractAbi,
      signer,
    );
    return contract;
  }

  async getProgram(programId: number) {
    try {
      if (Number.isNaN(programId)) {
        throw new Error('Invalid program ID');
      }

      const contract = await this.ensureContract();
      const program = await contract.eduPrograms(programId);
      if (!program || !program.id) {
        throw new Error('Program not found');
      }

      return program;
    } catch (error) {
      console.error({ error, programId }, 'Failed to retrieve program from blockchain');
      throw new Error('Program not found or blockchain error occurred');
    }
  }

  /* -------------------------- Sponsor methods start ------------------------- */
  async createProgram(params: {
    name: string;
    price: string;
    keywords: string[];
    startTime: number;
    endTime: number;
    validatorAddress: string;
    summary: string;
    description: string;
    links: string[];
  }) {
    try {
      // Parameter validation
      if (!params.price || Number.isNaN(Number(params.price)) || Number(params.price) <= 0) {
        throw new Error('Valid positive price is required');
      }

      if (params.startTime >= params.endTime) {
        throw new Error('Start time must be earlier than end time');
      }

      // Current time validation
      const now = new Date();
      if (params.startTime < now.getTime()) {
        throw new Error('Start time cannot be in the past');
      }

      // Convert price from ETH string to wei
      const price = ethers.utils.parseEther(params.price);

      // Convert dates to Unix timestamps (seconds)
      const startTimestamp = Math.floor(params.startTime / 1000);
      const endTimestamp = Math.floor(params.endTime / 1000);

      // Ensure validator address is available
      if (!params.validatorAddress) {
        throw new Error('Validator address not configured');
      }

      const contract = await this.ensureContract();
      const tx = await contract.createEduProgram(
        params.name,
        price,
        params.keywords,
        startTimestamp,
        endTimestamp,
        params.validatorAddress,
        params.summary,
        params.description,
        params.links,
        { value: price },
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      // Find the ProgramCreated event
      const event = receipt.events.find((e: { event: string }) => e.event === 'ProgramCreated');

      if (!event || !event.args || !event.args[0]) {
        throw new Error('Program creation event not found in transaction receipt');
      }

      // Extract the program ID from the event args
      const programId = Number(event.args[0]);
      return { programId, txHash: tx.hash };
    } catch (error) {
      console.error({ error, params }, 'Failed to create program on blockchain');
      throw new Error('Program not created due to blockchain error');
    }
  }

  /* -------------------------- Sponsor methods end --------------------------- */

  /* -------------------------- Validator methods start ------------------------- */
  // async approveProgram(programId: number, builderAddress: string) {
  //   try {
  //     if (!programId) {
  //       throw new Error('Invalid program ID');
  //     }

  //     if (!builderAddress) {
  //       throw new Error('Builder address not configured');
  //     }

  //     const contract = await this.ensureContract();
  //     const program = await this.getProgram(programId);

  //     const tx = await contract.approveProgram(program.id, builderAddress);
  //     const receipt = await tx.wait();

  //     return receipt;
  //   } catch (error) {
  //     console.error({ error, programId }, 'Failed to approve program on blockchain');
  //     throw new Error('Program not approved due to blockchain error');
  //   }
  // }

  async selectApplication(applicationId: number) {
    try {
      if (Number.isNaN(applicationId)) {
        throw new Error('Invalid application ID');
      }

      const contract = await this.ensureContract();
      const tx = await contract.selectApplication(applicationId);
      const receipt = await tx.wait();
      const event = receipt.events.find(
        (e: { event: string }) => e.event === 'ApplicationSelected',
      );
      if (!event) {
        throw new Error('ApplicationSelected event not found in transaction receipt');
      }

      return event;
    } catch (error) {
      console.error({ error, applicationId }, 'Failed to select application on blockchain');
      throw new Error('Application not selected due to blockchain error');
    }
  }

  async acceptMilestone(milestoneId: number) {
    try {
      if (Number.isNaN(milestoneId)) {
        throw new Error('Invalid milestone ID');
      }

      const contract = await this.ensureContract();
      const tx = await contract.acceptMilestone(milestoneId);
      const receipt = await tx.wait();
      const event = receipt.events.find((e: { event: string }) => e.event === 'MilestoneAccepted');
      if (!event) {
        throw new Error('MilestoneAccepted event not found in transaction receipt');
      }

      return event;
    } catch (error) {
      console.error({ error, milestoneId }, 'Failed to accept milestone on blockchain');
      throw new Error('Milestone not accepted due to blockchain error');
    }
  }

  async rejectMilestone(milestoneId: number) {
    try {
      if (Number.isNaN(milestoneId)) {
        throw new Error('Invalid milestone ID');
      }

      const contract = await this.ensureContract();
      const tx = await contract.rejectMilestone(milestoneId);
      const receipt = await tx.wait();
      const event = receipt.events.find((e: { event: string }) => e.event === 'MilestoneRejected');
      if (!event) {
        throw new Error('MilestoneRejected event not found in transaction receipt');
      }

      return event;
    } catch (error) {
      console.error({ error, milestoneId }, 'Failed to reject milestone on blockchain');
      throw new Error('Milestone not rejected due to blockchain error');
    }
  }
  /* -------------------------- Validator methods end --------------------------- */

  /* -------------------------- Builder methods start ---------------------------- */
  async submitApplication(params: {
    programId: number;
    milestoneNames: string[];
    milestoneDescriptions: string[];
    milestonePrices: string[];
  }) {
    try {
      if (Number.isNaN(params.programId)) {
        throw new Error('Invalid program ID');
      }

      const contract = await this.ensureContract();
      const milestonePrices = params.milestonePrices.map((price) => ethers.utils.parseEther(price));

      const tx = await contract.submitApplication(
        params.programId,
        params.milestoneNames,
        params.milestoneDescriptions,
        milestonePrices,
      );
      console.log('🚀 ~ Educhain ~ tx:', tx);

      const receipt = await tx.wait();
      console.log('🚀 ~ Educhain ~ receipt:', receipt);
      const event = receipt.events.find((e: { event: string }) => e.event === 'ProgramApplied');

      if (!event || !event.args) {
        throw new Error('Program application event not found in transaction receipt');
      }

      const applicationId = event.args.id;
      const milestoneIds = event.args.milestoneIds;

      if (!applicationId || !milestoneIds) {
        throw new Error('Application or milestone IDs not found in transaction receipt');
      }

      return { applicationId, milestoneIds };
    } catch (error) {
      console.error({ error, params }, 'Failed to submit application on blockchain');
      throw new Error('Application not submitted due to blockchain error');
    }
  }

  async submitMilestone(milestoneId: number, links: string[]) {
    try {
      if (Number.isNaN(milestoneId)) {
        throw new Error('Invalid milestone ID');
      }

      const contract = await this.ensureContract();
      const tx = await contract.submitMilestone(milestoneId, links);
      const receipt = await tx.wait();
      const event = receipt.events.find((e: { event: string }) => e.event === 'MilestoneSubmitted');
      if (!event) {
        throw new Error('MilestoneSubmitted event not found in transaction receipt');
      }

      return event;
    } catch (error) {
      console.error({ error, milestoneId }, 'Failed to submit milestone on blockchain');
      throw new Error('Milestone not submitted due to blockchain error');
    }
  }
  /* -------------------------- Builder methods end ---------------------------- */
}
