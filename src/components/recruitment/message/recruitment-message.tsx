import { useGetProgramV2Query } from "@/apollo/queries/program-v2.generated";
import { useGetMilestonesV2Query } from "@/apollo/queries/milestones-v2.generated";
import { useCreateMilestoneV2Mutation } from "@/apollo/mutation/create-milestone-v2.generated";
import InputLabel from "@/components/common/label/inputLabel";
import MarkdownEditor from "@/components/markdown/markdown-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { useEffect, useState } from "react";
import MessageListItem from "./message-list-item";
import type { ApplicationV2, MilestoneV2 } from "@/types/types.generated";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/hooks/use-auth";
import toast from "react-hot-toast";
import { ChatBox } from "@/components/chat/chat-box";

interface MilestoneFormData {
  title: string;
  price: string;
  deadline: Date | null;
  description: string;
}

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
    const deadline = new Date(milestone.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft();
  const isDraft = (milestone as any).status === "draft";
  const isUrgent =
    !isCompleted &&
    !isDraft &&
    daysLeft !== null &&
    daysLeft <= 3 &&
    daysLeft >= 0;

  const getBackgroundColor = () => {
    if (isDraft) return "bg-[#F5F5F5] border-l-[#9CA3AF] hover:bg-[#E5E5E5]";
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
                  ? "1 day left"
                  : `${daysLeft} days left`}
              </span>
            )}
            <span>{new Date(milestone.deadline).toLocaleDateString()}</span>
          </>
        )}
      </div>
      <div>
        <p className="text-sm font-medium">{milestone.title}</p>
      </div>
    </div>
  );
};

