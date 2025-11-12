import { useCreateContractV2Mutation } from "@/apollo/mutation/create-contract-v2.generated";
import { useCreateOnchainContractInfoV2Mutation } from "@/apollo/mutation/create-onchain-contract-info-v2.generated";
import { useUpdateApplicationV2Mutation } from "@/apollo/mutation/update-application-v2.generated";
import { useUpdateContractV2Mutation } from "@/apollo/mutation/update-contract-v2.generated";
import { useUpdateMilestoneV2Mutation } from "@/apollo/mutation/update-milestone-v2.generated";
import { ApplicationsByProgramV2Document } from "@/apollo/queries/applications-by-program-v2.generated";
import { useContractsByProgramV2Query } from "@/apollo/queries/contracts-by-program-v2.generated";
import { useGetMilestonesV2Query } from "@/apollo/queries/milestones-v2.generated";
import { useOnchainProgramInfosByProgramV2Query } from "@/apollo/queries/onchain-program-infos-by-program-v2.generated";
import { useGetProgramV2Query } from "@/apollo/queries/program-v2.generated";
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
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { ContractForm } from "./contract-form";

interface ContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractInformation: ContractInformation;
  assistantId?: string;
  readOnly?: boolean;
  contractSnapshot?: any;
}

export function ContractModal({
  open,
  onOpenChange,
  contractInformation,
  assistantId,
  readOnly = false,
  contractSnapshot,
}: ContractModalProps) {
  const { id } = useParams();
  const { userId } = useAuth();
  const { user } = usePrivy();
  const { networks: networksWithTokens, getContractByNetworkId } =
    useNetworks();

  const { data: programData } = useGetProgramV2Query({
    variables: {
      id: id || "",
    },
    skip: !id,
  });

  const { data: milestonesData } = useGetMilestonesV2Query({
    variables: {
      query: {
        applicantId: contractInformation.applicant?.id,
        programId: contractInformation.programId,
      },
    },
  });
  const milestones = milestonesData?.milestonesV2?.data || [];

  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [createContractV2Mutation] = useCreateContractV2Mutation();
  const [updateContractV2Mutation] = useUpdateContractV2Mutation();
  const [updateMilestoneV2Mutation] = useUpdateMilestoneV2Mutation();
  const [createOnchainContractInfoV2Mutation] =
    useCreateOnchainContractInfoV2Mutation();
  const [updateApplicationV2Mutation] = useUpdateApplicationV2Mutation();

  const { data: onchainProgramInfosData } =
    useOnchainProgramInfosByProgramV2Query({
      variables: { programId: Number(contractInformation.programId) || 0 },
      skip: !contractInformation.programId,
    });
  const onchainProgramId =
    onchainProgramInfosData?.onchainProgramInfosByProgramV2?.data?.[0]
      ?.onchainProgramId ?? 0;

  const { data: contractsData } = useContractsByProgramV2Query({
    variables: {
      programId: Number(programData?.programV2?.id) || 0,
      pagination: { limit: 1000, offset: 0 },
    },
    skip: !contractInformation.programId,
  });

  const existingContract = contractsData?.contractsByProgramV2?.data?.find(
    (c) => c?.applicantId === Number(contractInformation.applicant?.id)
  );

  const currentNetwork = networksWithTokens.find(
    (network) => Number(network.id) === contractInformation.networkId
  );
  const currentContract = getContractByNetworkId(Number(currentNetwork?.id));

  const contract = useContract(
    currentNetwork?.chainName || "educhain",
    currentContract?.address
  );

  const isSponser = contractInformation.sponsor?.id === userId;
  const isBuilder = contractInformation.applicant?.id === userId;

  const decimals = useMemo(() => {
    if (currentNetwork?.tokens && currentNetwork.tokens.length > 0) {
      return (
        currentNetwork.tokens.find(
          (token) => token.id === programData?.programV2?.token?.id
        )?.decimals ?? 18
      );
    }

    return 18;
  }, [currentNetwork, programData?.programV2?.token?.id]);

  const { pendingPrice, totalPrice, pendingPriceString, totalPriceString } =
    useMemo(() => {
      let pending = ethers.BigNumber.from(0);
      let total = ethers.BigNumber.from(0);

      milestones.forEach((milestone) => {
        if (milestone.status !== MilestoneStatusV2.Completed) {
          const payout = milestone.payout || "0";
          const payoutBN = ethers.utils.parseUnits(payout, decimals);
          total = total.add(payoutBN);

          if (milestone.status === MilestoneStatusV2.UnderReview) {
            pending = pending.add(payoutBN);
          }
        }
      });

      return {
        pendingPrice: Number.parseFloat(
          ethers.utils.formatUnits(pending, decimals)
        ),
        totalPrice: Number.parseFloat(
          ethers.utils.formatUnits(total, decimals)
        ),
        pendingPriceString: ethers.utils.formatUnits(pending, decimals),
        totalPriceString: ethers.utils.formatUnits(total, decimals),
      };
    }, [milestones, decimals]);

  const targetFundingWei = useMemo(() => {
    if (pendingPrice <= 0) {
      return ethers.utils.parseUnits("0", decimals);
    }
    return ethers.utils.parseUnits(pendingPriceString, decimals);
  }, [pendingPrice, pendingPriceString, decimals]);

  const handleSendMessage = async () => {
    if (!userId || !contractInformation.applicant?.id) {
      notify("Missing user information", "error");
      return;
    }

    setIsSendingMessage(true);
    try {
      if (contractInformation.applicationId) {
        await updateApplicationV2Mutation({
          variables: {
            id: contractInformation.applicationId,
            input: {
              status: ApplicationStatusV2.PendingSignature,
            },
          },
        });
      }

      await sendMessage(contractInformation.chatRoomId || "", "", "-1");

      notify("Contract sent to builder for signature", "success");
      onOpenChange(false);

      setTimeout(() => {
        updateApplicationV2Mutation({
          variables: {
            id: contractInformation.applicationId || "",
            input: {
              status: ApplicationStatusV2.PendingSignature,
            },
          },
          refetchQueries: [
            {
              query: ApplicationsByProgramV2Document,
              variables: {
                query: {
                  programId: contractInformation.programId,
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
    if (!userId || !contractInformation.applicant?.walletAddress) {
      notify("Missing user information", "error");
      return;
    }

    if (!currentContract?.address) {
      notify("Contract address is not configured for this network", "error");
      return;
    }

    if (!currentContract?.id || !contractInformation.sponsor?.id) {
      notify("Missing contract or sponsor information", "error");
      return;
    }

    try {
      const signature = await contract.createBuilderSignature(
        onchainProgramId,
        contractInformation.applicant.walletAddress as `0x${string}`,
        BigInt(targetFundingWei.toString()),
        3n
      );

      await createContractV2Mutation({
        variables: {
          input: {
            programId: Number(programData?.programV2?.id) || 0,
            applicantId: Number(contractInformation.applicant.id),
            sponsorId: Number(contractInformation.sponsor.id),
            smartContractId: Number(currentContract.id),
            builder_signature: signature,
            applicationId: Number(contractInformation.applicationId),
          },
        },
      });

      await sendMessage(contractInformation.chatRoomId || "", "", "-2");

      if (contractInformation.chatRoomId) {
        await deactivateContractMessages(contractInformation.chatRoomId, [
          "-1",
        ]);
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
    if (
      !userId ||
      !contractInformation.applicant?.id ||
      !contractInformation.sponsor?.id
    ) {
      notify("Missing user information", "error");
      return;
    }

    if (!currentContract?.id) {
      notify("Contract address is not configured for this network", "error");
      return;
    }

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
        (token) => token.id === programData?.programV2?.token?.id
      );
      const tokenAddress = tokenInfo?.tokenAddress;
      const tokenName = tokenInfo?.tokenName;
      const tokenDecimals = tokenInfo?.decimals ?? decimals;
      const userWalletAddress = user?.wallet?.address;

      const txResult = await contract.createContract(
        onchainProgramId,
        contractInformation.applicant?.walletAddress as `0x${string}`,
        BigInt(targetFundingWei.toString()),
        existingContract.builder_signature as `0x${string}`,
        contractSnapshotHash as `0x${string}`,
        3n,
        tokenAddress as `0x${string}` | undefined,
        userWalletAddress,
        tokenName,
        tokenDecimals
      );

      if (!txResult.onchainContractId) {
        throw new Error("Failed to get contract ID from transaction receipt");
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
        updateContractV2Mutation({
          variables: {
            id: existingContract.id,
            input: {
              contract_snapshot_cotents: contractJson,
              contract_snapshot_hash: `0x${contractSnapshotHash}`,
              onchainContractId: txResult.onchainContractId,
            },
          },
        }),
        updateApplicationV2Mutation({
          variables: {
            id: contractInformation.applicationId,
            input: {
              status: ApplicationStatusV2.InProgress,
            },
          },
        }),
        ...milestoneUpdatePromises,
      ]);

      await createOnchainContractInfoV2Mutation({
        variables: {
          input: {
            programId: Number(contractInformation.programId) || 0,
            applicantId: Number(contractInformation.applicant?.id) || 0,
            sponsorId: Number(contractInformation.sponsor?.id) || 0,
            onchainContractId: txResult.onchainContractId,
            smartContractId: Number(currentContract.id),
            tx: txResult.txHash,
            status: OnchainContractStatusV2.Active,
          },
        },
      });

      if (contractInformation.chatRoomId) {
        await deactivateContractMessages(contractInformation.chatRoomId);
      }

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

  const contractJson: ContractFormProps =
    contractSnapshot?.contract_snapshot_cotents || {
      programTitle: contractInformation.title,
      milestones: milestones
        .map((milestone) => {
          return {
            id: milestone.id,
            status: milestone.status || MilestoneStatusV2.UnderReview,
            title: milestone.title,
            description: milestone.description,
            deadline: milestone.deadline,
            payout: milestone.payout,
          };
        })
        .sort((a, b) => {
          if (a.deadline && b.deadline) {
            return (
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            );
          }
          return 0;
        }),
      sponsor: {
        firstName: contractInformation.sponsor?.firstName,
        lastName: contractInformation.sponsor?.lastName,
        email: contractInformation.sponsor?.email,
      },
      applicant: {
        firstName: contractInformation.applicant?.firstName,
        lastName: contractInformation.applicant?.lastName,
        email: contractInformation.applicant?.email,
      },
      totalPrice: totalPrice,
      pendingPrice: pendingPrice,
      totalPriceString: totalPriceString,
      pendingPriceString: pendingPriceString,
      tokenId: Number(programData?.programV2?.token?.id) || null,
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <ContractForm contractJson={contractJson} isSponsor={isSponser} />

        {(() => {
          if (readOnly) {
            return null;
          }

          if (assistantId === undefined) {
            if (isSponser && !isBuilder) {
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
            if (isBuilder && !isSponser) {
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
            if (isSponser && !isBuilder) {
              return (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="purple"
                    onClick={handleSubmit}
                    disabled={isSigningMessage}
                    className="w-fit"
                  >
                    {isSigningMessage ? "Creating..." : "Create Contract"}
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
