// import { ethers } from 'ethers';
import contractJson from './contract.json';

export const contractAbi = contractJson.abi;
// import { wepinProvider } from '@/lib/wepin';

// export class Educhain {
//   private contract: ethers.Contract;
//   private provider: ethers.providers.JsonRpcProvider;

//   constructor() {
//     const contractAbi = contractJson.abi;

//     const wpnProvider = await wepinProvider.getProvider('evmopencampus-testnet')
//     this.provider =
//     // this.provider = new ethers.providers.JsonRpcProvider(this.server.config.EDUCHAIN_RPC_URL);
//     // const wallet = new ethers.Wallet(this.server.config.EDUCHAIN_PRIVATE_KEY, this.provider);
//     // this.contract = new ethers.Contract(
//     //   this.server.config.EDUCHAIN_CONTRACT_ADDRESS,
//     //   contractAbi,
//     //   wallet,
//     // );
//   }

//   async getProgram(programId: number) {
//     try {
//       if (!programId) {
//         throw new Error('Invalid program ID');
//       }

//       const program = await this.contract.eduPrograms(programId);
//       if (!program || !program.id) {
//         throw new Error('Program not found');
//       }

//       return program;
//     } catch (error) {
//       this.server.log.error({ error, programId }, 'Failed to retrieve program from blockchain');
//       throw new Error('Program not found or blockchain error occurred');
//     }
//   }

//   /* -------------------------- Sponsor methods start ------------------------- */
//   async createProgram(params: {
//     name: string;
//     price: string;
//     startTime: Date;
//     endTime: Date;
//     validatorAddress: string;
//     summary: string;
//     description: string;
//     links: string[];
//   }) {
//     try {
//       // Parameter validation
//       if (!params.price || Number.isNaN(Number(params.price)) || Number(params.price) <= 0) {
//         throw new Error('Valid positive price is required');
//       }

//       if (params.startTime.getTime() >= params.endTime.getTime()) {
//         throw new Error('Start time must be earlier than end time');
//       }

//       // Current time validation
//       const now = new Date();
//       if (params.startTime.getTime() < now.getTime()) {
//         throw new Error('Start time cannot be in the past');
//       }

//       // Convert price from ETH string to wei
//       const price = ethers.utils.parseEther(params.price);

//       // Convert dates to Unix timestamps (seconds)
//       const startTimestamp = Math.floor(params.startTime.getTime() / 1000);
//       const endTimestamp = Math.floor(params.endTime.getTime() / 1000);

//       // Ensure validator address is available
//       if (!params.validatorAddress) {
//         throw new Error('Validator address not configured');
//       }

//       // Call the smart contract function with proper parameters
//       const tx = await this.contract.createEduProgram(
//         params.name,
//         price,
//         startTimestamp,
//         endTimestamp,
//         params.validatorAddress,
//         params.summary,
//         params.description,
//         params.links,
//         { value: price },
//       );

//       // Wait for transaction confirmation
//       const receipt = await tx.wait();

//       // Find the ProgramCreated event
//       const event = receipt.events.find((e: { event: string }) => e.event === 'ProgramCreated');

//       if (!event || !event.args || !event.args[0]) {
//         throw new Error('Program creation event not found in transaction receipt');
//       }

//       // Extract the program ID from the event args
//       const programId = Number(event.args[0]);
//       return programId;
//     } catch (error) {
//       this.server.log.error({ error, params }, 'Failed to create program on blockchain');
//       throw new Error('Program not created due to blockchain error');
//     }
//   }

//   /* -------------------------- Sponsor methods end --------------------------- */

//   /* -------------------------- Validator methods start ------------------------- */
//   async approveProgram(programId: number, builderAddress: string) {
//     try {
//       if (!programId) {
//         throw new Error('Invalid program ID');
//       }

//       if (!builderAddress) {
//         throw new Error('Builder address not configured');
//       }

//       const program = await this.getProgram(programId);

//       const tx = await this.contract.approveProgram(program.id, builderAddress);
//       const receipt = await tx.wait();