const RecruitmentMessage: React.FC<{
  applications: ApplicationV2[];
}> = ({ applications }) => {
  const { userId } = useAuth();

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] =
    useState<MilestoneV2 | null>(null);
  const [isNewMilestoneMode, setIsNewMilestoneMode] = useState(true);

  const selectedMessage = applications.find(
    (applicant) => applicant.id === selectedMessageId
  );

  const { data: programData } = useGetProgramV2Query({
    variables: { id: selectedMessage?.program?.id || "" },
    skip: !selectedMessage?.program?.id,
  });

  const program = programData?.programV2;

  const { data: milestonesData, refetch: refetchMilestones } =
    useGetMilestonesV2Query({
      variables: {
        query: {
          applicantId: selectedMessage?.applicant?.id,
          programId: selectedMessage?.program?.id,
        },
      },
      skip: !selectedMessage?.applicant?.id || !selectedMessage?.program?.id,
    });

  const allMilestones = milestonesData?.milestonesV2?.data || [];
  const isSponser = program?.sponsor?.id === userId;

  const sortedMilestones = [...allMilestones].sort((a, b) => {
    const aIsDraft = (a as any).status === "draft";
    const bIsDraft = (b as any).status === "draft";

    if (aIsDraft && !bIsDraft) return 1;
    if (!aIsDraft && bIsDraft) return -1;

    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;

    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const activeMilestones = sortedMilestones.filter(
    (m) => !(m as any).isCompleted
  );
  const completedMilestones = sortedMilestones.filter(
    (m) => (m as any).isCompleted
  );

  const [createMilestone, { loading: creatingMilestone }] =
    useCreateMilestoneV2Mutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MilestoneFormData>({
    defaultValues: {
      description: "",
    },
  });

  const descriptionValue = watch("description");

  const onSubmitMilestone = async (data: MilestoneFormData) => {
    if (!selectedMessage?.applicant?.id || !selectedMessage?.program?.id) {
      toast.error("Missing applicant or program information");
      return;
    }

    if (!data.deadline) {
      toast.error("Deadline is required");
      return;
    }

    try {
      await createMilestone({
        variables: {
          input: {
            applicantId: selectedMessage.applicant.id,
            programId: selectedMessage.program.id,
            title: data.title,
            description: data.description,
            payout: data.price,
            deadline: data.deadline.toISOString(),
          },
        },
      });

      toast.success("Milestone created successfully");
      await refetchMilestones();
      setIsMilestoneModalOpen(false);
      setIsNewMilestoneMode(true);
      reset();
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
    if (!isSponser && applications) {
      setSelectedMessageId(applications[0].id || null);
    }
  }, [isSponser, applications]);

  return (
    <div className="flex gap-4 h-[calc(100vh-200px)]">
      {isSponser && (
        <Card className="gap-3 w-[25%] overflow-y-auto py-5">
          <CardHeader className="px-5">
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="px-5 space-y-2">
            {applications.map((applicant) => (
              <MessageListItem
                key={applicant.id}
                message={applicant}
                isSelected={selectedMessageId === applicant.id}
                onClick={() => setSelectedMessageId(applicant.id || null)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="flex flex-row gap-2 w-full p-0">
        <div className="py-5 pr-0 pl-2 w-full">
          {selectedMessage ? (
            <div className="h-full overflow-hidden">
              <ChatBox selectedMessage={selectedMessage} program={program} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a message to view conversation
            </div>
          )}
        </div>

        <div className="px-0 w-[40%]">
          {selectedMessage ? (
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
                      {isSponser && (
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
                    {/* TODO: Add file list */}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="contract" className="px-3 border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-medium text-base">Contract</span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-3">
                    {/* TODO: Add contract list */}
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
            reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-hidden flex flex-col p-0">
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto border-r bg-white">
              {isNewMilestoneMode ? (
                <form
                  id="milestone-form"
                  onSubmit={handleSubmit(onSubmitMilestone)}
                  className="h-full flex flex-col"
                >
                  <h2 className="text-2xl font-bold mb-6">
                    Milestone #{allMilestones.length + 1}
                  </h2>

                  <div className="space-y-4 flex-1">
                    <InputLabel
                      labelId="title"
                      title="Title"
                      isPrimary
                      register={register}
                      placeholder="Title"
                      isError={errors.title}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <InputLabel
                          labelId="price"
                          type="number"
                          title="Price"
                          className="w-full !space-y-1"
                          titleClassName="text-muted-foreground"
                          register={register}
                          placeholder="Enter price"
                        />
                      </div>
                      <InputLabel
                        labelId="deadline"
                        title="Deadline"
                        inputClassName="hidden"
                        isPrimary
                        isError={errors.deadline}
                      >
                        <DatePicker
                          date={watch("deadline") || undefined}
                          setDate={(date) => {
                            if (
                              date &&
                              typeof date === "object" &&
                              "getTime" in date
                            ) {
                              const newDate = new Date(date.getTime());
                              newDate.setHours(23, 59, 59, 999);
                              setValue("deadline", newDate);
                            } else {
                              setValue("deadline", date);
                            }
                          }}
                          disabled={{ before: new Date() }}
                        />
                      </InputLabel>
                    </div>

                    <div>
                      <InputLabel
                        labelId="description"
                        title="Description"
                        isPrimary
                        isError={errors.description}
                        inputClassName="hidden"
                      >
                        <MarkdownEditor
                          onChange={(value: string) => {
                            setValue("description", value);
                          }}
                          content={descriptionValue || ""}
                        />
                      </InputLabel>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-6">
                    Milestone #
                    {selectedMilestone
                      ? allMilestones.findIndex(
                          (m) => m.id === selectedMilestone.id
                        ) + 1
                      : 1}
                  </h2>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Title</p>
                    <p className="font-medium">{selectedMilestone?.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Payout</p>
                    <p className="font-medium">{selectedMilestone?.payout}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Deadline
                    </p>
                    <p className="font-medium">
                      {selectedMilestone?.deadline
                        ? new Date(
                            selectedMilestone.deadline
                          ).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Description
                    </p>
                    <p className="font-medium">
                      {selectedMilestone?.description}
                    </p>
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
                    <span className="font-medium text-base">Milestone</span>
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
                {isSponser && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMilestone(null);
                      setIsNewMilestoneMode(true);
                      reset();
                    }}
                  >
                    Make New Milestone
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsMilestoneModalOpen(false);
                    setSelectedMilestone(null);
                    setIsNewMilestoneMode(true);
                    reset();
                  }}
                >
                  Close
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecruitmentMessage;
