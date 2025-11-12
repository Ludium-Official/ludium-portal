import { useCreateMilestoneV2Mutation } from "@/apollo/mutation/create-milestone-v2.generated";
import { useContractsByApplicationV2Query } from "@/apollo/queries/contracts-by-application-v2.generated";
import { useGetMilestonesV2Query } from "@/apollo/queries/milestones-v2.generated";
import { useGetProgramV2Query } from "@/apollo/queries/program-v2.generated";
import { ChatBox } from "@/components/chat/chat-box";
import { MarkdownPreviewer } from "@/components/markdown";
import MarkdownEditor from "@/components/markdown/markdown-editor";
import { ContractModal } from "@/components/recruitment/contract/contract-modal";
import { HireButton } from "@/components/recruitment/hire-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  type ChatMessageFile,
  getAllFiles,
  getLatestMessage,
} from "@/lib/firebase-chat";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  dDay,
  formatUTCDateLocal,
  fromUTCString,
  toUTCString,
} from "@/lib/utils";
import type { ContractInformation } from "@/types/recruitment";
import {
  ApplicationStatusV2,
  MilestoneStatusV2,
  type MilestoneV2,
} from "@/types/types.generated";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Timestamp } from "firebase/firestore";
import { FileText, Folder, Image as ImageIcon, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import MessageListItem from "./message-list-item";
import { useParams } from "react-router";
import { useApplicationsByProgramV2Query } from "@/apollo/queries/applications-by-program-v2.generated";
import { Badge } from "@/components/ui/badge";
import { useNetworks } from "@/contexts/networks-context";

const milestoneFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.string().min(1, "Price is required"),
  deadline: z.date({
    required_error: "Deadline is required",
  }),
  description: z.string().min(1, "Description is required"),
});

type MilestoneFormData = z.infer<typeof milestoneFormSchema>;

