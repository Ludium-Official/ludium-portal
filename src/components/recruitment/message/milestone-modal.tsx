import { useCreateMilestoneV2Mutation } from '@/apollo/mutation/create-milestone-v2.generated';
import { useUpdateMilestoneV2Mutation } from '@/apollo/mutation/update-milestone-v2.generated';
import { useUpdateApplicationV2Mutation } from '@/apollo/mutation/update-application-v2.generated';
import { useUpdateProgramV2Mutation } from '@/apollo/mutation/update-program-v2.generated';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { dDay, formatUTCDateLocal, fromUTCString, toUTCString } from '@/lib/utils';
import { useNetworks } from '@/contexts/networks-context';
import { ethers } from 'ethers';
import {
  ApplicationStatusV2,
  MilestoneStatusV2,
  ProgramStatusV2,
  type MilestoneV2,
} from '@/types/types.generated';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import MarkdownEditor from '@/components/markdown/markdown-editor';
import { MarkdownPreviewer } from '@/components/markdown';
import { MilestoneAccordion } from './milestone-accordion';
import type { MilestoneModalProps } from '@/types/recruitment';
import { sendMessage } from '@/lib/firebase-chat';

const milestoneFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.string().min(1, 'Price is required'),
  deadline: z.date({
    required_error: 'Deadline is required',
  }),
  description: z.string().min(1, 'Description is required'),
});

type MilestoneFormData = z.infer<typeof milestoneFormSchema>;

