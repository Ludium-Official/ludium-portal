import { useCreateContractV2Mutation } from "@/apollo/mutation/create-contract-v2.generated";
import { useCreateOnchainContractInfoV2Mutation } from "@/apollo/mutation/create-onchain-contract-info-v2.generated";
import { useUpdateApplicationV2Mutation } from "@/apollo/mutation/update-application-v2.generated";
import { useUpdateContractV2Mutation } from "@/apollo/mutation/update-contract-v2.generated";
import { useUpdateMilestoneV2Mutation } from "@/apollo/mutation/update-milestone-v2.generated";
import { ApplicationsByProgramV2Document } from "@/apollo/queries/applications-by-program-v2.generated";
import { useContractsByProgramV2Query } from "@/apollo/queries/contracts-by-program-v2.generated";
import { useOnchainProgramInfosByProgramV2Query } from "@/apollo/queries/onchain-program-infos-by-program-v2.generated";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNetworks } from "@/contexts/networks-context";
import { deactivateContractMessages, sendMessage } from "@/lib/firebase-chat";
import { useAuth } from "@/lib/hooks/use-auth";
import { useContract } from "@/lib/hooks/use-contract";
import notify from "@/lib/notify";
import type {
  ContractFormProps,
  ContractInformation,
} from "@/types/recruitment";
import {
  ApplicationStatusV2,
  MilestoneStatusV2,
  OnchainContractStatusV2,
} from "@/types/types.generated";
import { usePrivy } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ContractForm } from "./contract-form";
import { useGetMilestonesV2Query } from "@/apollo/queries/milestones-v2.generated";

interface ContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractInformation: ContractInformation;
  assistantId?: string;
  readOnly?: boolean;
  isChatBox?: boolean;
}

