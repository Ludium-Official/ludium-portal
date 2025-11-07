import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContractFormProps, ContractInformation } from "@/types/recruitment";
import { useNetworks } from "@/contexts/networks-context";
import { useContract } from "@/lib/hooks/use-contract";
import { useAuth } from "@/lib/hooks/use-auth";
import { sendMessage } from "@/lib/firebase-chat";
import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import notify from "@/lib/notify";
import { useGetMilestonesV2Query } from "@/apollo/queries/milestones-v2.generated";
import { ContractForm } from "./contract-form";
import {
  ApplicationStatusV2,
  MilestoneStatusV2,
  OnchainContractStatusV2,
} from "@/types/types.generated";
import { useCreateContractV2Mutation } from "@/apollo/mutation/create-contract-v2.generated";
import { useUpdateContractV2Mutation } from "@/apollo/mutation/update-contract-v2.generated";
import { useUpdateMilestoneV2Mutation } from "@/apollo/mutation/update-milestone-v2.generated";
import { useCreateOnchainContractInfoV2Mutation } from "@/apollo/mutation/create-onchain-contract-info-v2.generated";
import { useUpdateApplicationV2Mutation } from "@/apollo/mutation/update-application-v2.generated";
import { useContractsByProgramV2Query } from "@/apollo/queries/contracts-by-program-v2.generated";
import { ApplicationsByProgramV2Document } from "@/apollo/queries/applications-by-program-v2.generated";
import { ethers } from "ethers";
import { useOnchainProgramInfosByProgramV2Query } from "@/apollo/queries/onchain-program-infos-by-program-v2.generated";
import { useGetProgramV2Query } from "@/apollo/queries/program-v2.generated";
import { useParams } from "react-router";

interface ContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractInformation: ContractInformation;
  assistantId?: string;
  readOnly?: boolean;
}

export function ContractModal({
  open,
  onOpenChange,
  contractInformation,
  assistantId,
  readOnly = false,
}: ContractModalProps) {
  const { id } = useParams();
  const { userId } = useAuth();
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

  const { pendingPrice, totalPrice } = useMemo(() => {
    let pending = 0;
    let total = 0;

    milestones.forEach((milestone) => {
      if (milestone.status !== MilestoneStatusV2.Completed) {
        const payout = parseFloat(milestone.payout || "0") || 0;
        total += payout;

        if (milestone.status === MilestoneStatusV2.UnderReview) {
          pending += payout;
        }
      }
    });

    return {
      pendingPrice: Math.round(pending * 100) / 100,
      totalPrice: Math.round(total * 100) / 100,
    };
  }, [milestones]);

  const decimals = useMemo(() => {
    if (currentNetwork?.tokens && currentNetwork.tokens.length > 0) {
      return (
        currentNetwork.tokens.find(
          (token) => token.id === programData?.programV2?.token?.id
        )?.decimals ?? 18
      );
    }

    return 18;
  }, [currentNetwork]);

  const targetFundingWei = useMemo(() => {
    if (pendingPrice <= 0) {
      return ethers.utils.parseUnits("0", decimals);
    }
    return ethers.utils.parseUnits(pendingPrice.toString(), decimals);
  }, [pendingPrice, decimals]);

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
      }

      await sendMessage(contractInformation.chatRoomId || "", "", "-1");

      notify("Contract sent to builder for signature", "success");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to send contract message:", error);
      notify("Failed to send contract message", "error");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleAddSignature = async () => {
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
        3
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

      toast.success("Signature added successfully");
      notify("Contract signed and sent to sponsor", "success");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add signature:", error);
      toast.error("Failed to add signature");
      notify(
        error instanceof Error ? error.message : "Failed to add signature",
        "error"
      );
    }
  };

  const handleSubmit = async () => {
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

    if (!existingContract?.builder_signature) {
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

      const txResult = await contract.createContract(
        onchainProgramId,
        contractInformation.applicant?.walletAddress as `0x${string}`,
        BigInt(targetFundingWei.toString()),
        existingContract.builder_signature as `0x${string}`,
        contractSnapshotHash as `0x${string}`
      );

      if (!txResult.onchainContractId) {
        throw new Error("Failed to get contract ID from transaction receipt");
      }

      if (existingContract?.id) {
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

        await Promise.all(milestoneUpdatePromises);

        await createOnchainContractInfoV2Mutation({
          variables: {
            input: {
              programId: Number(contractInformation.programId) || 0,
              applicantId: Number(contractInformation.applicant?.id) || 0,
              sponsorId: Number(contractInformation.sponsor?.id) || 0,
              onchainContractId: txResult.onchainContractId,
              smartContractId: Number(currentContract?.id) || 0,
              tx: txResult.txHash,
              status: OnchainContractStatusV2.Active,
            },
          },
        });
      } else {
        toast.error("Contract not found");
        notify("Contract not found", "error");
        return;
      }

      toast.success("Contract created successfully!");
      notify("Contract created on-chain and in database", "success");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit contract", error);
      toast.error("Failed to create contract");
      notify(
        error instanceof Error ? error.message : "Failed to create contract",
        "error"
      );
    }
  };

  const contractJson: ContractFormProps = {
    programTitle: contractInformation.title,
    milestones: milestones.map((milestone) => ({
      id: milestone.id,
      status: milestone.status || MilestoneStatusV2.UnderReview,
      title: milestone.title,
      description: milestone.description,
      deadline: milestone.deadline,
      payout: milestone.payout,
    })),
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
    tokenId: Number(programData?.programV2?.token?.id) || null,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <ContractForm contractJson={contractJson} />

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
                    disabled={isSendingMessage}
                    className="w-fit"
                  >
                    {isSendingMessage ? "Signing..." : "Add Signature"}
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
                    disabled={isSendingMessage}
                    className="w-fit"
                  >
                    {isSendingMessage ? "Creating..." : "Create Contract"}
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
