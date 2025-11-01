import { useGetProgramV2Query } from "@/apollo/queries/program-v2.generated";
import CurrencySelector from "@/components/currency-selector";
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
import { Input } from "@/components/ui/input";
import { useNetworks } from "@/contexts/networks-context";
import ApplicationChat from "@/pages/programs/details/application-chat";
import { useState } from "react";
import MessageListItem from "./message-list-item";
import type { ApplicationV2, MilestoneV2 } from "@/types/types.generated";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

interface MilestoneFormData {
  title: string;
  payout: string;
  deadline: Date | null;
  description: string;
  currency: string;
}

const MilestoneCard = ({
  milestone,
  onClick,
}: {
  milestone: MilestoneV2;
  onClick: (milestone: MilestoneV2) => void;
}) => {
  return (
    <div
      className="space-y-2 bg-[#FFF9FC] p-2 rounded border-l-5 border-l-[#EC4899] cursor-pointer hover:bg-[#FFF0F7] transition-colors"
      onClick={() => {
        onClick(milestone);
      }}
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {milestone.deadline && (
          <span>{new Date(milestone.deadline).toLocaleDateString()}</span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium">{milestone.title}</p>
      </div>
    </div>
  );
};

const RecruitmentMessage: React.FC<{ applications: ApplicationV2[] }> = ({
  applications,
}) => {
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
  const { networks } = useNetworks();
  const allTokens = networks.flatMap((n) => n.tokens);

  // Milestone form
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

  const onSubmitMilestone = (data: MilestoneFormData) => {
    console.log("Milestone data:", data);
    // TODO: API 호출로 milestone 생성
    setIsMilestoneModalOpen(false);
    setIsNewMilestoneMode(true);
    reset();
  };

  // Mock milestone data (나중에 API에서 가져올 예정)
  const milestones: MilestoneV2[] = [
    {
      id: "1",
      title: "Complete UI/UX design and wireframes",
      description: "Complete UI/UX design and wireframes for the application",
      payout: "1000",
      deadline: new Date("2025-11-03").toISOString(),
    },
    {
      id: "2",
      title: "Implement frontend and backend features",
      description: "Implement all required frontend and backend features",
      payout: "2000",
      deadline: new Date("2025-11-15").toISOString(),
    },
  ];

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

  return (
    <div className="flex gap-4 h-[calc(100vh-200px)]">
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

      <Card className="flex flex-row gap-2 w-full p-0">
        <div className="py-5 pr-0 pl-2 w-full">
          {selectedMessage ? (
            <div className="h-full overflow-hidden">
              <ApplicationChat
                selectedMessage={selectedMessage}
                program={program}
              />
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
                      <Plus
                        className="cursor-pointer w-4 h-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNewMilestoneClick();
                        }}
                      />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-3">
                    {milestones.map((milestone) => (
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
                    <div className="space-y-2 bg-[#F0EDFF] p-2 rounded border-l-10 border-l-[#9E71C9]">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Nov 15, 2025</span>
                      </div>
                      <div>
                        <p className="text-sm">
                          Complete UI/UX design and wireframes
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type="multiple" className="bg-white rounded-lg">
                <AccordionItem value="file" className="px-3 border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-medium text-base">File</span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-3">
                    <div className="space-y-3">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">
                          Resume
                        </p>
                        <p className="font-medium text-sm">resume.pdf</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">
                          Portfolio
                        </p>
                        <p className="font-medium text-sm">
                          portfolio_link.url
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="contract" className="px-3 border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-medium text-base">Contract</span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-3">
                    <div className="space-y-3">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">
                          Contract Document
                        </p>
                        <p className="font-medium text-sm">
                          contract_signed.pdf
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">
                          Status
                        </p>
                        <p className="font-medium text-sm text-green-600">
                          Signed
                        </p>
                      </div>
                    </div>
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

      {/* Milestone Modal */}
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
            {/* 왼쪽: 입력 폼 또는 선택된 milestone 상세 */}
            <div className="flex-1 p-6 overflow-y-auto border-r bg-white">
              {isNewMilestoneMode ? (
                <form
                  id="milestone-form"
                  onSubmit={handleSubmit(onSubmitMilestone)}
                  className="h-full flex flex-col"
                >
                  {/* Milestone 제목 */}
                  <h2 className="text-2xl font-bold mb-6">
                    Milestone #{milestones.length + 1}
                  </h2>

                  <div className="space-y-4 flex-1">
                    {/* Title - 최상단 혼자 */}
                    <InputLabel
                      labelId="title"
                      title="Title"
                      isPrimary
                      register={register}
                      placeholder="Title"
                      isError={errors.title}
                    />

                    {/* Milestone Payout과 Deadline - 같은 줄에 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="payout" className="block space-y-3">
                          <p className="text-sm font-medium">
                            Milestone Payout{" "}
                            <span className="text-primary">*</span>
                          </p>
                          <div className="flex gap-2">
                            <Input
                              id="payout"
                              type="number"
                              placeholder="Price"
                              className="flex-1 h-10"
                              {...register("payout", { required: true })}
                            />
                            <CurrencySelector
                              className="h-10"
                              value={watch("currency") || null}
                              onValueChange={(value) =>
                                setValue("currency", value)
                              }
                              tokens={allTokens}
                            />
                          </div>
                          {errors.payout && (
                            <span className="text-destructive text-sm block">
                              Milestone Payout is required
                            </span>
                          )}
                        </label>
                      </div>
                      <div>
                        <label htmlFor="deadline" className="block space-y-3">
                          <p className="text-sm font-medium">
                            Deadline <span className="text-primary">*</span>
                          </p>
                          <DatePicker
                            date={watch("deadline") || undefined}
                            setDate={(date) => setValue("deadline", date)}
                          />
                          {errors.deadline && (
                            <span className="text-destructive text-sm block">
                              Deadline is required
                            </span>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Description - 그 아래 */}
                    <div>
                      <label htmlFor="description" className="block space-y-3">
                        <p className="text-sm font-medium">
                          Description <span className="text-primary">*</span>
                        </p>
                        <MarkdownEditor
                          content={descriptionValue || ""}
                          onChange={(value) => setValue("description", value)}
                        />
                        {errors.description && (
                          <span className="text-destructive text-sm block">
                            Description is required
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Milestone 제목 */}
                  <h2 className="text-2xl font-bold mb-6">
                    Milestone #
                    {selectedMilestone
                      ? milestones.findIndex(
                          (m) => m.id === selectedMilestone.id
                        ) + 1
                      : 1}
                  </h2>

                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Milestone Details</h3>
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
                      New Milestone
                    </Button>
                  </div>
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
                    {milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className={`space-y-2 p-2 rounded border-l-5 border-l-[#EC4899] cursor-pointer hover:bg-[#FFF0F7] transition-colors ${
                          selectedMilestone?.id === milestone.id
                            ? "bg-[#FFF0F7] border-l-[#EC4899]"
                            : "bg-[#FFF9FC]"
                        }`}
                        onClick={() => {
                          handleMilestoneClick(milestone);
                        }}
                      >
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {milestone.deadline && (
                            <span>
                              {new Date(
                                milestone.deadline
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {milestone.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="completed" className="px-3 border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-medium text-base">Completed</span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-3">
                    {/* Completed milestones will be shown here */}
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
              >
                Submit
              </Button>
            ) : (
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
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecruitmentMessage;
