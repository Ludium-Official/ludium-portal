import { useApproveApplicationMutation } from '@/apollo/mutation/approve-application.generated';
import { useDenyApplicationMutation } from '@/apollo/mutation/deny-application.generated';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Application } from '@/types/types.generated';
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
  const [approveApplication] = useApproveApplicationMutation();
  const [denyApplication] = useDenyApplicationMutation();

  return (
    <div className="border rounded-xl p-6">
      <header className="flex justify-between mb-4">
        <Badge>{application?.status}</Badge>
        {!hideSeeDetails && (
          <Link
            to={`./application/${application?.id}/details`}
            className="flex items-center gap-2 text-sm"
          >
            See details <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </header>
      <div className="flex gap-4 items-center mb-2">
        <div className="w-10 h-10 bg-slate-400 rounded-full" />
        <h3 className="text-lg font-bold">{application?.applicant?.organizationName}</h3>
      </div>
      <div className="mb-6">
        <span className="text-xs text-muted-foreground">
          {application?.milestones?.reduce((prev, curr) => prev + (Number(curr?.price) ?? 0), 0)}{' '}
          {application?.milestones?.[0]?.currency} | DEADLINE 30, MAR, 2025
        </span>
      </div>
      <div className="flex justify-between">
        <div>
          <h4 className="text-sm font-bold mb-1">Application</h4>
          <p className="truncate max-w-[600px] text-sm">{application?.content}</p>
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
