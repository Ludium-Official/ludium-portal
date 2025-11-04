import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContractFormProps, ContractInformation } from "@/types/recruitment";
import { useNetworks } from "@/contexts/networks-context";
import { useContract } from "@/lib/hooks/use-contract";
import { useAuth } from "@/lib/hooks/use-auth";
import { sendMessage } from "@/lib/firebase-chat";
import toast from "react-hot-toast";
import { useState } from "react";
import notify from "@/lib/notify";
import { useGetMilestonesV2Query } from "@/apollo/queries/milestones-v2.generated";
import { ContractForm } from "./contract-form";
import { MilestoneStatusV2 } from "@/types/types.generated";

interface ContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractInformation: ContractInformation;
  assistantId?: string;
}

export function ContractModal({
  open,
  onOpenChange,
  contractInformation,
  assistantId,
}: ContractModalProps) {
  const { userId } = useAuth();
  const { networks: networksWithTokens, getContractByNetworkId } =
    useNetworks();
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
  let pendingPrice = 0;

  const totalPrice = milestones.reduce((acc, milestone) => {
    if (milestone.status !== MilestoneStatusV2.Completed) {
      if (milestone.status === MilestoneStatusV2.UnderReview) {
        pendingPrice += Number(milestone.payout);
      }

      return acc + Number(milestone.payout);
    }

    return acc;
  }, 0);

  const handleSendMessage = async () => {
    if (!userId || !contractInformation.applicant?.id) {
      notify("Missing user information", "error");
      return;
    }

    setIsSendingMessage(true);
    try {
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

    try {
      const signature = await contract.createBuilderSignature(
        Number(contractInformation.programId),
        contractInformation.applicant.walletAddress as `0x${string}`,
        BigInt(pendingPrice),
        3n
      );

      console.log("Builder signature created:", signature);

      // TODO: 이거 contract db에 저장하고 sponsor가 pay 해야 함
      // TODO: Save the signature to the database
      // This should:
      // 1. Save signature to database
      // 2. Send message to sponsor that contract is ready

      await sendMessage(contractInformation.chatRoomId || "", "", "-2");

      toast.success("Signature added successfully");
      notify("Contract signed and sent to sponsor", "success");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add signature:", error);
      toast.error("Failed to add signature");
    }
  };

  const handleSubmit = async () => {
    try {
      const tx = await contract.createContract(
        Number(contractInformation.programId),
        contractInformation.applicant?.walletAddress as `0x${string}`,
        BigInt(pendingPrice),
        // TODO: builder signature
        "0x6ad11651e71d0be04e0d3924021e505bcba748b537958f90ae653378d71a29ec"
      );

      toast.success("Contract created successfully!");
      console.log("Transaction:", tx);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit contract", error);
      toast.error("Failed to create contract");
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <ContractForm contractJson={contractJson} />

        {((assistantId !== "-1" && isSponser) ||
          (assistantId !== "-2" && isBuilder)) && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="purple"
              onClick={
                isSponser && !isBuilder
                  ? handleSendMessage
                  : isBuilder
                  ? handleAddSignature
                  : handleSubmit
              }
              disabled={isSendingMessage}
              className="w-fit"
            >
              {isSendingMessage
                ? "Sending..."
                : isSponser && !isBuilder
                ? "Send to Builder"
                : isBuilder
                ? "Add Signature"
                : "Create Contract"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