export function MilestoneModal({
  open,
  onOpenChange,
  selectedMilestone,
  setSelectedMilestone,
  isNewMilestoneMode,
  setIsNewMilestoneMode,
  activeMilestones,
  completedMilestones,
  onRefetch,
  isSponsor,
  isHandleMakeNewMilestone,
  contractInformation,
  existingContract,
  onchainProgramId,
  allApplicationsData,
  allMilestonesData,
  contract,
  tokenDecimals = 18,
}: MilestoneModalProps) {
  const { getTokenById } = useNetworks();

  const applicationId = contractInformation.applicationInfo.id;
  const sponsorId = contractInformation.programInfo.sponsor?.id;
  const programId = contractInformation.programInfo.id;
  const programPrice = contractInformation.programInfo.price;
  const token = getTokenById(Number(contractInformation.programInfo.tokenId));
  const tokenName = token?.tokenName;
  const [createMilestone, { loading: creatingMilestone }] = useCreateMilestoneV2Mutation();
  const [updateMilestone, { loading: updatingMilestone }] = useUpdateMilestoneV2Mutation();
  const [updateApplication] = useUpdateApplicationV2Mutation();
  const [updateProgram] = useUpdateProgramV2Mutation();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<MilestoneFormData | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const form = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneFormSchema),
    defaultValues: {
      title: '',
      price: '',
      deadline: undefined,
      description: '',
    },
  });

  const handleFormSubmit = (data: MilestoneFormData) => {
    setPendingFormData(data);
    setIsAlertOpen(true);
  };

  const onSubmitMilestone = async () => {
    if (!pendingFormData) return;

    if (!sponsorId || !programId) {
      toast.error('Missing applicant or program information');
      return;
    }

    try {
      if (!selectedMilestone) {
        await createMilestone({
          variables: {
            input: {
              applicationId,
              sponsorId,
              programId,
              title: pendingFormData.title,
              description: pendingFormData.description,
              payout: pendingFormData.price,
              deadline: toUTCString(pendingFormData.deadline),
              status: MilestoneStatusV2.UnderReview,
            },
          },
        });
        toast.success('Milestone created successfully');
      } else {
        if (!selectedMilestone?.id) {
          toast.error('No milestone selected for update');
          return;
        }

        await updateMilestone({
          variables: {
            id: selectedMilestone.id,
            input: {
              title: pendingFormData.title,
              description: pendingFormData.description,
              payout: pendingFormData.price,
              deadline: toUTCString(pendingFormData.deadline),
              status: MilestoneStatusV2.Update,
            },
          },
        });
        toast.success('Milestone updated successfully');
      }

      await onRefetch();
      onOpenChange(false);
      setIsNewMilestoneMode(true);
      setSelectedMilestone(null);
      setIsAlertOpen(false);
      setPendingFormData(null);
      form.reset();
    } catch (error) {
      console.error(`Failed to ${selectedMilestone ? 'update' : 'create'} milestone:`, error);
      toast.error(`Failed to ${selectedMilestone ? 'update' : 'create'} milestone`);
      setIsAlertOpen(false);
    }
  };

  const handleMilestoneClick = (milestone: MilestoneV2) => {
    setSelectedMilestone(milestone);
    setIsNewMilestoneMode(false);
  };

  const handleNewMilestoneClick = () => {
    setSelectedMilestone(null);
    setIsNewMilestoneMode(true);
  };

  const handleEditClick = () => {
    if (selectedMilestone) {
      form.setValue('title', selectedMilestone.title || '');
      form.setValue('price', selectedMilestone.payout || '');
      form.setValue('description', selectedMilestone.description || '');
      if (selectedMilestone.deadline) {
        const deadlineDate = fromUTCString(selectedMilestone.deadline);
        if (deadlineDate) {
          form.setValue('deadline', deadlineDate);
        }
      }
      setIsNewMilestoneMode(true);
    }
  };

  const handleCompleteClick = async () => {
    if (!selectedMilestone?.id || !selectedMilestone?.payout) {
      toast.error('Milestone information is missing');
      return;
    }

    if (!existingContract?.onchainContractId) {
      toast.error('Contract not found. Please create a contract first.');
      return;
    }

    if (!contract) {
      toast.error('Contract instance not available');
      return;
    }

    setIsCompleting(true);

    try {
      const payoutAmount = ethers.utils.parseUnits(selectedMilestone.payout, tokenDecimals);
      const payoutBigInt = BigInt(payoutAmount._hex);

      await contract.completeMilestone(existingContract.onchainContractId, payoutBigInt);

      await updateMilestone({
        variables: {
          id: selectedMilestone.id,
          input: {
            status: MilestoneStatusV2.Completed,
          },
        },
      });

      await sendMessage(
        contractInformation.applicationInfo.chatRoomId || '',
        'The reward has been successfully distributed.',
        '0',
      );
      toast.success('Milestone completed successfully');

      const updatedActiveMilestones = activeMilestones.filter((m) => m.id !== selectedMilestone.id);
      const updatedCompletedMilestones = [
        ...completedMilestones,
        { ...selectedMilestone, status: MilestoneStatusV2.Completed },
      ];
      const allMilestones = [...updatedActiveMilestones, ...updatedCompletedMilestones];
      const allMilestonesCompleted = allMilestones.every(
        (m: MilestoneV2) => m.status === MilestoneStatusV2.Completed,
      );

      if (allMilestonesCompleted) {
        await updateApplication({
          variables: {
            id: applicationId,
            input: {
              status: ApplicationStatusV2.Completed,
            },
          },
        });

        await sendMessage(
          contractInformation.applicationInfo.chatRoomId || '',
          'All milestones have been completed. The application will now be closed.',
          '0',
        );

        const allApplications = allApplicationsData?.applicationsByProgramV2?.data || [];
        const allApplicationsCompleted = allApplications.every(
          (app: { status?: ApplicationStatusV2 | null }) =>
            app.status === ApplicationStatusV2.Completed,
        );

        if (allApplicationsCompleted) {
          const programDeadline = contractInformation.programInfo.deadline;
          if (programDeadline) {
            const deadlineDate = fromUTCString(programDeadline);
            const now = new Date();

            if (deadlineDate && deadlineDate.getTime() > now.getTime()) {
              return;
            }
          }

          if (onchainProgramId) {
            await updateProgram({
              variables: {
                id: programId,
                input: {
                  status: ProgramStatusV2.Closed,
                },
              },
            });

            await contract.completeProgram(onchainProgramId);

            toast.success(
              'All applications completed. Program status updated to Closed and completed on-chain.',
            );
          } else {
            await updateProgram({
              variables: {
                id: programId,
                input: {
                  status: ProgramStatusV2.Closed,
                },
              },
            });

            toast.success('All applications completed. Program status updated to Closed.');
          }
        }
      }

      await onRefetch();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to complete milestone:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to complete milestone');
    } finally {
      setIsCompleting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setSelectedMilestone(null);
      setIsNewMilestoneMode(true);
      form.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {isNewMilestoneMode
              ? selectedMilestone
                ? 'Edit Milestone'
                : 'Create New Milestone'
              : 'View Milestone'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 min-h-[500px] p-6 overflow-y-auto border-r bg-white">
            {isNewMilestoneMode ? (
              <Form {...form}>
                <form
                  id="milestone-form"
                  onSubmit={form.handleSubmit(handleFormSubmit)}
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
                              <div className="flex items-center justify-between w-full">
                                <div>
                                  Budget&nbsp;
                                  <span className="text-destructive">*</span>
                                </div>

                                {programPrice && (
                                  <div className="text-gray-text text-xs">
                                    Offered Budget: {programPrice} {tokenName}
                                  </div>
                                )}
                              </div>
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
                            <MarkdownEditor onChange={field.onChange} content={field.value || ''} />
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
                <p className="mb-10 text-2xl font-semibold">{selectedMilestone?.title}</p>
                <div className="mx-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm text-gray-text rounded-md">
                      <div className="flex items-center gap-2">
                        Budget
                        <div className="ml-2 text-gray-dark">
                          {selectedMilestone?.payout} {tokenName}
                        </div>
                      </div>
                    </Badge>
                    <Badge variant="secondary" className="text-sm text-gray-text rounded-md">
                      <div className="flex items-center gap-2">
                        Deadline
                        <div className="ml-2 text-gray-dark">
                          {selectedMilestone?.deadline &&
                            formatUTCDateLocal(selectedMilestone.deadline)}
                          {selectedMilestone?.deadline && (
                            <Badge className="ml-2">{dDay(selectedMilestone.deadline)}</Badge>
                          )}
                        </div>
                      </div>
                    </Badge>
                  </div>
                  <div className="mt-5">
                    <p className="text-base font-bold text-gray-dark mb-1">DESCRIPTION</p>
                    <MarkdownPreviewer
                      key={selectedMilestone?.id || 'empty'}
                      value={selectedMilestone?.description || ''}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-[400px] p-4 bg-[#F7F7F7] overflow-y-auto">
            <MilestoneAccordion
              activeMilestones={activeMilestones}
              completedMilestones={completedMilestones}
              onMilestoneClick={handleMilestoneClick}
              onNewMilestoneClick={handleNewMilestoneClick}
              isSponsor={isSponsor}
              isHandleMakeNewMilestone={isHandleMakeNewMilestone}
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          {isNewMilestoneMode ? (
            <Button
              type="submit"
              form="milestone-form"
              variant="default"
              className="ml-auto"
              disabled={creatingMilestone || updatingMilestone}
            >
              {selectedMilestone
                ? updatingMilestone
                  ? 'Updating...'
                  : 'Update'
                : creatingMilestone
                  ? 'Creating...'
                  : 'Submit'}
            </Button>
          ) : (
            isSponsor &&
            isHandleMakeNewMilestone && (
              <div className="flex items-center justify-end gap-2">
                {selectedMilestone && selectedMilestone.status === MilestoneStatusV2.InProgress && (
                  <Button
                    type="button"
                    variant="purple"
                    onClick={handleCompleteClick}
                    disabled={isCompleting}
                  >
                    {isCompleting ? 'Completing...' : 'Complete'}
                  </Button>
                )}
                <Button type="button" variant="default" onClick={handleEditClick}>
                  Edit
                </Button>
              </div>
            )
          )}
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedMilestone ? 'Update Milestone' : 'Create Milestone'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedMilestone
                ? 'Once you update this milestone, the changes cannot be undone. Are you sure you want to proceed?'
                : 'Once you create this milestone, it cannot be deleted. Are you sure you want to proceed?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingFormData(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onSubmitMilestone}
              disabled={creatingMilestone || updatingMilestone}
            >
              {selectedMilestone
                ? updatingMilestone
                  ? 'Updating...'
                  : 'Update'
                : creatingMilestone
                  ? 'Creating...'
                  : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
