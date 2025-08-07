import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/use-auth';
import { getCurrency, getCurrencyIcon } from '@/lib/utils';
import { ApplicationStatus, type Program } from '@/types/types.generated';
import { format } from 'date-fns';
import { Settings } from 'lucide-react';
import { Link } from 'react-router';
import ProgramStatusBadge from './program-status-badge';

function ProgramCard({ program }: { program: Program }) {
  const { isSponsor } = useAuth();
  const { id, name, keywords, summary } = program ?? {};
  // const badgeVariants = ['teal', 'orange', 'pink'];

  return (
    <div className="block w-full border border-gray-border rounded-lg p-5">
      <div className="flex justify-between mb-2">
        <div className="flex gap-2 mb-1">
          {keywords?.slice(0, 3)?.map((k) => (
            <Badge key={k.id} variant="secondary">
              {k.name}
            </Badge>
          ))}

          {(program?.keywords?.length ?? 0) > 3 && (
            <Badge variant="secondary">+{(program?.keywords?.length ?? 0) - 3} more</Badge>
          )}
        </div>
        <div className="font-medium flex gap-2 items-center text-sm">
          <ProgramStatusBadge program={program} />
          {isSponsor && (
            <Link to={`/programs/${program?.id}/edit`}>
              <Settings className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      <Link to={`/programs/${id}`} className="flex items-stretch gap-4 mb-4">
        {/* <div className="w-[104px] h-[104px] bg-slate-200 rounded-md " /> */}

        {program?.image ? (
          <img
            src={program.image}
            alt={program?.name || 'Program image'}
            className="w-[104px] h-[104px] object-cover rounded-lg"
          />
        ) : (
          <div className="w-[104px] h-[104px] bg-gray-200 rounded-lg" />
        )}

        <div className="flex flex-col justify-between">
          <h2 className="text-lg font-bold text-[#18181B]">{name}</h2>
          <div className="inline-flex self-start text-sm bg-secondary py-1 px-2 items-center rounded-md">
            <span className="text-neutral-400 mr-3">PRICE</span>{' '}
            <span className="flex items-center text-muted-foreground gap-1 font-medium">
              {getCurrencyIcon(program?.currency)} {program?.price} {program?.currency}
            </span>
            <span className="block ml-2 border-l pl-2 text-muted-foreground font-medium">
              {getCurrency(program?.network)?.display}
            </span>
          </div>
          <div className="inline-flex self-start text-sm bg-secondary py-1 px-2 items-center rounded-md">
            <span className="text-neutral-400 mr-3">DEADLINE</span>
            <span className="font-medium text-muted-foreground">
              {format(new Date(program?.deadline ?? new Date()), 'dd . MMM . yyyy').toUpperCase()}
            </span>
            {program?.deadline &&
              (() => {
                const deadlineDate = new Date(program.deadline);
                const today = new Date();
                // Zero out the time for both dates to get full days difference
                deadlineDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);
                const diffTime = deadlineDate.getTime() - today.getTime();
                const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                return <Badge className="ml-2">D-{daysRemaining}</Badge>;
              })()}
          </div>
        </div>
      </Link>

      <div className="mb-6">
        <p className="text-slate-500 text-sm font-normal leading-5 line-clamp-2">{summary}</p>
      </div>

      <div className="flex justify-between">
        <Link
          to={`/programs/${id}#applications`}
          className="text-xs font-semibold bg-gray-light rounded-md px-3 py-2 leading-4"
        >
          Submitted Application{' '}
          <span className="text-primary">{program.applications?.length ?? 0}</span>
        </Link>
        <Link
          to={`/programs/${id}#applications`}
          className="text-xs font-semibold bg-gray-light rounded-md px-3 py-2 leading-4"
        >
          Approved Application{' '}
          <span className="text-green-600">
            {program.applications?.filter((a) => a.status === ApplicationStatus.Accepted || a.status === ApplicationStatus.Completed).length ??
              0}
          </span>
        </Link>
      </div>
    </div>
  );
}

export default ProgramCard;
