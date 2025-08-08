import {
  cn,
  formatApplicationStatus,
  formatMilestoneStatus,
  formatProgramStatus,
} from '@/lib/utils';
import {
  type Application,
  ApplicationStatus,
  type Maybe,
  type Milestone,
  MilestoneStatus,
  type Program,
  ProgramStatus,
} from '@/types/types.generated';


function ProgramStatusBadge({
  program,
  className,
}: { program?: Maybe<Program>; className?: string }) {
  if (!program) return null;

  let statusColor = <span className={'bg-gray-400 w-[14px] h-[14px] rounded-full block'} />;

  switch (program.status) {
    case ProgramStatus.Cancelled:
    case ProgramStatus.Closed:
    case ProgramStatus.Rejected:
      statusColor = <span className="bg-red-200 w-[14px] h-[14px] rounded-full block" />;
      break;
    case ProgramStatus.Completed:
      statusColor = <span className="bg-purple-500 w-[14px] h-[14px] rounded-full block" />;
      break;
    case ProgramStatus.PaymentRequired:
      statusColor = <span className="bg-blue-400 w-[14px] h-[14px] rounded-full block" />;
      break;
    case ProgramStatus.Published:
      statusColor = <span className="bg-cyan-400 w-[14px] h-[14px] rounded-full block" />;
      break;
  }

  return (
    <span
      className={cn(
        'flex items-center text-secondary-foreground gap-2 bg-gray-light px-2.5 py-0.5 rounded-full font-semibold text-sm',
        className,
      )}
    >
      {statusColor}
      {formatProgramStatus(program)}
    </span>
  );
}

function ApplicationStatusBadge({
  application,
  className,
}: { application?: Maybe<Application>; className?: string }) {
  if (!application) return null;

  let statusColor = <span className={'bg-gray-400 w-[14px] h-[14px] rounded-full block'} />;

  switch (application.status) {
    case ApplicationStatus.Accepted:
      statusColor = <span className="bg-teal-400 w-[14px] h-[14px] rounded-full block" />;
      break;
    case ApplicationStatus.Completed:
      statusColor = <span className="bg-teal-400 w-[14px] h-[14px] rounded-full block" />;
      break;
    case ApplicationStatus.Pending:
      statusColor = <span className="bg-gray-400 w-[14px] h-[14px] rounded-full block" />;
      break;
    case ApplicationStatus.Rejected:
      statusColor = <span className="bg-red-200 w-[14px] h-[14px] rounded-full block" />;
      break;
    case ApplicationStatus.Submitted:
      statusColor = <span className="bg-purple-500 w-[14px] h-[14px] rounded-full block" />;
      break;
  }

  return (
    <span
      className={cn(
        'flex items-center gap-2 bg-gray-light px-2.5 py-0.5 rounded-full font-semibold text-sm',
        className,
      )}
    >
      {statusColor}
      {formatApplicationStatus(application)}
    </span>
  );
}

function MilestoneStatusBadge({
  milestone,
  className,
}: { milestone?: Maybe<Milestone>; className?: string }) {
  if (!milestone) return null;

  let statusColor = <span className={'bg-gray-400 w-[14px] h-[14px] rounded-full block'} />;

  switch (milestone.status) {
    case MilestoneStatus.Completed:
      statusColor = <span className="bg-teal-400 w-[14px] h-[14px] rounded-full block" />;
      break;
    case MilestoneStatus.Pending:
      statusColor = <span className="bg-gray-400 w-[14px] h-[14px] rounded-full block" />;
      break;
    case MilestoneStatus.Rejected:
      statusColor = <span className="bg-red-200 w-[14px] h-[14px] rounded-full block" />;
      break;
    case MilestoneStatus.Draft:
      statusColor = <span className="bg-gray-400 w-[14px] h-[14px] rounded-full block" />;
      break;
    case MilestoneStatus.Submitted:
      statusColor = <span className="bg-purple-500 w-[14px] h-[14px] rounded-full block" />;
      break;
  }

  return (
    <span
      className={cn(
        'flex items-center gap-2 bg-gray-light px-2.5 py-0.5 rounded-full font-semibold text-sm',
        className,
      )}
    >
      {statusColor}
      {formatMilestoneStatus(milestone)}
    </span>
  );
}

export { ProgramStatusBadge, ApplicationStatusBadge, MilestoneStatusBadge };