export function ContractModal({
  open,
  onOpenChange,
  contractInformation,
  assistantId,
  readOnly = false,
  isChatBox = false,
}: ContractModalProps) {
  const { user } = usePrivy();
  const { userId } = useAuth();
  const { networks: networksWithTokens, getContractByNetworkId } =
    useNetworks();

  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [contractData, setContractData] = useState<any>(null);

  const { programInfo, applicationInfo, contractSnapshot } =
    contractInformation;

  const { data: milestonesData } = useGetMilestonesV2Query({
    variables: {
      query: {
        applicationId: applicationInfo.id,
        programId: programInfo.id,
      },
    },
    skip: !applicationInfo.applicant?.id || !programInfo.id,
  });

  const milestones = milestonesData?.milestonesV2?.data || [];

  const { data: onchainProgramInfosData } =
    useOnchainProgramInfosByProgramV2Query({
      variables: { programId: Number(programInfo.id) || 0 },
      skip: !programInfo.id,
    });

  const { data: contractsData } = useContractsByProgramV2Query({
    variables: {
      programId: Number(programInfo.id) || 0,
      pagination: { limit: 1000, offset: 0 },
    },
    skip: !programInfo.id,
  });

  const [createContractV2Mutation] = useCreateContractV2Mutation();
  const [updateContractV2Mutation] = useUpdateContractV2Mutation();
  const [updateMilestoneV2Mutation] = useUpdateMilestoneV2Mutation();
  const [createOnchainContractInfoV2Mutation] =
    useCreateOnchainContractInfoV2Mutation();
  const [updateApplicationV2Mutation] = useUpdateApplicationV2Mutation();

  const onchainProgramId =
    onchainProgramInfosData?.onchainProgramInfosByProgramV2?.data?.[0]?.onchainProgramId?.toString() ||
    null;

  const existingContract = contractsData?.contractsByProgramV2?.data?.find(
    (c) => c?.applicantId === Number(applicationInfo.applicant?.id)
  );

  const currentNetwork = networksWithTokens.find(
    (network) => Number(network.id) === programInfo.networkId
  );
  const currentContract = getContractByNetworkId(Number(currentNetwork?.id));

  const contract = useContract(
    currentNetwork?.chainName || "educhain",
    currentContract?.address
  );

  const isSponsor = programInfo.sponsor?.id === userId;
  const isBuilder = applicationInfo.applicant?.id === userId;

  const decimals = useMemo(() => {
    if (currentNetwork?.tokens && currentNetwork.tokens.length > 0) {
      return (
        currentNetwork.tokens.find((token) => token.id === programInfo.tokenId)
          ?.decimals ?? 18
      );
    }

    return 18;
  }, [currentNetwork, programInfo.tokenId]);

  useEffect(() => {
    const fetchContractData = async () => {
      if (existingContract?.onchainContractId && contract) {
        try {
          const data = await contract.getContract(
            existingContract.onchainContractId
          );
          setContractData(data);
        } catch (error) {
          console.error("Failed to fetch contract data:", error);
        }
      }
    };

    fetchContractData();
  }, [existingContract?.onchainContractId]);

  const totalPrice = useMemo(() => {
    let total = ethers.BigNumber.from(0);

    milestones.forEach((milestone) => {
      if (milestone.status !== MilestoneStatusV2.Completed) {
        const payout = milestone.payout || "0";
        const payoutBN = ethers.utils.parseUnits(payout, decimals);
        total = total.add(payoutBN);
      }
    });

    return Number.parseFloat(ethers.utils.formatUnits(total, decimals));
  }, [milestones, decimals]);

  const targetFundingWei = useMemo(() => {
    const totalPriceBN = ethers.utils.parseUnits(
      totalPrice.toString(),
      decimals
    );

    return totalPriceBN;
  }, [totalPrice, contractData, decimals]);

  const handleSendMessage = async () => {
    if (!userId || !applicationInfo.applicant?.id) {
      notify("Missing user information", "error");
      return;
    }

    setIsSendingMessage(true);
    try {
      if (applicationInfo.id) {
        await updateApplicationV2Mutation({
          variables: {
            id: applicationInfo.id,
            input: {
              status: ApplicationStatusV2.PendingSignature,
            },
          },
        });
      }

      await sendMessage(applicationInfo.chatRoomId || "", "", "-1");

      notify("Contract sent to builder for signature", "success");
      onOpenChange(false);

      setTimeout(() => {
        updateApplicationV2Mutation({
          variables: {
            id: applicationInfo.id || "",
            input: {
              status: ApplicationStatusV2.PendingSignature,
            },
          },
          refetchQueries: [
            {
              query: ApplicationsByProgramV2Document,
              variables: {
                query: {
                  programId: programInfo.id,
                },
              },
            },
          ],
        });
      }, 100);
    } catch (error) {
      console.error("Failed to send contract message:", error);
      notify("Failed to send contract message", "error");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleAddSignature = async () => {
    setIsSigningMessage(true);
    console.log(onchainProgramId);

    if (onchainProgramId === null) {
      notify("Onchain program ID not found", "error");
      return;
    }

    if (!userId || !applicationInfo.applicant?.walletAddress) {
      notify("Missing user information", "error");
      return;
    }

    if (!currentContract?.address) {
      notify("Contract address is not configured for this network", "error");
      return;
    }

    if (!currentContract?.id || !programInfo.sponsor?.id) {
      notify("Missing contract or sponsor information", "error");
      return;
    }

    try {
      const signature = await contract.createBuilderSignature(
        Number(onchainProgramId),
        applicationInfo.applicant?.walletAddress as `0x${string}`,
        BigInt(targetFundingWei.toString()),
        2n
      );

      await createContractV2Mutation({
        variables: {
          input: {
            programId: Number(programInfo.id) || 0,
            applicantId: Number(applicationInfo.applicant?.id),
            sponsorId: Number(programInfo.sponsor?.id),
            smartContractId: Number(currentContract.id),
            builder_signature: signature,
            applicationId: Number(applicationInfo.id),
            onchainContractId: existingContract?.onchainContractId || null,
          },
        },
      });

      await sendMessage(applicationInfo.chatRoomId || "", "", "-2");

      if (applicationInfo.chatRoomId) {
        await deactivateContractMessages(applicationInfo.chatRoomId, ["-1"]);
      }

      toast.success("Signature added successfully");
      notify("Contract signed and sent to sponsor", "success");

      await new Promise((resolve) => setTimeout(resolve, 500));
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add signature:", error);
      toast.error("Failed to add signature");
      notify(
        error instanceof Error ? error.message : "Failed to add signature",
        "error"
      );
    } finally {
      setIsSigningMessage(false);
    }
  };

  const handleSubmit = async () => {
    setIsSigningMessage(true);

    if (onchainProgramId === null) {
      notify("Onchain program ID not found", "error");
      return;
    }

    if (!userId || !applicationInfo.applicant?.id || !programInfo.sponsor?.id) {
      notify("Missing user information", "error");
      return;
    }

    if (!currentContract?.id) {
      notify("Contract address is not configured for this network", "error");
      return;
    }

    try {
      const contractSnapshotHash = await crypto.subtle
        .digest(
          "SHA-256",
          new TextEncoder().encode(JSON.stringify(contractJson))
        )
        .then((hashBuffer) => {
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        });

      const tokenInfo = currentNetwork?.tokens?.find(
        (token) => token.id === programInfo.tokenId
      );
      const tokenAddress = tokenInfo?.tokenAddress;
      const tokenName = tokenInfo?.tokenName;
      const tokenDecimals = tokenInfo?.decimals ?? decimals;
      const userWalletAddress = user?.wallet?.address;

      let txResult: {
        txHash: `0x${string}`;
        onchainContractId?: number | null;
      } | null = null;

      if (existingContract?.onchainContractId) {
        if (!existingContract.builder_signature) {
          notify(
            "Builder signature not found. Please wait for builder to sign the contract.",
            "error"
          );
          return;
        }

        const currentContractData = await contract.getContract(
          existingContract.onchainContractId
        );
        const currentAmount = ethers.utils.parseUnits(
          currentContractData.totalAmount,
          decimals
        );
        const isPriceChanged = !targetFundingWei.eq(currentAmount);

        if (isPriceChanged) {
          txResult = await contract.updateContract(
            existingContract.onchainContractId,
            BigInt(targetFundingWei.toString()),
            2n,
            existingContract.builder_signature as `0x${string}`,
            contractSnapshotHash as `0x${string}`,
            tokenAddress as `0x${string}` | undefined,
            userWalletAddress,
            tokenName,
            tokenDecimals
          );

          if (existingContract?.id) {
            await updateContractV2Mutation({
              variables: {
                id: existingContract.id,
                input: {
                  contract_snapshot_cotents: contractJson,
                  contract_snapshot_hash: `0x${contractSnapshotHash}`,
                },
              },
            });
          }
        } else {
          if (existingContract?.id) {
            await updateContractV2Mutation({
              variables: {
                id: existingContract.id,
                input: {
                  contract_snapshot_cotents: contractJson,
                  contract_snapshot_hash: `0x${contractSnapshotHash}`,
                },
              },
            });
          }
        }
      } else {
        if (!existingContract?.id) {
          toast.error("Contract not found");
          notify("Contract not found", "error");
          return;
        }

        if (!existingContract.builder_signature) {
          notify(
            "Builder signature not found. Please wait for builder to sign the contract.",
            "error"
          );
          return;
        }

        txResult = await contract.createContract(
          Number(onchainProgramId),
          applicationInfo.applicant?.walletAddress as `0x${string}`,
          BigInt(targetFundingWei.toString()),
          existingContract.builder_signature as `0x${string}`,
          contractSnapshotHash as `0x${string}`,
          2n,
          tokenAddress as `0x${string}` | undefined,
          userWalletAddress,
          tokenName,
          tokenDecimals
        );

        if (!txResult.onchainContractId) {
          throw new Error("Failed to get contract ID from transaction receipt");
        }

        await createOnchainContractInfoV2Mutation({
          variables: {
            input: {
              programId: Number(programInfo.id) || 0,
              applicantId: Number(applicationInfo.applicant?.id) || 0,
              sponsorId: Number(programInfo.sponsor?.id) || 0,
              onchainContractId: txResult.onchainContractId,
              smartContractId: Number(currentContract.id),
              tx: txResult.txHash,
              status: OnchainContractStatusV2.Active,
            },
          },
        });

        await updateContractV2Mutation({
          variables: {
            id: existingContract.id,
            input: {
              contract_snapshot_cotents: contractJson,
              contract_snapshot_hash: `0x${contractSnapshotHash}`,
              onchainContractId: txResult.onchainContractId,
            },
          },
        });
      }

      const milestoneUpdatePromises = milestones
        .filter((milestone) => milestone.id)
        .map((milestone) =>
          updateMilestoneV2Mutation({
            variables: {
              id: milestone.id!,
              input: {
                status: MilestoneStatusV2.InProgress,
              },
            },
          })
        );

      await Promise.all([
        updateApplicationV2Mutation({
          variables: {
            id: applicationInfo.id,
            input: {
              status: ApplicationStatusV2.InProgress,
            },
          },
        }),
        ...milestoneUpdatePromises,
      ]);

      if (applicationInfo.chatRoomId) {
        await deactivateContractMessages(applicationInfo.chatRoomId);
      }

      await sendMessage(
        applicationInfo.chatRoomId || "",
        "The contract is now active.",
        "0"
      );

      toast.success("Contract created successfully!");
      notify("Contract created on-chain and in database", "success");

      await new Promise((resolve) => setTimeout(resolve, 500));
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit contract", error);
      toast.error("Failed to create contract");
      notify(
        error instanceof Error ? error.message : "Failed to create contract",
        "error"
      );
    } finally {
      setIsSigningMessage(false);
    }
  };

  const contractJson: ContractFormProps = useMemo(() => {
    if (!isChatBox && contractSnapshot?.contract_snapshot_cotents) {
      return contractSnapshot.contract_snapshot_cotents;
    }

    const sortedMilestones = milestones
      .map((milestone) => ({
        id: milestone.id,
        status: milestone.status || MilestoneStatusV2.UnderReview,
        title: milestone.title,
        description: milestone.description,
        deadline: milestone.deadline,
        payout: milestone.payout,
      }))
      .sort((a, b) => {
        if (a.deadline && b.deadline) {
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        }
        return 0;
      });

    return {
      programTitle: programInfo.title,
      milestones: sortedMilestones,
      sponsor: {
        firstName: programInfo.sponsor?.firstName,
        lastName: programInfo.sponsor?.lastName,
        email: programInfo.sponsor?.email,
      },
      applicant: {
        firstName: applicationInfo.applicant?.firstName,
        lastName: applicationInfo.applicant?.lastName,
        email: applicationInfo.applicant?.email,
      },
      totalPrice,
      tokenId: Number(programInfo.tokenId) || null,
    };
  }, [
    isChatBox,
    contractSnapshot?.contract_snapshot_cotents,
    milestones,
    programInfo.title,
    programInfo.sponsor?.firstName,
    programInfo.sponsor?.lastName,
    programInfo.sponsor?.email,
    applicationInfo.applicant?.firstName,
    applicationInfo.applicant?.lastName,
    applicationInfo.applicant?.email,
    totalPrice,
    programInfo.tokenId,
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <ContractForm
          contractJson={contractJson}
          isSponsor={isSponsor}
          onchainContractId={
            contractSnapshot?.onchainContractId ||
            existingContract?.onchainContractId ||
            undefined
          }
          networkId={programInfo.networkId}
        />

        {(() => {
          if (readOnly) {
            return null;
          }

          if (assistantId === undefined) {
            if (isSponsor && !isBuilder) {
              return (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="purple"
                    onClick={handleSendMessage}
                    disabled={isSendingMessage}
                    className="w-fit"
                  >
                    {isSendingMessage ? "Sending..." : "Send to Builder"}
                  </Button>
                </div>
              );
            }
            return null;
          }

          if (assistantId === "-1") {
            if (isBuilder && !isSponsor) {
              return (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="purple"
                    onClick={handleAddSignature}
                    disabled={isSigningMessage}
                    className="w-fit"
                  >
                    {isSigningMessage ? "Signing..." : "Add Signature"}
                  </Button>
                </div>
              );
            }
            return null;
          }

          if (assistantId === "-2") {
            if (isSponsor && !isBuilder) {
              return (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="purple"
                    onClick={handleSubmit}
                    disabled={isSigningMessage}
                    className="w-fit"
                  >
                    {isSigningMessage ? "Signing..." : "Sign"}
                  </Button>
                </div>
              );
            }
            return null;
          }

          return null;
        })()}
      </DialogContent>
    </Dialog>
  );
}
