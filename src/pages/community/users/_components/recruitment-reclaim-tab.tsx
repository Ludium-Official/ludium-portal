import { useReclaimMilestoneMutation } from "@/apollo/mutation/reclaim-milestone.generated";
import { useReclaimProgramMutation } from "@/apollo/mutation/reclaim-program.generated";
import { useProfileQuery } from "@/apollo/queries/profile.generated";
import {
  type ProgramsQuery,
  useProgramsQuery,
} from "@/apollo/queries/programs.generated";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChainContract from "@/lib/contract";
import notify from "@/lib/notify";
import { getCurrencyIcon } from "@/lib/utils";
import { ProgramType } from "@/types/types.generated";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import type { Chain, PublicClient } from "viem";
import { http, createPublicClient } from "viem";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  creditCoin3Mainnet,
  eduChain,
  eduChainTestnet,
} from "viem/chains";
import { AgentBreadcrumbs } from "./agent-breadcrumbs";

const programPageSize = 6;

// Recruitment reclaim functionality:
// 1. Unused programs past deadline (sponsor can reclaim)
// 2. Unpaid milestones past deadline (builder can reclaim)
export default function UserRecruitmentReclaimTab({
  myProfile,
}: {
  myProfile?: boolean;
}) {
  const { id } = useParams();
  const [searchParams, _setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data: profileData } = useProfileQuery({
    fetchPolicy: "network-only",
    skip: !myProfile,
  });

  const profileId = myProfile ? profileData?.profile?.id ?? "" : id ?? "";

  // For reclaim, we need to fetch ALL programs where user is involved
  // We'll fetch programs created by the user (sponsor) and determine builder role from applications
  const { data: programData, refetch: refetchSponsorPrograms } =
    useProgramsQuery({
      variables: {
        pagination: {
          limit: 50, // Increase limit to get more programs
          offset: (currentPage - 1) * programPageSize,

          filter: [
            {
              value: profileId,
              field: "creatorId", // Get programs created by this user
            },
            {
              field: "type",
              value: ProgramType.Regular,
            },
            ...(searchQuery
              ? [
                  {
                    field: "name",
                    value: searchQuery,
                  },
                ]
              : []),
          ],
        },
      },
      skip: !profileId,
    });

  // Also fetch programs where user is a builder (has applications)
  const { data: builderProgramData, refetch: refetchBuilderPrograms } =
    useProgramsQuery({
      variables: {
        pagination: {
          limit: 50,
          offset: 0,
          filter: [
            {
              value: profileId,
              field: "applicantId", // Get programs where user has applied
            },
          ],
        },
      },
      skip: !profileId,
    });

  // Calculate reclaimable items based on business rules
  const reclaimableItems = useMemo(() => {
    type Program = NonNullable<
      NonNullable<ProgramsQuery["programs"]>["data"]
    >[number];
    type Application = NonNullable<Program["applications"]>[number];
    type Milestone = NonNullable<Application["milestones"]>[number];

    type ReclaimableItem = {
      type: "unused_program" | "unpaid_milestone";
      program?: Program;
      application?: Application;
      milestone?: Milestone;
      reason: string;
      amount: string;
      currency: string;
    };

    const items: ReclaimableItem[] = [];
    const now = new Date();

    // Process sponsor programs (programs created by user)
    if (programData?.programs?.data) {
      for (const program of programData.programs.data) {
        // Check if program is past deadline
        const programDeadline = program?.deadline
          ? new Date(program.deadline)
          : null;
        const isPastDeadline = programDeadline && programDeadline < now;

        // Case 1: Unused program past deadline (sponsor can reclaim)
        const isCreator = program?.creator?.id === profileId;

        if (isCreator && !program?.reclaimed) {
          // For regular programs: check if expired and has unused funds
          if (program?.type === "regular") {
            if (isPastDeadline) {
              // Calculate total actually paid out through completed milestones
              let totalPaidOut = 0;

              if (program?.applications) {
                for (const app of program.applications) {
                  // Only consider accepted applications
                  if (app?.status === "accepted" && app?.milestones) {
                    for (const milestone of app.milestones) {
                      // Only count completed (paid) milestones
                      if (
                        milestone?.status === "completed" &&
                        milestone?.price
                      ) {
                        const paidAmount = Number.parseFloat(milestone.price);
                        totalPaidOut += paidAmount;
                      }
                    }
                  }
                }
              }

              // Program price is total deposited by sponsor
              const totalDeposited = Number.parseFloat(program?.price || "0");

              // Reclaimable amount is what wasn't paid out
              const reclaimableAmount = totalDeposited - totalPaidOut;

              // Add debug logging to see what's happening
              console.log(
                `Program ${program?.name}: Deposited=${totalDeposited}, PaidOut=${totalPaidOut}, Reclaimable=${reclaimableAmount}`
              );

              if (reclaimableAmount > 0) {
                // Any amount greater than 0 can be reclaimed
                items.push({
                  type: "unused_program",
                  program,
                  reason:
                    totalPaidOut > 0
                      ? `Unused funds after deadline (${totalPaidOut.toFixed(
                          2
                        )}/${totalDeposited.toFixed(2)} ${
                          program?.currency || "ETH"
                        } paid out)`
                      : "Program expired without any payments",
                  amount: reclaimableAmount.toFixed(4),
                  currency: program?.currency || "ETH",
                });
              } else if (isPastDeadline && totalDeposited > 0) {
                // Log when a program is past deadline but fully paid out
                console.log(
                  `Program ${program?.name} is past deadline but fully paid out (no funds to reclaim)`
                );
              }
            }
          }
          // For funding programs: check if there's unused funding
          else if (program?.type === "funding") {
            const fundingEndDate = program?.fundingEndDate
              ? new Date(program.fundingEndDate)
              : null;
            const isFundingEnded = fundingEndDate && fundingEndDate < now;

            if (isFundingEnded && program?.applications) {
              // Calculate total actually paid out through completed milestones
              let totalPaidOut = 0;

              for (const app of program.applications) {
                // Only consider accepted applications
                if (app?.status === "accepted" && app?.milestones) {
                  for (const milestone of app.milestones) {
                    // Only count completed (paid) milestones
                    if (milestone?.status === "completed" && milestone?.price) {
                      const paidAmount = Number.parseFloat(milestone.price);
                      totalPaidOut += paidAmount;
                    }
                  }
                }
              }

              // Program price is total deposited by sponsor
              const totalDeposited = Number.parseFloat(program?.price || "0");

              // Reclaimable amount is what wasn't paid out
              const reclaimableAmount = totalDeposited - totalPaidOut;

              if (reclaimableAmount > 0) {
                // Any amount greater than 0 can be reclaimed
                items.push({
                  type: "unused_program",
                  program,
                  reason: `Unused funding after deadline (${totalPaidOut.toFixed(
                    2
                  )}/${totalDeposited.toFixed(2)} ${
                    program?.currency || "ETH"
                  } paid out)`,
                  amount: reclaimableAmount.toFixed(4),
                  currency: program?.currency || "ETH",
                });
              }
            }
          }
        }
      }
    }

    // Process builder programs (programs where user has applications)
    if (builderProgramData?.programs?.data) {
      for (const program of builderProgramData.programs.data) {
        // Case 2: Check milestones for unpaid status
        if (program?.applications) {
          for (const application of program.applications) {
            // Only check applications from this user
            if (
              application?.applicant?.id === profileId &&
              application?.milestones
            ) {
              for (const milestone of application.milestones) {
                // Check if milestone has passed deadline and is unpaid

                // Check if milestone can be reclaimed (unpaid and past deadline)
                if (milestone?.canReclaim && !milestone?.reclaimed) {
                  items.push({
                    type: "unpaid_milestone",
                    program,
                    application,
                    milestone,
                    reason: "Milestone past deadline without payment",
                    amount: milestone?.price || "0",
                    currency: milestone?.currency || program?.currency || "ETH",
                  });
                }
              }
            }
          }
        }
      }
    }

    return items;
  }, [programData, builderProgramData, profileId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Reclaim mutations
  const [reclaimProgram] = useReclaimProgramMutation();
  const [reclaimMilestone] = useReclaimMilestoneMutation();
  const [reclaimingId, setReclaimingId] = useState<string | null>(null);

  // Get Privy hooks for contract creation
  const { user, sendTransaction } = usePrivy();
  const { wallets } = useWallets();

  // Helper function to create contract with specific network
  const createContractForNetwork = (network: string) => {
    const currentWallet = wallets.find(
      (wallet) => wallet.address === user?.wallet?.address
    );
    // Check if the user is using an external wallet (like MetaMask)
    const isExternalWallet =
      user?.wallet?.connectorType && user.wallet.connectorType !== "embedded";

    let sendTx = sendTransaction;

    const checkNetwork: Chain = (() => {
      if (network === "base") {
        return base;
      }
      if (network === "base-sepolia") {
        return baseSepolia;
      }
      if (network === "educhain-testnet") {
        return eduChainTestnet;
      }
      if (network === "arbitrum") {
        return arbitrum;
      }
      if (network === "arbitrum-sepolia") {
        return arbitrumSepolia;
      }
      if (network === "creditcoin") {
        return creditCoin3Mainnet;
      }
      return eduChain;
    })();

    // Helper function to get signer for injected wallet
    async function getSigner(
      checkNetwork: Chain,
      currentWallet: {
        getEthereumProvider: () => Promise<ethers.providers.ExternalProvider>;
      }
    ) {
      const eip1193Provider = await currentWallet.getEthereumProvider();
      if (!eip1193Provider) {
        throw new Error("No Ethereum provider found");
      }
      const provider = new ethers.providers.Web3Provider(eip1193Provider);

      const targetNetwork = {
        chainId: `0x${checkNetwork.id.toString(16)}`,
        chainName: checkNetwork.name,
        rpcUrls: checkNetwork.rpcUrls.default.http,
        nativeCurrency: checkNetwork.nativeCurrency,
      };

      if (
        "request" in eip1193Provider &&
        typeof eip1193Provider.request === "function"
      ) {
        const currentChainId = await eip1193Provider.request({
          method: "eth_chainId",
        });

        if (currentChainId !== targetNetwork.chainId) {
          await eip1193Provider.request({
            method: "wallet_addEthereumChain",
            params: [targetNetwork],
          });
        }
      }

      return provider.getSigner();
    }

    if (isExternalWallet && currentWallet) {
      console.log(
        "Using external wallet for reclaim transaction:",
        currentWallet.address
      );
      sendTx = async (
        input: Parameters<typeof sendTransaction>[0],
        _uiOptions?: unknown
      ) => {
        // Note: _uiOptions is ignored for external wallets since they use their own UI
        try {
          console.log(
            "Sending reclaim transaction with external wallet...",
            input
          );
          const signer = await getSigner(checkNetwork, currentWallet);
          const txResponse = await signer.sendTransaction(input);
          console.log(
            "Reclaim transaction sent successfully:",
            txResponse.hash
          );
          return { hash: txResponse.hash as `0x${string}` };
        } catch (error) {
          console.error(
            "Error sending reclaim transaction with external wallet:",
            error
          );
          throw error;
        }
      };
    } else if (isExternalWallet && !currentWallet) {
      console.warn(
        "User has an external wallet but no active wallet found for reclaim."
      );
      sendTx = async () => {
        throw new Error(
          "External wallet detected but not properly connected. Please reconnect your wallet."
        );
      };
    } else if (!user?.wallet) {
      sendTx = async () => {
        throw new Error(
          "No wallet connected. Please connect a wallet to continue."
        );
      };
    } else {
    }

    const checkContract = (() => {
      if (network === "base" || network === "base-sepolia") {
        return import.meta.env.VITE_BASE_CONTRACT_ADDRESS;
      }
      if (network === "arbitrum" || network === "arbitrum-sepolia") {
        return import.meta.env.VITE_ARBITRUM_CONTRACT_ADDRESS;
      }
      return import.meta.env.VITE_EDUCHAIN_CONTRACT_ADDRESS;
    })();

    const client: PublicClient = createPublicClient({
      chain: checkNetwork,
      transport: http(checkNetwork.rpcUrls.default.http[0]),
    });

    return new ChainContract(checkContract, checkNetwork.id, sendTx, client);
  };

  const handleReclaimProgram = async (
    programId: string,
    educhainProgramId?: number,
    amount?: string,
    currency?: string,
    network?: string
  ) => {
    if (!programId) {
      console.error("Program ID is empty or undefined!");
      notify("Invalid program ID", "error");
      return;
    }

    if (!educhainProgramId && educhainProgramId !== 0) {
      notify("Program not deployed on chain", "error");
      return;
    }

    if (!network) {
      notify("Program network not specified", "error");
      return;
    }

    setReclaimingId(programId);
    try {
      // Create contract instance for the specific network
      const contract = createContractForNetwork(network);
      if (!contract) {
        throw new Error(
          `Failed to initialize contract for network: ${network}`
        );
      }

      // First call the smart contract to reclaim funds
      const contractResult = await contract.reclaimFunds(
        educhainProgramId,
        amount || "0",
        {
          name: currency || "ETH",
        }
      );

      if (!contractResult?.txHash) {
        throw new Error("Contract transaction failed");
      }

      // Then update the database with the transaction hash
      const result = await reclaimProgram({
        variables: {
          programId: programId,
          txHash: contractResult.txHash,
        },
      });

      if (result.data?.reclaimProgram) {
        notify("Program funds reclaimed successfully!", "success");
        // Refetch programs to update the list
        await refetchSponsorPrograms();
        await refetchBuilderPrograms();
      }
    } catch (error) {
      console.error("Reclaim error details:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      notify(
        `Failed to reclaim: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    } finally {
      setReclaimingId(null);
    }
  };

  const handleReclaimMilestone = async (milestoneId: string) => {
    setReclaimingId(milestoneId);
    try {
      // Create variables object with only milestoneId
      const variables = {
        milestoneId: milestoneId,
      };

      const result = await reclaimMilestone({
        variables,
      });

      if (result.data?.reclaimMilestone) {
        notify("Milestone funds reclaimed successfully!", "success");
        // Refetch programs to update the list
        await refetchSponsorPrograms();
        await refetchBuilderPrograms();
      }
    } catch (error) {
      console.error("Milestone reclaim error details:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      notify(
        `Failed to reclaim: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    } finally {
      setReclaimingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div className="flex h-12 items-center justify-between pl-4">
          <AgentBreadcrumbs myProfile={myProfile} />
          <div className="relative w-[360px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus:border-gray-300"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {reclaimableItems.length === 0 ? (
            <div className="p-8 border rounded-lg w-full text-center">
              <p className="text-muted-foreground mb-2">
                No reclaimable items found
              </p>
              <p className="text-sm text-muted-foreground">
                Reclaim is available for expired programs without applications
                and unpaid milestones past deadline.
              </p>
            </div>
          ) : (
            // Display reclaimable items
            reclaimableItems.map((item) => (
              <div
                key={`${item.type}-${
                  item.type === "unused_program"
                    ? item.program?.id
                    : item.milestone?.id
                }`}
                className="p-5 border rounded-lg w-full"
              >
                <div className="bg-[#18181B0A] rounded-full px-[10px] inline-flex items-center gap-2 mb-4">
                  <span className="w-[14px] h-[14px] rounded-full bg-orange-500 block" />
                  <p className="text-secondary-foreground text-sm font-semibold">
                    {item.type === "unused_program"
                      ? "Unused Program"
                      : "Unpaid Milestone"}
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">
                      {item.type === "unused_program"
                        ? item.program?.name
                        : `${item.milestone?.title} - ${item.application?.name}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 py-1.5 bg-[#18181B0A] rounded-lg mb-2">
                  <p className="text-sm font-medium text-neutral-400">
                    ALLOCATED
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground font-bold">
                      {item.amount}
                    </p>
                    {getCurrencyIcon(item.currency)}
                    <p className="text-sm text-muted-foreground font-medium">
                      {item.currency}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 py-2.5 bg-[#18181B0A] rounded-lg mb-4">
                  <p className="text-sm font-bold text-foreground">RECLAIM</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl text-primary font-bold">
                      {item.amount}
                    </p>
                    {getCurrencyIcon(item.currency)}
                    <p className="text-sm text-muted-foreground font-medium">
                      {item.currency}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Button
                    size="sm"
                    className="px-6"
                    disabled={
                      reclaimingId ===
                      (item.type === "unused_program"
                        ? item.program?.id
                        : item.milestone?.id)
                    }
                    onClick={() => {
                      if (item.type === "unused_program" && item.program?.id) {
                        // For funding programs, we might need different logic in future
                        // but for now, both use the same reclaim function
                        handleReclaimProgram(
                          item.program.id,
                          item.program.educhainProgramId || 0,
                          item.amount,
                          item.currency,
                          item.program.network || "educhain" // Use the program's network
                        );
                      } else if (
                        item.type === "unpaid_milestone" &&
                        item.milestone?.id
                      ) {
                        handleReclaimMilestone(item.milestone.id);
                      } else {
                        console.error("Invalid item for reclaim:", item);
                      }
                    }}
                  >
                    {reclaimingId ===
                    (item.type === "unused_program"
                      ? item.program?.id
                      : item.milestone?.id)
                      ? "Processing..."
                      : "Reclaim now"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* <Pagination totalCount={programData?.programs?.count ?? 0} pageSize={programPageSize} /> */}
    </div>
  );
}
