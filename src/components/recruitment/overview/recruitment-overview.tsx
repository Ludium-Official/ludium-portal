import { useCreateApplicationV2Mutation } from '@/apollo/mutation/create-application-v2.generated';
import { useUpdateProgramV2Mutation } from '@/apollo/mutation/update-program-v2.generated';
import { useGetProgramV2Query } from '@/apollo/queries/program-v2.generated';
import { GetProgramsV2Document } from '@/apollo/queries/programs-v2.generated';
import { MarkdownPreviewer } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { ShareButton } from '@/components/ui/share-button';
import { useAuth } from '@/lib/hooks/use-auth';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import notify from '@/lib/notify';
import { cn, formatDate, formatPrice } from '@/lib/utils';
import { ProgramStatusV2, ProgramVisibilityV2 } from '@/types/types.generated';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';
import StatusBadge from '../statusBadge/statusBadge';
import ProgramInfoSidebar from './program-info-sidebar';

const RecruitmentOverview: React.FC<{
  className?: string;
  isFoldable?: boolean;
}> = ({ className, isFoldable = false }) => {
  const { id } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data, loading, error, refetch } = useGetProgramV2Query({
    variables: {
      id: id || '',
    },
    skip: !id,
  });

  const [createApplication, { loading: submitting }] = useCreateApplicationV2Mutation();
  const [updateProgram] = useUpdateProgramV2Mutation();

  const program = data?.programV2;
  const [status, setStatus] = useState<ProgramStatusV2>(program?.status || ProgramStatusV2.Open);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!isFoldable);

  useEffect(() => {
    if (program?.status) {
      setStatus(program.status);
    }
  }, [program?.status]);

  const isOwner = program?.sponsor?.id === userId;
  const isDraft = program?.status === ProgramStatusV2.Draft;
  const formattedCreatedAt = program?.createdAt && formatDate(program.createdAt);
  const formattedDeadline = program?.deadline && formatDate(program.deadline);
  const formattedPriceValue = program?.price && formatPrice(program.price);
  const isDeadlinePassed = program?.deadline && new Date(program.deadline).getTime() < Date.now();

  const handleSubmitApplication = async () => {
    if (!id || !coverLetter.trim()) {
      notify('Please provide a cover letter', 'error');
      return;
    }

    try {
      const result = await createApplication({
        variables: {
          input: {
            programId: id,
            content: coverLetter,
          },
        },
        refetchQueries: [
          {
            query: GetProgramsV2Document,
            variables: {
              id: id || '',
            },
          },
        ],
      });

      if (result.data?.createApplicationV2) {
        notify('Application submitted successfully!', 'success');
        navigate('/dashboard/recruitment/builder');

        return;
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      notify('Failed to submit application. Please try again.', 'error');
    }
  };

  const handleStatusChange = async (newStatus: ProgramStatusV2) => {
    if (!id) {
      toast.error('Missing program ID');
      return;
    }

    try {
      await updateProgram({
        variables: {
          id: id,
          input: {
            status:
              newStatus === ProgramStatusV2.Closed ? ProgramStatusV2.Closed : ProgramStatusV2.Open,
          },
        },
      });

      await refetch();
      toast.success(`Program ${newStatus.toLowerCase()} successfully`);
      setStatus(newStatus);
    } catch (error) {
      console.error('Failed to close program:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to close program');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-500">
          {error ? 'Error loading program' : 'Program not found'}
        </div>
      </div>
    );
  }

  if (
    program.visibility === ProgramVisibilityV2.Private &&
    !isOwner &&
    !program.invitedMembers?.includes(userId)
  ) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-lg text-gray-700 font-semibold mb-2">Private Program</div>
          <div className="text-sm text-gray-500">
            This program is private. Please log in to view the details.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-2xl p-10', isMobile && 'p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="mr-3 text-sm">
            <StatusBadge status={program.status || 'open'} />
          </div>
          <div className="text-xs text-gray-500">Posted: {formattedCreatedAt}</div>
        </div>
        {isFoldable && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 border border-gray-200 rounded-sm"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        )}
      </div>

      <h1
        className={cn(
          'flex items-center justify-between text-2xl font-bold text-gray-900',
          isExpanded ? 'mb-8' : 'mb-0',
          isMobile && 'text-base',
        )}
      >
        {program.title}
        <ShareButton
          size={isMobile ? 'sm' : 'default'}
          linkToCopy={`${window.location.origin}/programs/recruitment/${program.id}`}
        />
      </h1>

      {isExpanded && (
        <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-8', isMobile && 'gap-4')}>
          {isMobile && (
            <ProgramInfoSidebar
              program={program}
              isMobile={isMobile}
              isOwner={isOwner}
              isDraft={isDraft}
              isDeadlinePassed={!!isDeadlinePassed}
              formattedDeadline={formattedDeadline || null}
              formattedPriceValue={formattedPriceValue || null}
              status={status}
              userId={userId}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              coverLetter={coverLetter}
              setCoverLetter={setCoverLetter}
              submitting={submitting}
              handleSubmitApplication={handleSubmitApplication}
              handleStatusChange={handleStatusChange}
            />
          )}

          <div className="lg:col-span-2">
            {!isMobile && (
              <h3 className="flex items-end">
                <span className="p-2 border-b border-b-primary font-medium text-sm">Details</span>
                <span className="block border-b w-full" />
              </h3>
            )}

            <div
              className={cn(
                'mt-3',
                isFoldable && 'max-h-[672px] overflow-y-auto',
                isMobile && 'mt-0',
              )}
            >
              {program.description && <MarkdownPreviewer value={program.description} />}
            </div>
          </div>

          {!isMobile && (
            <ProgramInfoSidebar
              program={program}
              isMobile={false}
              isOwner={isOwner}
              isDraft={isDraft}
              isDeadlinePassed={!!isDeadlinePassed}
              formattedDeadline={formattedDeadline || null}
              formattedPriceValue={formattedPriceValue || null}
              status={status}
              userId={userId}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              coverLetter={coverLetter}
              setCoverLetter={setCoverLetter}
              submitting={submitting}
              handleSubmitApplication={handleSubmitApplication}
              handleStatusChange={handleStatusChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RecruitmentOverview;
