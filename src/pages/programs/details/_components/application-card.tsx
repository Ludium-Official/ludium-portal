import { useAcceptApplicationMutation } from '@/apollo/mutation/accept-application.generated';
import { useRejectApplicationMutation } from '@/apollo/mutation/reject-application.generated';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getUserName } from '@/lib/utils';
import type { Application } from '@/types/types.generated';
import BigNumber from 'bignumber.js';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

function ApplicationCard({
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
  const [denyApplication] = useRejectApplicationMutation();

  return (
    <div className="border rounded-xl p-6">
      <header className="flex justify-between mb-4">
        <Badge>{application?.status}</Badge>
        {!hideSeeDetails && (
          <Link to={`./application/${application?.id}`} className="flex items-center gap-2 text-sm">
            See details <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </header>
      <div className="flex gap-4 items-center mb-2">
        <div className="w-10 h-10 bg-slate-400 rounded-full" />
        <h3 className="text-lg font-bold">
          {application?.applicant?.organizationName ?? getUserName(application?.applicant)}
        </h3>
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
            <Button
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
            </Button>
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

export default ApplicationCard;