//       return receipt;
//     } catch (error) {
//       this.server.log.error({ error, programId }, 'Failed to approve program on blockchain');
//       throw new Error('Program not approved due to blockchain error');
//     }
//   }

//   async selectApplication(programId: number, applicationId: number) {
//     try {
//       if (!programId) {
//         throw new Error('Invalid program ID');
//       }
//       if (!applicationId) {
//         throw new Error('Invalid application ID');
//       }

//       const tx = await this.contract.selectApplication(programId, applicationId, true);

//       return tx.wait();
//     } catch (error) {
//       this.server.log.error(
//         { error, programId, applicationId },
//         'Failed to select application on blockchain',
//       );
//       throw new Error('Application not selected due to blockchain error');
//     }
//   }

//   async acceptMilestone(programId: number, milestoneId: number) {
//     try {
//       if (!programId) {
//         throw new Error('Invalid program ID');
//       }
//       if (!milestoneId) {
//         throw new Error('Invalid milestone ID');
//       }

//       const tx = await this.contract.acceptMilestone(programId, milestoneId);
//       return tx.wait();
//     } catch (error) {
//       this.server.log.error(
//         { error, programId, milestoneId },
//         'Failed to accept milestone on blockchain',
//       );
//       throw new Error('Milestone not accepted due to blockchain error');
//     }
//   }

//   async rejectMilestone(programId: number, milestoneId: number) {
//     try {
//       if (!programId) {
//         throw new Error('Invalid program ID');
//       }
//       if (!milestoneId) {
//         throw new Error('Invalid milestone ID');
//       }

//       const tx = await this.contract.rejectMilestone(programId, milestoneId);
//       return tx.wait();
//     } catch (error) {
//       this.server.log.error(
//         { error, programId, milestoneId },
//         'Failed to reject milestone on blockchain',
//       );
//       throw new Error('Milestone not rejected due to blockchain error');
//     }
//   }
//   /* -------------------------- Validator methods end --------------------------- */

//   /* -------------------------- Builder methods start ---------------------------- */
//   async submitApplication(params: {
//     programId: number;
//     milestoneNames: string[];
//     milestoneDescriptions: string[];
//     milestonePrices: string[];
//   }) {
//     try {
//       if (!params.programId) {
//         throw new Error('Invalid program ID');
//       }

//       const milestonePrices = params.milestonePrices.map((price) => ethers.utils.parseEther(price));

//       const tx = await this.contract.submitApplication(
//         params.programId,
//         params.milestoneNames,
//         params.milestoneDescriptions,
//         milestonePrices,
//       );

//       const receipt = await tx.wait();
//       const event = receipt.events.find((e: { event: string }) => e.event === 'ProgramApplied');

//       if (!event || !event.args) {
//         throw new Error('Program application event not found in transaction receipt');
//       }

//       const applicationId = Number(event.args.id);

//       return applicationId;
//     } catch (error) {
//       this.server.log.error({ error, params }, 'Failed to submit application on blockchain');
//       throw new Error('Application not submitted due to blockchain error');
//     }
//   }

//   async submitMilestone(params: {
//     programId: number;
//     milestoneId: number;
//     links: string[];
//   }) {
//     try {
//       if (!params.programId) {
//         throw new Error('Invalid program ID');
//       }
//       if (!params.milestoneId) {
//         throw new Error('Invalid milestone ID');
//       }

//       const tx = await this.contract.submitMilestone(
//         params.programId,
//         params.milestoneId,
//         params.links,
//       );
//       return tx.wait();
//     } catch (error) {
//       this.server.log.error({ error, params }, 'Failed to submit milestone on blockchain');
//       throw new Error('Milestone not submitted due to blockchain error');
//     }
//   }
//   /* -------------------------- Builder methods end ---------------------------- */
// }

// const educhainPlugin = (
//   server: FastifyInstance,
//   _: FastifyPluginOptions,
//   done: (error?: FastifyError) => void,
// ): void => {
//   const educhain = new Educhain(server);
//   server.decorate('educhain', educhain);

//   done();
// };

// export default fp(educhainPlugin);
