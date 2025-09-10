import { useReclaimMilestoneMutation } from '@/apollo/mutation/reclaim-milestone.generated';
import { useReclaimProgramMutation } from '@/apollo/mutation/reclaim-program.generated';
import { useProfileQuery } from '@/apollo/queries/profile.generated';
import { type ProgramsQuery, useProgramsQuery } from '@/apollo/queries/programs.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import notify from '@/lib/notify';
import { getCurrencyIcon } from '@/lib/utils';
import { ProgramType } from '@/types/types.generated';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { AgentBreadcrumbs } from './agent-breadcrumbs';

const programPageSize = 6;

// Recruitment reclaim functionality:
// 1. Unused programs past deadline (sponsor can reclaim)
// 2. Unpaid milestones past deadline (builder can reclaim)
export default function UserRecruitmentReclaimTab({ myProfile }: { myProfile?: boolean }) {
  const { id } = useParams();
  const [searchParams, _setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data: profileData } = useProfileQuery({
    fetchPolicy: 'network-only',
    skip: !myProfile,
  });

  const profileId = myProfile ? (profileData?.profile?.id ?? '') : (id ?? '');

  // For reclaim, we need to fetch ALL programs where user is involved
  // We'll fetch programs created by the user (sponsor) and determine builder role from applications
  const { data: programData, refetch: refetchSponsorPrograms } = useProgramsQuery({
    variables: {
      pagination: {
        limit: 50, // Increase limit to get more programs
        offset: (currentPage - 1) * programPageSize,

        filter: [
          {
            value: profileId,
            field: 'creatorId', // Get programs created by this user
          },
          {
            field: 'type',
            value: ProgramType.Regular,
          },
          ...(searchQuery
            ? [
                {
                  field: 'name',
                  value: searchQuery,
                },
              ]
            : []),
        ],
      },
    },
    skip: !profileId,
  });

  // Also fetch programs where user is a builder (has applications)
  const { data: builderProgramData, refetch: refetchBuilderPrograms } = useProgramsQuery({
    variables: {
      pagination: {
        limit: 50,
        offset: 0,
        filter: [
          {
            value: profileId,
            field: 'builderId', // Get programs where user has applied
          },
        ],
      },
    },
    skip: !profileId,
  });

  // Calculate reclaimable items based on business rules
  const reclaimableItems = useMemo(() => {
    type Program = NonNullable<NonNullable<ProgramsQuery['programs']>['data']>[number];
    type Application = NonNullable<Program['applications']>[number];
    type Milestone = NonNullable<Application['milestones']>[number];

    type ReclaimableItem = {
      type: 'unused_program' | 'unpaid_milestone';
      program?: Program;
      application?: Application;
      milestone?: Milestone;
      reason: string;
      amount: string;
      currency: string;
    };

    const items: ReclaimableItem[] = [];
    const now = new Date();

    // Process sponsor programs (programs created by user)
    if (programData?.programs?.data) {
      for (const program of programData.programs.data) {
        // Check if program is past deadline
        const programDeadline = program?.deadline ? new Date(program.deadline) : null;
        const isPastDeadline = programDeadline && programDeadline < now;

        // Case 1: Unused program past deadline (sponsor can reclaim)
        const isCreator = program?.creator?.id === profileId;

        // Check for accepted applications (not just any applications)
        const hasAcceptedApplications = program?.applications?.some(
          (app) => app?.status === 'accepted',
        );

        if (isCreator && isPastDeadline && !hasAcceptedApplications && !program?.reclaimed) {
          items.push({
            type: 'unused_program',
            program,
            reason: 'Program expired without accepted applications',
            amount: program?.price || '0',
            currency: program?.currency || 'ETH',
          });
        }
      }
    }

    // Process builder programs (programs where user has applications)
    if (builderProgramData?.programs?.data) {
      for (const program of builderProgramData.programs.data) {
        // Case 2: Check milestones for unpaid status
        if (program?.applications) {
          for (const application of program.applications) {
            // Only check applications from this user
            if (application?.applicant?.id === profileId && application?.milestones) {
              for (const milestone of application.milestones) {
                // Check if milestone has passed deadline and is unpaid

                // Check if milestone can be reclaimed (unpaid and past deadline)
                if (milestone?.canReclaim && !milestone?.reclaimed) {
                  items.push({
                    type: 'unpaid_milestone',
                    program,
                    application,
                    milestone,
                    reason: 'Milestone past deadline without payment',
                    amount: milestone?.price || '0',
                    currency: milestone?.currency || program?.currency || 'ETH',
                  });
                }
              }
            }
          }
        }
      }
    }

    return items;
  }, [programData, builderProgramData, profileId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Reclaim mutations
  const [reclaimProgram] = useReclaimProgramMutation();
  const [reclaimMilestone] = useReclaimMilestoneMutation();
  const [reclaimingId, setReclaimingId] = useState<string | null>(null);

  const handleReclaimProgram = async (programId: string) => {
    if (!programId) {
      console.error('Program ID is empty or undefined!');
      notify('Invalid program ID', 'error');
      return;
    }

    setReclaimingId(programId);
    try {
      // Create variables object with only programId
      const variables = {
        programId: programId,
      };

      const result = await reclaimProgram({
        variables,
      });

      if (result.data?.reclaimProgram) {
        notify('Program funds reclaimed successfully!', 'success');
        // Refetch programs to update the list
        await refetchSponsorPrograms();
        await refetchBuilderPrograms();
      }
    } catch (error) {
      console.error('Reclaim error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      notify(
        `Failed to reclaim: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'error',
      );
    } finally {
      setReclaimingId(null);
    }
  };

  const handleReclaimMilestone = async (milestoneId: string) => {
    setReclaimingId(milestoneId);
    try {
      // Create variables object with only milestoneId
      const variables = {
        milestoneId: milestoneId,
      };

      const result = await reclaimMilestone({
        variables,
      });

      if (result.data?.reclaimMilestone) {
        notify('Milestone funds reclaimed successfully!', 'success');
        // Refetch programs to update the list
        await refetchSponsorPrograms();
        await refetchBuilderPrograms();
      }
    } catch (error) {
      console.error('Milestone reclaim error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      notify(
        `Failed to reclaim: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'error',
      );
    } finally {
      setReclaimingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div className="flex h-12 items-center justify-between pl-4">
          <AgentBreadcrumbs myProfile={myProfile} />
          <div className="relative w-[360px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus:border-gray-300"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {reclaimableItems.length === 0 ? (
            <div className="p-8 border rounded-lg w-full text-center">
              <p className="text-muted-foreground mb-2">No reclaimable items found</p>
              <p className="text-sm text-muted-foreground">
                Reclaim is available for expired programs without applications and unpaid milestones
                past deadline.
              </p>
            </div>
          ) : (
            // Display reclaimable items
            reclaimableItems.map((item) => (
              <div
                key={`${item.type}-${item.type === 'unused_program' ? item.program?.id : item.milestone?.id}`}
                className="p-5 border rounded-lg w-full"
              >
                <div className="bg-[#18181B0A] rounded-full px-[10px] inline-flex items-center gap-2 mb-4">
                  <span className="w-[14px] h-[14px] rounded-full bg-orange-500 block" />
                  <p className="text-secondary-foreground text-sm font-semibold">
                    {item.type === 'unused_program' ? 'Unused Program' : 'Unpaid Milestone'}
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">
                      {item.type === 'unused_program'
                        ? item.program?.name
                        : `${item.milestone?.title} - ${item.application?.name}`}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 py-1.5 bg-[#18181B0A] rounded-lg mb-2">
                  <p className="text-sm font-medium text-neutral-400">ALLOCATED</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground font-bold">{item.amount}</p>
                    {getCurrencyIcon(item.currency)}
                    <p className="text-sm text-muted-foreground font-medium">{item.currency}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 py-2.5 bg-[#18181B0A] rounded-lg mb-4">
                  <p className="text-sm font-bold text-foreground">RECLAIM</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl text-primary font-bold">{item.amount}</p>
                    {getCurrencyIcon(item.currency)}
                    <p className="text-sm text-muted-foreground font-medium">{item.currency}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Button
                    size="sm"
                    className="px-6"
                    disabled={
                      reclaimingId ===
                      (item.type === 'unused_program' ? item.program?.id : item.milestone?.id)
                    }
                    onClick={() => {
                      if (item.type === 'unused_program' && item.program?.id) {
                        handleReclaimProgram(item.program.id);
                      } else if (item.type === 'unpaid_milestone' && item.milestone?.id) {
                        handleReclaimMilestone(item.milestone.id);
                      } else {
                        console.error('Invalid item for reclaim:', item);
                      }
                    }}
                  >
                    {reclaimingId ===
                    (item.type === 'unused_program' ? item.program?.id : item.milestone?.id)
                      ? 'Processing...'
                      : 'Reclaim now'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* <Pagination totalCount={programData?.programs?.count ?? 0} pageSize={programPageSize} /> */}
    </div>
  );
}
