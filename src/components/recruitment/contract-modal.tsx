import logo from "@/assets/logo.svg";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContractInformation } from "@/types/recruitment";
import { Separator } from "../ui/separator";
import {
  formatDateKorean,
  addDaysToDate,
  getUserDisplayName,
} from "@/lib/utils";
import { MarkdownPreviewer } from "../markdown";
import { useNetworks } from "@/contexts/networks-context";
import { useContract } from "@/lib/hooks/use-contract";
import { useAuth } from "@/lib/hooks/use-auth";
import { sendMessage } from "@/lib/firebase-chat";
import toast from "react-hot-toast";
import { useState } from "react";
import notify from "@/lib/notify";
import { useGetMilestonesV2Query } from "@/apollo/queries/milestones-v2.generated";

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
    if (milestone.status !== "completed") {
      if (milestone.status === "pending") {
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
    console.log(userId, contractInformation.applicant?.walletAddress);
    if (!userId || !contractInformation.applicant?.walletAddress) {
      notify("Missing user information", "error");
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

      // TODO: Save the signature to the database
      // This should:
      // 1. Save signature to database
      // 2. Send message to sponsor that contract is ready

      // Send notification to sponsor
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
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );

      toast.success("Contract created successfully!");
      console.log("Transaction:", tx);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit contract", error);
      toast.error("Failed to create contract");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-3xl font-bold">
            Employment Contract
            <img src={logo} alt="LUDIUM" className="h-8" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="text-lg font-bold mb-2">
            {contractInformation.title}
          </div>
          <Separator className="my-4" />
          <div className="flex-1 overflow-y-auto px-2">
            <div className="space-y-6 text-sm leading-relaxed">
              <div>
                <h3 className="text-lg font-bold mb-2">1. Contract Overview</h3>
                <p className="mb-2">
                  This contract (hereinafter referred to as the
                  &ldquo;Contract&rdquo;) is a project execution agreement
                  between the Sponsor and the Builder through Ludium.
                </p>
                <p>
                  Both parties agree to faithfully perform the project in
                  accordance with the terms specified below.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">2. Project Details</h3>
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div
                      key={milestone.id || index}
                      className="border border-border rounded-lg p-4 bg-muted/30 space-y-3"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-semibold text-muted-foreground">
                            Milestone Title
                            <span className="text-green-500">
                              {milestone.status === "progress" &&
                                " (In Progress)"}
                            </span>
                          </div>
                          <div>{milestone.title || ""}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-semibold text-muted-foreground">
                            Description
                          </div>
                          <MarkdownPreviewer
                            value={milestone.description || ""}
                            className="mb-0!"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-semibold text-muted-foreground">
                            Submission Date
                          </div>
                          <div>{formatDateKorean(milestone.deadline)}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-semibold text-muted-foreground">
                            Payment Date
                          </div>
                          <div>{addDaysToDate(milestone.deadline, 3)}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-semibold text-muted-foreground">
                            Payment Amount
                          </div>
                          <div>{milestone.payout}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">
                  3. Builder&apos;s Obligations
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    The Builder shall complete the work within the submission
                    deadline according to the agreed scope and quality
                    standards.
                  </li>
                  <li>
                    All deliverables must be the Builder&apos;s original work
                    and shall not infringe upon any third-party copyrights.
                  </li>
                  <li>
                    The Builder shall faithfully share progress updates during
                    the project and respond promptly to the Sponsor&apos;s
                    feedback.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">
                  4. Sponsor&apos;s Obligations
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    The Sponsor shall review submitted deliverables fairly and
                    promptly.
                  </li>
                  <li>
                    The Sponsor shall not request additional work without
                    reasonable cause. If additional work is desired, a new
                    milestone must be added.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">
                  5. Mutual Good Faith Performance and Breach Actions
                </h3>

                <div className="mt-2">
                  <h4 className="font-semibold mb-1">
                    5-1. Mutual Good Faith Performance
                  </h4>
                  <p className="mb-2">
                    The Sponsor and Builder shall cooperate based on mutual{" "}
                    <strong>trust and good faith</strong>,
                  </p>
                  <p className="mb-2">
                    and faithfully perform their respective roles and
                    obligations.
                  </p>
                  <p>
                    Intentional delays, unfaithful communication, or
                    unauthorized absence of contact shall be considered breach
                    of contract.
                  </p>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">
                    5-2. Breach and Termination
                  </h4>

                  <div className="mb-3">
                    <strong>① Builder&apos;s Breach</strong>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                      <li>
                        If the Builder is out of contact for an extended period,
                        neglects communication, or the quality of deliverables
                        is significantly substandard, the Sponsor may request
                        contract termination.
                      </li>
                      <li>
                        When the Sponsor files a report, a notification is
                        automatically sent to the Builder.
                      </li>
                      <li>
                        If the Builder immediately expresses intention to
                        faithfully re-perform and the Sponsor accepts, the
                        Sponsor may cancel the report.
                      </li>
                      <li>
                        If a subsequent report is filed for the same reason, the
                        platform shall immediately terminate the contract
                        without further mediation.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <strong>② Sponsor&apos;s Breach</strong>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                      <li className="mb-2">
                        <strong>Requesting Work Outside Agreed Scope</strong>
                        <br />
                        The Sponsor shall not unilaterally change the work scope
                        specified in the contract or request additional work. If
                        additional work is required, a separate contract or
                        milestone must be established with the Builder&apos;s
                        consent.
                      </li>
                      <li className="mb-2">
                        <strong>False Reporting</strong>
                        <br />
                        The Sponsor shall not make false or malicious reports
                        without objective grounds. If the Builder suffers
                        disadvantage due to an unfair report, the platform may
                        invalidate the report and impose sanctions on the
                        Sponsor.
                      </li>
                      <li>
                        <strong>Unfair Contract Termination</strong>
                        <br />
                        The Sponsor shall not unilaterally suspend or terminate
                        the project without just cause. If project suspension is
                        necessary, Ludium&apos;s mediation procedure must be
                        followed, and contracts terminated without platform
                        approval shall be invalid.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">
                  6. On-Platform Transaction Policy (Off-Platform Transactions
                  Prohibited)
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    After contract execution, the Sponsor and Builder shall
                    communicate only through Ludium&apos;s chat system.
                  </li>
                  <li>
                    Sharing personal contact information (email, SNS, phone
                    numbers, etc.) to induce or conduct{" "}
                    <strong>off-platform transactions</strong> is prohibited.
                  </li>
                  <li>
                    Direct transactions outside Ludium are excluded from
                    Ludium&apos;s guarantee, escrow, and dispute mediation, and
                    detection may result in immediate account suspension or
                    permanent ban.
                  </li>
                  <li>All transactions are guaranteed only through Ludium.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">
                  7. Dispute Resolution
                </h3>
                <p>
                  In case of contract-related disputes, both parties shall first
                  attempt resolution through the platform&apos;s internal
                  dispute mediation system.
                </p>
                <p className="mt-2">
                  If unresolved, smart contract records and on-chain
                  transactions shall be used as final evidence and handled
                  according to platform regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col! gap-4 border-t pt-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-muted-foreground">
                Sponsor
              </div>
              <div className="text-sm">
                {getUserDisplayName(
                  contractInformation.sponsor?.firstName,
                  contractInformation.sponsor?.lastName,
                  contractInformation.sponsor?.email
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-muted-foreground">
                Builder
              </div>
              <div className="text-sm">
                {getUserDisplayName(
                  contractInformation.applicant?.firstName,
                  contractInformation.applicant?.lastName,
                  contractInformation.applicant?.email
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-muted-foreground">
                Total price
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">
                  {pendingPrice > 0 && `You will pay only ${pendingPrice}`}
                </span>
                {totalPrice - pendingPrice}
              </div>
            </div>
          </div>
          {((assistantId !== "-1" && isSponser) ||
            (assistantId !== "-2" && isBuilder)) && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="default"
                // sponser이고, builder의 signature가 없을 경우 메세지 send
                // builder일 경우 signature db에 추가
                // sponser이고, builder의 signature가 있을 경우 handleSubmit 실행
                onClick={
                  isSponser && !isBuilder
                    ? handleSendMessage
                    : isBuilder
                    ? handleAddSignature
                    : handleSubmit
                }
                disabled={
                  isSendingMessage || (assistantId === userId && isBuilder)
                }
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
