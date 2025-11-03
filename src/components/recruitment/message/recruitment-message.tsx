import { useCreateMilestoneV2Mutation } from '@/apollo/mutation/create-milestone-v2.generated';
import { useGetMilestonesV2Query } from '@/apollo/queries/milestones-v2.generated';
import { useGetProgramV2Query } from '@/apollo/queries/program-v2.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatBox } from '@/components/chat/chat-box';
import { HireButton } from '@/components/recruitment/hire-button';
import MarkdownEditor from '@/components/markdown/markdown-editor';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/hooks/use-auth';
import type { ApplicationV2, MilestoneV2 } from '@/types/types.generated';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import MessageListItem from './message-list-item';

const milestoneFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.string().min(1, 'Price is required'),
  deadline: z.date({
    required_error: 'Deadline is required',
  }),
  description: z.string().min(1, 'Description is required'),
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
    const deadline = new Date(milestone.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft();
  const isDraft = (milestone as any).status === 'draft';
  const isUrgent = !isCompleted && !isDraft && daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;

  const getBackgroundColor = () => {
    if (isDraft) return 'bg-[#F5F5F5] border-l-[#9CA3AF] hover:bg-[#E5E5E5]';
    if (isCompleted) return 'bg-[#F0EDFF] border-l-[#9E71C9] hover:bg-[#E5DDFF]';
    if (isUrgent) return 'bg-[#FFF9FC] border-l-[#EC4899] hover:bg-[#FFF0F7]';
    return 'bg-[#F5F8FF] border-l-[#60A5FA] hover:bg-[#EBF2FF]';
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
                {daysLeft === 0 ? 'Today' : daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
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

  const isSponser = applications[0]?.program?.sponsor?.id === userId;

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    !isSponser && applications.length > 0 ? applications[0].id || null : null,
  );
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneV2 | null>(null);
  const [isNewMilestoneMode, setIsNewMilestoneMode] = useState(true);

  const selectedMessage = applications.find((applicant) => applicant.id === selectedMessageId);

  const { data: programData } = useGetProgramV2Query({
    variables: { id: selectedMessage?.program?.id || '' },
    skip: !selectedMessage?.program?.id,
  });

  const program = programData?.programV2;

  const { data: milestonesData, refetch: refetchMilestones } = useGetMilestonesV2Query({
    variables: {
      query: {
        applicantId: selectedMessage?.applicant?.id,
        programId: selectedMessage?.program?.id,
      },
    },
    skip: !selectedMessage?.applicant?.id || !selectedMessage?.program?.id,
  });

  const allMilestones = milestonesData?.milestonesV2?.data || [];

  const sortedMilestones = [...allMilestones].sort((a, b) => {
    const aIsDraft = (a as any).status === 'draft';
    const bIsDraft = (b as any).status === 'draft';

    if (aIsDraft && !bIsDraft) return 1;
    if (!aIsDraft && bIsDraft) return -1;

    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;

    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const activeMilestones = sortedMilestones.filter((m) => !(m as any).isCompleted);

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0]?.toUpperCase() || '??';
  };

  const completedMilestones = sortedMilestones.filter((m) => (m as any).isCompleted);

  const [createMilestone, { loading: creatingMilestone }] = useCreateMilestoneV2Mutation();

  const form = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneFormSchema),
    defaultValues: {
      title: '',
      price: '',
      deadline: undefined,
      description: '',
    },
  });

  const onSubmitMilestone = async (data: MilestoneFormData) => {
    if (!selectedMessage?.applicant?.id || !selectedMessage?.program?.id) {
      toast.error('Missing applicant or program information');
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

      toast.success('Milestone created successfully');
      await refetchMilestones();
      setIsMilestoneModalOpen(false);
      setIsNewMilestoneMode(true);
      form.reset();
    } catch (error) {
      console.error('Failed to create milestone:', error);
      toast.error('Failed to create milestone');
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
        <div className="py-5 pr-0 pl-2 w-full flex flex-col">
          {selectedMessage ? (
            <>
              <div className="flex items-center justify-between border-b pb-4 px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        userId === selectedMessage.applicant?.id
                          ? program?.sponsor?.profileImage || ''
                          : selectedMessage.applicant?.profileImage || ''
                      }
                      alt={
                        userId === selectedMessage.applicant?.id
                          ? `${program?.sponsor?.firstName || ''} ${
                              program?.sponsor?.lastName || ''
                            }`.trim() ||
                            program?.sponsor?.email ||
                            'Unknown'
                          : `${selectedMessage.applicant?.firstName || ''} ${
                              selectedMessage.applicant?.lastName || ''
                            }`.trim() ||
                            selectedMessage.applicant?.email ||
                            'Unknown'
                      }
                    />
                    <AvatarFallback className="text-sm font-semibold">
                      {userId === selectedMessage.applicant?.id
                        ? getInitials(
                            `${program?.sponsor?.firstName || ''} ${
                              program?.sponsor?.lastName || ''
                            }`.trim() ||
                              program?.sponsor?.email ||
                              '',
                          )
                        : getInitials(
                            `${selectedMessage.applicant?.firstName || ''} ${
                              selectedMessage.applicant?.lastName || ''
                            }`.trim() ||
                              selectedMessage.applicant?.email ||
                              '',
                          )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-lg">
                      {userId === selectedMessage.applicant?.id
                        ? `${program?.sponsor?.firstName || ''} ${
                            program?.sponsor?.lastName || ''
                          }`.trim() ||
                          program?.sponsor?.email ||
                          'Unknown'
                        : `${selectedMessage.applicant?.firstName || ''} ${
                            selectedMessage.applicant?.lastName || ''
                          }`.trim() ||
                          selectedMessage.applicant?.email ||
                          'Unknown'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {userId === selectedMessage.applicant?.id
                        ? program?.sponsor?.organizationName
                        : selectedMessage.applicant?.organizationName}
                    </p>
                  </div>
                </div>
                {program?.sponsor?.id === userId && (
                  <HireButton
                    applicationId={selectedMessage.id}
                    programId={selectedMessage.programId}
                  />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatBox selectedMessage={selectedMessage} />
              </div>
            </>
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
                defaultValue={['milestone']}
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
            form.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-hidden flex flex-col p-0">
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto border-r bg-white">
              {isNewMilestoneMode ? (
                <Form {...form}>
                  <form
                    id="milestone-form"
                    onSubmit={form.handleSubmit(onSubmitMilestone)}
                    className="h-full flex flex-col"
                  >
                    <h2 className="text-2xl font-bold mb-6">
                      Milestone #{allMilestones.length + 1}
                    </h2>

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
                                Milestone Payout <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="Enter price" {...field} />
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
                                Deadline <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <DatePicker
                                  date={field.value}
                                  setDate={(date) => {
                                    if (date && typeof date === 'object' && 'getTime' in date) {
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
                              Description <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <MarkdownEditor
                                onChange={field.onChange}
                                content={field.value || ''}
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
                  <h2 className="text-2xl font-bold mb-6">
                    Milestone #
                    {selectedMilestone
                      ? allMilestones.findIndex((m) => m.id === selectedMilestone.id) + 1
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
                    <p className="text-sm text-muted-foreground mb-1">Deadline</p>
                    <p className="font-medium">
                      {selectedMilestone?.deadline
                        ? new Date(selectedMilestone.deadline).toLocaleDateString()
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="font-medium">{selectedMilestone?.description}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="w-[400px] p-4 bg-[#F7F7F7] overflow-y-auto">
              <Accordion
                type="multiple"
                defaultValue={['milestone']}
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
                {creatingMilestone ? 'Creating...' : 'Submit'}
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
                      form.reset();
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
    </div>
  );
};

export default RecruitmentMessage;
