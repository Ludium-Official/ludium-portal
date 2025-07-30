import { useAcceptApplicationMutation } from '@/apollo/mutation/accept-application.generated';
// import { useRejectApplicationMutation } from '@/apollo/mutation/reject-application.generated';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { getUserName } from '@/lib/utils';
import RejectApplicationForm from '@/pages/programs/details/_components/reject-application-form';
import type { Application } from '@/types/types.generated';
import BigNumber from 'bignumber.js';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

function ProjectCard({
  application,
  refetch,
  hideSeeDetails,
  hideControls,
}: {
  application?: Application | null;
  refetch?: () => void;
  hideSeeDetails?: boolean | null;
  hideControls?: boolean | null;
}) {
  const [approveApplication] = useAcceptApplicationMutation();
  // const [denyApplication] = useRejectApplicationMutation();

  return (
    <div className="border rounded-xl p-6">
      <header className="flex justify-between mb-4">
        <Badge>{application?.status}</Badge>
        {!hideSeeDetails && (
          <Link to={`./project/${application?.id}`} className="flex items-center gap-2 text-sm">
            See details <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </header>
      <div className="flex gap-4 items-center mb-2">
        <div className="w-10 h-10 bg-slate-400 rounded-full" />
        <Link
          className="text-lg font-bold hover:underline"
          to={`/users/${application?.applicant?.id}`}
        >
          {application?.applicant?.organizationName ?? getUserName(application?.applicant)}
        </Link>
      </div>
      <div className="mb-6">
        <span className="text-xs text-muted-foreground">
          {application?.milestones
            ?.reduce((prev, curr) => prev.plus(BigNumber(curr?.price ?? 0)), BigNumber(0, 10))
            .toFixed()}{' '}
          {application?.milestones?.[0]?.currency}
        </span>
      </div>
      <div className="flex justify-between">
        <div>
          <h4 className="text-sm font-bold mb-1">Application</h4>
          <p className="truncate max-w-[600px] text-sm">{application?.name}</p>
        </div>
        {!hideControls && (
          <div className="gap-3 flex">
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={(e) => e.stopPropagation()} className="h-10" variant="outline">
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-[600px] p-6 max-h-screen overflow-y-auto">
                <RejectApplicationForm
                  applicationId={application?.id}
                  refetch={() => {
                    refetch?.();
                  }}
                />
              </DialogContent>
            </Dialog>
            {/* <Button
              className="h-10"
              variant="outline"
              onClick={() => {
                denyApplication({
                  variables: {
                    id: application?.id ?? '',
                  },
                  onCompleted: () => {
                    refetch?.();
                  },
                });
              }}
            >
              Deny
            </Button> */}
            <Button
              className="h-10"
              onClick={() => {
                approveApplication({
                  variables: {
                    id: application?.id ?? '',
                  },
                  onCompleted: () => {
                    refetch?.();
                  },
                });
              }}
            >
              Select
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