const MilestoneCard = ({
  milestone,
  onClick,
  isCompleted = false,
}: {
  milestone: MilestoneV2 & { isCompleted?: boolean };
  onClick: (milestone: MilestoneV2) => void;
  isCompleted?: boolean;
}) => {
  const getDaysLeft = () => {
    if (!milestone.deadline) return null;
    const now = new Date();
    const deadline = fromUTCString(milestone.deadline);
    if (!deadline) return null;
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft();
  const isDraft = milestone.status === MilestoneStatusV2.Draft;
  const isUnderReview = milestone.status === MilestoneStatusV2.UnderReview;
  const isUrgent =
    !isCompleted &&
    !isDraft &&
    !isUnderReview &&
    daysLeft !== null &&
    daysLeft <= 3 &&
    daysLeft >= 0;

  const getBackgroundColor = () => {
    if (isDraft) return "bg-[#F5F5F5] border-l-[#9CA3AF] hover:bg-[#E5E5E5]";
    if (isUnderReview)
      return "bg-[#F0FFF5] border-l-[#4ADE80] hover:bg-[#E0FFE5]";
    if (isCompleted)
      return "bg-[#F0EDFF] border-l-[#9E71C9] hover:bg-[#E5DDFF]";
    if (isUrgent) return "bg-[#FFF9FC] border-l-[#EC4899] hover:bg-[#FFF0F7]";
    return "bg-[#F5F8FF] border-l-[#60A5FA] hover:bg-[#EBF2FF]";
  };

  return (
    <div
      className={`space-y-2 p-2 rounded border-l-5 cursor-pointer transition-colors ${getBackgroundColor()}`}
      onClick={() => {
        onClick(milestone);
      }}
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {milestone.deadline && (
          <>
            {isUrgent && (
              <span className="text-[#EC4899] font-medium">
                {daysLeft === 0
                  ? "Today"
                  : daysLeft === 1
                  ? "D-day"
                  : `${daysLeft} days left`}
              </span>
            )}
            <span>{formatUTCDateLocal(milestone.deadline)}</span>
          </>
        )}
      </div>
      <div>
        <p className="text-sm font-medium">{milestone.title}</p>
      </div>
    </div>
  );
};

const RecruitmentMessage: React.FC<{}> = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const { networks: networksWithTokens } = useNetworks();

  const { data } = useApplicationsByProgramV2Query({
    variables: {
      query: {
        programId: id || "",
      },
    },
    skip: !id,
  });

  const applications = data?.applicationsByProgramV2?.data || [];

  const isSponsor = useMemo(
    () => applications[0]?.program?.sponsor?.id === userId,
    [applications, userId]
  );
  const hasMessageIdRoom = useMemo(
    () => applications.filter((application) => application.chatroomMessageId),
    [applications]
  );

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] =
    useState<MilestoneV2 | null>(null);
  const [isNewMilestoneMode, setIsNewMilestoneMode] = useState(true);
  const [latestMessages, setLatestMessages] = useState<
    Record<
      string,
      { text: string; timestamp: Timestamp; senderId: string; isFile: boolean }
    >
  >({});
  const [files, setFiles] = useState<ChatMessageFile[]>([]);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  useEffect(() => {
    if (hasMessageIdRoom.length > 0 && hasMessageIdRoom[0].chatroomMessageId) {
      const firstChatroomId = hasMessageIdRoom[0].chatroomMessageId;
      const isSelectedValid =
        selectedMessageId &&
        hasMessageIdRoom.find(
          (app) => app.chatroomMessageId === selectedMessageId
        );
      if (!isSelectedValid) {
        setSelectedMessageId(firstChatroomId);
      }
    }
  }, [isSponsor, hasMessageIdRoom, selectedMessageId]);

  const selectedApplication = hasMessageIdRoom.find(
    (applicant) => applicant.chatroomMessageId === selectedMessageId
  );

  const { data: programData } = useGetProgramV2Query({
    variables: { id: selectedApplication?.program?.id || "" },
    skip: !selectedApplication?.program?.id,
  });

  const { data: milestonesData, refetch: refetchMilestones } =
    useGetMilestonesV2Query({
      variables: {
        query: {
          applicantId: selectedApplication?.applicant?.id,
          programId: selectedApplication?.program?.id,
        },
      },
      skip:
        !selectedApplication?.applicant?.id ||
        !selectedApplication?.program?.id,
    });

  const { data: contractsData } = useContractsByApplicationV2Query({
    variables: {
      applicationId: Number(selectedApplication?.id) || 0,
      pagination: { limit: 1000, offset: 0 },
    },
    skip: !selectedApplication?.id,
  });

  const contracts =
    contractsData?.contractsByApplicationV2?.data
      ?.filter((contract) => contract.onchainContractId)
      .sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        return 0;
      }) || [];

  const program = programData?.programV2;
  const allMilestones = milestonesData?.milestonesV2?.data || [];

  const filteredMilestones = isSponsor
    ? allMilestones
    : allMilestones.filter(
        (m) =>
          m.status === MilestoneStatusV2.InProgress ||
          m.status === MilestoneStatusV2.Completed
      );

  const sortedMilestones = [...filteredMilestones].sort((a, b) => {
    const aIsDraft = (a as any).status === MilestoneStatusV2.Draft;
    const bIsDraft = (b as any).status === MilestoneStatusV2.Draft;

    if (aIsDraft && !bIsDraft) return 1;
    if (!aIsDraft && bIsDraft) return -1;

    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;

    const aDate = fromUTCString(a.deadline);
    const bDate = fromUTCString(b.deadline);
    if (!aDate || !bDate) return 0;
    return aDate.getTime() - bDate.getTime();
  });

  const activeMilestones = sortedMilestones.filter(
    (m) => !(m as any).isCompleted
  );

  const contractInformation: ContractInformation = {
    title: selectedApplication?.program?.title || "",
    applicationId: selectedApplication?.id || "",
    programId: selectedApplication?.program?.id || "",
    sponsor: selectedApplication?.program?.sponsor || null,
    applicant: selectedApplication?.applicant || null,
    networkId: selectedApplication?.program?.networkId || null,
    chatRoomId: selectedApplication?.chatroomMessageId || null,
    applicationStatus: selectedApplication?.status || null,
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0]?.toUpperCase() || "??";
  };

  const completedMilestones = sortedMilestones.filter(
    (m) => (m as any).isCompleted
  );

  const [createMilestone, { loading: creatingMilestone }] =
    useCreateMilestoneV2Mutation();

  const form = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneFormSchema),
    defaultValues: {
      title: "",
      price: "",
      deadline: undefined,
      description: "",
    },
  });

  const onSubmitMilestone = async (data: MilestoneFormData) => {
    if (
      !selectedApplication?.applicant?.id ||
      !selectedApplication?.program?.id
    ) {
      toast.error("Missing applicant or program information");
      return;
    }

    try {
      await createMilestone({
        variables: {
          input: {
            applicantId: selectedApplication.applicant.id,
            programId: selectedApplication.program.id,
            title: data.title,
            description: data.description,
            payout: data.price,
            deadline: toUTCString(data.deadline),
            status: MilestoneStatusV2.UnderReview,
          },
        },
      });

      toast.success("Milestone created successfully");
      await refetchMilestones();
      setIsMilestoneModalOpen(false);
      setIsNewMilestoneMode(true);
      form.reset();
    } catch (error) {
      console.error("Failed to create milestone:", error);
      toast.error("Failed to create milestone");
    }
  };

  const handleMilestoneClick = (milestone: MilestoneV2) => {
    setSelectedMilestone(milestone);
    setIsNewMilestoneMode(false);
    setIsMilestoneModalOpen(true);
  };

  const handleNewMilestoneClick = () => {
    setSelectedMilestone(null);
    setIsNewMilestoneMode(true);
    setIsMilestoneModalOpen(true);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchLatestMessages = async () => {
        const messagePromises = hasMessageIdRoom.map(async (application) => {
          if (!application.chatroomMessageId) return null;
          const { message, timestamp, senderId, isFile } =
            await getLatestMessage(application.chatroomMessageId);
          if (message && timestamp && senderId) {
            return {
              chatroomMessageId: application.chatroomMessageId,
              text: message.text,
              timestamp,
              senderId,
              isFile,
            };
          }
          return null;
        });

        const results = await Promise.all(messagePromises);
        const messagesMap: Record<
          string,
          {
            text: string;
            timestamp: Timestamp;
            senderId: string;
            isFile: boolean;
          }
        > = {};

        results.forEach((result) => {
          if (result && result.chatroomMessageId) {
            messagesMap[result.chatroomMessageId] = {
              text: result.text,
              timestamp: result.timestamp,
              senderId: result.senderId,
              isFile: result.isFile,
            };
          }
        });

        setLatestMessages(messagesMap);
      };

      if (hasMessageIdRoom.length > 0) {
        fetchLatestMessages();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [hasMessageIdRoom]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchFiles = async () => {
        if (selectedApplication?.chatroomMessageId) {
          const allFiles = await getAllFiles(
            selectedApplication.chatroomMessageId
          );
          setFiles(allFiles);
        } else {
          setFiles([]);
        }
      };

      fetchFiles();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedApplication?.chatroomMessageId]);

  const currentNetwork = networksWithTokens.find(
    (network) => Number(network.id) === contractInformation.networkId
  );

  const isHandleMakeNewMilestone = useMemo(() => {
    if (
      contractInformation.applicationStatus ===
      ApplicationStatusV2.PendingSignature
    ) {
      return false;
    }

    if (filteredMilestones.length === 0) {
      return true;
    }

    const allDeadlinesPassed = filteredMilestones.every((milestone) => {
      if (!milestone.deadline) return false;
      const deadline = fromUTCString(milestone.deadline);
      if (!deadline) return false;
      return deadline.getTime() <= new Date().getTime();
    });

    return !allDeadlinesPassed;
  }, [contractInformation, filteredMilestones]);

  const isUnderReviewMilestone = useMemo(() => {
    const isUnderReviewMilestones =
      filteredMilestones.filter(
        (m) => m.status === MilestoneStatusV2.UnderReview
      ).length > 0;

    return (
      isUnderReviewMilestones &&
      contractInformation.applicationStatus !==
        ApplicationStatusV2.PendingSignature
    );
  }, [filteredMilestones, isHandleMakeNewMilestone]);

  return (
    <div className="flex gap-4 h-[calc(100vh-200px)]">
      {isSponsor && (
        <Card className="gap-3 w-[25%] overflow-y-auto py-5">
          <CardHeader className="px-5">
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="px-5 space-y-2">
            {hasMessageIdRoom.map((applicant) => {
              const latestMessage = applicant.chatroomMessageId
                ? latestMessages[applicant.chatroomMessageId]
                : null;
              return (
                <MessageListItem
                  key={applicant.chatroomMessageId}
                  message={applicant}
                  isSelected={selectedMessageId === applicant.chatroomMessageId}
                  onClick={() =>
                    setSelectedMessageId(applicant.chatroomMessageId || null)
                  }
                  latestMessageText={
                    latestMessage?.isFile
                      ? "File uploaded"
                      : latestMessage?.text ?? null
                  }
                  latestMessageTimestamp={latestMessage?.timestamp || null}
                  latestMessageSenderId={latestMessage?.senderId || null}
                  currentUserId={userId || null}
                />
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card className="flex flex-row gap-2 w-full p-0">
        <div className="pt-5 pb-1 pr-0 pl-2 w-full flex flex-col">
          {selectedApplication ? (
            <>
              <div className="flex items-center justify-between border-b pb-4 px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        userId === selectedApplication.applicant?.id
                          ? program?.sponsor?.profileImage || ""
                          : selectedApplication.applicant?.profileImage || ""
                      }
                      alt={
                        userId === selectedApplication.applicant?.id
                          ? `${program?.sponsor?.firstName || ""} ${
                              program?.sponsor?.lastName || ""
                            }`.trim() ||
                            program?.sponsor?.email ||
                            "Unknown"
                          : `${
                              selectedApplication.applicant?.firstName || ""
                            } ${
                              selectedApplication.applicant?.lastName || ""
                            }`.trim() ||
                            selectedApplication.applicant?.email ||
                            "Unknown"
                      }
                    />
                    <AvatarFallback className="text-sm font-semibold">
                      {userId === selectedApplication.applicant?.id
                        ? getInitials(
                            `${program?.sponsor?.firstName || ""} ${
                              program?.sponsor?.lastName || ""
                            }`.trim() ||
                              program?.sponsor?.email ||
                              ""
                          )
                        : getInitials(
                            `${
                              selectedApplication.applicant?.firstName || ""
                            } ${
                              selectedApplication.applicant?.lastName || ""
                            }`.trim() ||
                              selectedApplication.applicant?.email ||
                              ""
                          )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-lg">
                      {userId === selectedApplication.applicant?.id
                        ? `${program?.sponsor?.firstName || ""} ${
                            program?.sponsor?.lastName || ""
                          }`.trim() ||
                          program?.sponsor?.email ||
                          "Unknown"
                        : `${selectedApplication.applicant?.firstName || ""} ${
                            selectedApplication.applicant?.lastName || ""
                          }`.trim() ||
                          selectedApplication.applicant?.email ||
                          "Unknown"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {userId === selectedApplication.applicant?.id
                        ? program?.sponsor?.organizationName
                        : selectedApplication.applicant?.organizationName}
                    </p>
                  </div>
                </div>
                {program?.sponsor?.id === userId && (
                  <HireButton
                    contractInformation={contractInformation}
                    disabled={!isUnderReviewMilestone}
                  />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatBox selectedMessage={selectedApplication} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a message to view conversation
            </div>
          )}
        </div>

        <div className="px-0 w-[40%]">
          {selectedApplication ? (
            <div className="h-full p-4 bg-[#FBF5FF] overflow-y-auto rounded-r-xl space-y-3">
              <Accordion
                type="multiple"
                defaultValue={["milestone"]}
                className="bg-white rounded-lg"
              >
                <AccordionItem value="milestone" className="px-3 border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-base">Milestone</span>
                      {isSponsor && isHandleMakeNewMilestone && (
                        <Plus
                          className="cursor-pointer w-4 h-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNewMilestoneClick();
                          }}
                        />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-3">
                    {activeMilestones.map((milestone) => (
                      <MilestoneCard
                        key={milestone.id}
                        milestone={milestone}
                        onClick={handleMilestoneClick}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="completed" className="px-3 border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-medium text-base">Completed</span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-3">
                    {completedMilestones.map((milestone) => (
                      <MilestoneCard
                        key={milestone.id}
                        milestone={milestone}
                        onClick={handleMilestoneClick}
                        isCompleted={true}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type="multiple" className="bg-white rounded-lg">
                <AccordionItem value="file" className="px-3 border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-medium text-base">File</span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-3">
                    {files.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No files yet
                      </div>
                    ) : (
                      files.map((file, index) => {
                        const isImage = file.type.startsWith("image/");
                        const formatFileSize = (bytes: number) => {
                          if (bytes < 1024) return bytes + " B";
                          if (bytes < 1024 * 1024)
                            return (bytes / 1024).toFixed(1) + " KB";
                          return (bytes / (1024 * 1024)).toFixed(1) + " MB";
                        };

                        return (
                          <a
                            key={index}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:bg-slate-50 transition-colors"
                          >
                            {isImage ? (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <ImageIcon className="w-5 h-5 text-gray-600" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <Folder className="w-5 h-5 text-gray-600" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="w-[200px] text-sm font-semibold text-gray-800 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </a>
                        );
                      })
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="contract" className="px-3 border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-medium text-base">Contract</span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-3">
                    {contracts.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No contracts yet
                      </div>
                    ) : (
                      contracts.map((contract, idx) => (
                        <button
                          key={contract.id}
                          onClick={() => {
                            setSelectedContract(contract);
                            setIsContractModalOpen(true);
                          }}
                          className="cursor-pointer flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors text-left w-full"
                        >
                          <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">
                              Contract #{idx + 1}
                              {contracts.length === idx + 1 && (
                                <span className="text-xs text-green-500 ml-2">
                                  (Latest)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-400">
                              {contract.createdAt
                                ? formatUTCDateLocal(contract.createdAt)
                                : "No date"}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="h-full p-4 bg-gray-50 rounded-lg border flex items-center justify-center text-sm text-muted-foreground text-center">
              Applicant details will appear here
            </div>
          )}
        </div>
      </Card>
      <Dialog
        open={isMilestoneModalOpen}
        onOpenChange={(open) => {
          setIsMilestoneModalOpen(open);
          if (!open) {
            setSelectedMilestone(null);
            setIsNewMilestoneMode(true);
            form.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-hidden flex flex-col p-0">
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 min-h-[500px] p-6 overflow-y-auto border-r bg-white">
              {isNewMilestoneMode ? (
                <Form {...form}>
                  <form
                    id="milestone-form"
                    onSubmit={form.handleSubmit(onSubmitMilestone)}
                    className="h-full flex flex-col"
                  >
                    <div className="space-y-4 flex-1">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Title <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Price
                                <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter price"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="deadline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Deadline{" "}
                                <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <DatePicker
                                  date={field.value}
                                  setDate={(date) => {
                                    if (
                                      date &&
                                      typeof date === "object" &&
                                      "getTime" in date
                                    ) {
                                      const newDate = new Date(date.getTime());
                                      newDate.setHours(23, 59, 59, 999);
                                      field.onChange(newDate);
                                    } else {
                                      field.onChange(date);
                                    }
                                  }}
                                  disabled={{ before: new Date() }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Description{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <MarkdownEditor
                                onChange={field.onChange}
                                content={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <p className="mb-10 text-2xl font-semibold">
                    {selectedMilestone?.title}
                  </p>
                  <div className="mx-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-sm text-gray-text rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          Price
                          <div className="ml-2 text-gray-dark">
                            {selectedMilestone?.payout}{" "}
                            {currentNetwork?.tokens?.[0]?.tokenName}
                          </div>
                        </div>
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-sm text-gray-text rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          Deadline
                          <div className="ml-2 text-gray-dark">
                            {selectedMilestone?.deadline &&
                              formatUTCDateLocal(selectedMilestone.deadline)}
                            {selectedMilestone?.deadline && (
                              <Badge className="ml-2">
                                {dDay(selectedMilestone.deadline)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Badge>
                    </div>
                    <div className="mt-5">
                      <p className="text-base font-bold text-gray-dark mb-1">
                        DESCRIPTION
                      </p>
                      <MarkdownPreviewer
                        key={selectedMilestone?.id || "empty"}
                        value={selectedMilestone?.description || ""}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-[400px] p-4 bg-[#F7F7F7] overflow-y-auto">
              <Accordion
                type="multiple"
                defaultValue={["milestone"]}
                className="bg-white rounded-lg"
              >
                <AccordionItem value="milestone" className="px-3 border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="flex items-center gap-2 font-medium text-base">
                      Milestone
                      {isSponsor && isHandleMakeNewMilestone && (
                        <Plus
                          className="cursor-pointer w-4 h-4"
                          onClick={() => {
                            setSelectedMilestone(null);
                            setIsNewMilestoneMode(true);
                            form.reset();
                          }}
                        />
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-3">
                    {activeMilestones.map((milestone) => (
                      <MilestoneCard
                        key={milestone.id}
                        milestone={milestone}
                        onClick={handleMilestoneClick}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="completed" className="px-3 border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-medium text-base">Completed</span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-3">
                    {completedMilestones.map((milestone) => (
                      <MilestoneCard
                        key={milestone.id}
                        milestone={milestone}
                        onClick={handleMilestoneClick}
                        isCompleted={true}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            {isNewMilestoneMode ? (
              <Button
                type="submit"
                form="milestone-form"
                variant="default"
                className="ml-auto"
                disabled={creatingMilestone}
              >
                {creatingMilestone ? "Creating..." : "Submit"}
              </Button>
            ) : (
              <div className="flex items-center justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsMilestoneModalOpen(false);
                    setSelectedMilestone(null);
                    setIsNewMilestoneMode(true);
                    form.reset();
                  }}
                >
                  Close
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {selectedContract && (
        <ContractModal
          open={isContractModalOpen}
          onOpenChange={setIsContractModalOpen}
          contractInformation={contractInformation}
          assistantId={undefined}
          readOnly={true}
          contractSnapshot={selectedContract}
        />
      )}
    </div>
  );
};

export default RecruitmentMessage;
