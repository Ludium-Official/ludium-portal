import { ApplicationStatusBadge } from '@/components/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { getCurrencyIcon, getUserName } from '@/lib/utils';
import type { Application, Program } from '@/types/types.generated';
import BigNumber from 'bignumber.js';
import { Link } from 'react-router';

function ProjectCard({
  application,
  program,
}: {
  application?: Application | null;
  program?: Program | null;
}) {
  const totalPrice = application?.milestones
    ?.reduce((prev, curr) => prev.plus(BigNumber(curr?.price ?? 0)), BigNumber(0, 10))
    .toFixed();

  const network = program?.network || 'Arbitrum';

  return (
    <Link to={`./project/${application?.id}`} className="border rounded-lg p-5 bg-white">
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-3">
        <ApplicationStatusBadge application={application} />
        {/* <span
          className={cn(
            'flex items-center text-secondary-foreground gap-2 bg-gray-light px-2.5 py-0.5 rounded-full font-semibold text-sm',
          )}
        >
          {application?.status === ApplicationStatus.Accepted ? (
            <span className="bg-cyan-400 w-[14px] h-[14px] rounded-full block" />
          ) : application?.status === ApplicationStatus.Rejected ? (
            <span className="bg-red-200 w-[14px] h-[14px] rounded-full block" />
          ) : (
            <span className="bg-gray-400 w-[14px] h-[14px] rounded-full block" />
          )}
          {application?.status
            ? application.status.charAt(0).toUpperCase() + application.status.slice(1)
            : 'Not confirmed'}
        </span> */}
        {/* {!hideSeeDetails && (
          <Link to={`./application/${application?.id}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800">
            See details <ArrowRight className="w-4 h-4" />
          </Link>
        )} */}
      </div>

      {/* Builder Info and Price */}
      <div className="flex flex-col gap-3 mb-4">
        {/* Builder Info */}
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={application?.applicant?.image || ''}
              alt={getUserName(application?.applicant)}
            />
            <AvatarFallback className="text-xs font-medium text-slate-600">
              {getUserName(application?.applicant)?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* <Link
            className="text-sm font-bold text-slate-900 hover:underline"
            to={`/users/${application?.applicant?.id}`}
          > */}
          <div className="text-sm font-bold text-slate-900 hover:underline">
            {getUserName(application?.applicant) ?? application?.applicant?.organizationName}
          </div>
          {/* </Link> */}
        </div>

        {/* Price Tag */}
        <div className="bg-[#0000000A] rounded-md px-2 py-1">
          <div className="flex items-center gap-3 justify-between">
            <span className="text-xs text-neutral-400 font-semibold">PRIZE</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-muted-foreground">{totalPrice}</span>
                {getCurrencyIcon(program?.currency)}
                <span className="text-sm font-medium text-muted-foreground">
                  {program?.currency}
                </span>
              </div>
              <div className="w-px h-5 bg-slate-200" />
              <span className="text-sm font-medium text-muted-foreground">{network}</span>
            </div>
          </div>

          <div className="flex items-center gap-[20px] justify-between w-full">
            <h4 className="text-neutral-400 text-sm font-bold">STATUS</h4>

            <Progress
              value={application?.fundingProgress ?? 0}
              rootClassName="w-full"
              indicatorClassName="bg-primary"
            />

            <p className="text-xl text-primary font-bold flex items-center">
              {application?.fundingProgress ?? 0}
              <span className="text-sm text-muted-foreground">%</span>
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="">
        <p className="text-sm text-slate-900 leading-relaxed line-clamp-2">
          {application?.name || 'No description available'}
        </p>
      </div>
    </Link>
  );
}

export default ProjectCard;
