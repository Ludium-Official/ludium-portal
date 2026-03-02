import { usePickApplicationV2Mutation } from '@/apollo/mutation/pick-application-v2.generated';
import { useApplicationsByProgramV2Query } from '@/apollo/queries/applications-by-program-v2.generated';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import notify from '@/lib/notify';
import { cn } from '@/lib/utils';
import type { RecruitmentApplicant } from '@/types/recruitment';
import type { ApplicationV2 } from '@/types/types.generated';
import { Loader2 } from 'lucide-react';
import { useParams } from 'react-router';
import ApplicantCard from './applicant-card/applicant-card';

const RecruitmentApplicants: React.FC = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  const [pickApplication] = usePickApplicationV2Mutation();
  const { data, refetch, loading, error } = useApplicationsByProgramV2Query({
    variables: {
      query: { programId: id || '' },
    },
    skip: !id,
  });

  const applications = data?.applicationsByProgramV2?.data || [];

  const handleTogglePick = async (applicationId?: string | null, currentPicked?: boolean) => {
    if (!applicationId) return;

    try {
      await pickApplication({
        variables: {
          id: applicationId,
          input: {
            picked: !currentPicked,
          },
        },
      });

      refetch();
      notify(
        !currentPicked ? 'Applicant picked successfully!' : 'Applicant unpicked successfully!',
        'success',
      );
    } catch (error) {
      console.error('Error toggling pick:', error);
      notify('Failed to update pick status. Please try again.', 'error');
    }
  };

  const transformToApplicant = (application: ApplicationV2): RecruitmentApplicant => {
    return {
      id: application.id || '',
      appliedDate: application.createdAt,
      picked: application.picked || false,
      programId: application.program?.id,
      applicationId: application.id,
      chatroomMessageId: application.chatroomMessageId,
      userInfo: {
        userId: application.applicant?.id,
        image: application.applicant?.profileImage,
        nickname: application.applicant?.nickname,
        email: application.applicant?.email,
        cv: application.content,
        portfolios: application.portfolios,
        location: application.applicant?.location,
        skills: application.applicant?.skills,
        role: application.applicant?.userRole,
        // TODO: profile 변경되고 추가될 데이터
        hourlyRate: null, // Not in GraphQL schema
        star: null, // Not in GraphQL schema
        tools: null, // Not in GraphQL schema
      },
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg text-red-500">Error loading applicants. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {applications.length > 0 ? (
          applications.map((application) => (
            <ApplicantCard
              key={application.id}
              applicant={transformToApplicant(application)}
              onTogglePick={handleTogglePick}
            />
          ))
        ) : (
          <div className={cn('text-center py-12 text-muted-foreground', isMobile && 'text-sm')}>
            No applicants yet
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruitmentApplicants;
