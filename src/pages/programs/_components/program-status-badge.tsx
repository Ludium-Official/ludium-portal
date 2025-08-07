import { cn, formatProgramStatus } from '@/lib/utils';
import { type Maybe, type Program, ProgramStatus } from '@/types/types.generated';

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
    // case ProgramStatus.Closed:
    //   statusColor = <span className="bg-red-400 w-[14px] h-[14px] rounded-full block" />;
    //   break;
    case ProgramStatus.Completed:
      statusColor = <span className="bg-purple-500 w-[14px] h-[14px] rounded-full block" />;
      break;
    case ProgramStatus.Draft:
      statusColor = <span className="bg-gray-400 w-[14px] h-[14px] rounded-full block" />;
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

export default ProgramStatusBadge;
