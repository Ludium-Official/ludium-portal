import { ProgramStatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { dDay, getCurrency, getCurrencyIcon } from '@/lib/utils';
import { ApplicationStatus, type Program } from '@/types/types.generated';
import { format } from 'date-fns';
import { Link } from 'react-router';

function ProgramCard({ program }: { program: Program }) {
  const { id, name, keywords, summary } = program ?? {};

  return (
    <div className="block w-full max-h-[292px] border border-gray-border rounded-lg p-5">
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
        <div className="flex items-center gap-2 font-medium text-sm">
          <ProgramStatusBadge program={program} />
        </div>
      </div>

      <Link to={`/programs/${id}`} className="flex items-stretch gap-4 mb-4">
        {program.image ? (
          <img src={program.image} className="w-[104px] h-[104px] rounded-md" alt="Program" />
        ) : (
          <div className="w-[104px] h-[104px] bg-slate-200 rounded-md" />
        )}
        <div className="flex flex-col justify-between">
          <h2 className="truncate max-w-[394px] text-lg font-bold text-gray-dark">{name}</h2>
          <div className="inline-flex items-center self-start bg-secondary text-sm py-1 px-2 rounded-md">
            <span className="mr-3 text-neutral-400">PRICE</span>
            <span className="flex items-center gap-1 text-muted-foreground font-medium">
              {getCurrencyIcon(program.currency)} {program.price}
              <span className="ml-1">{program.currency}</span>
            </span>
            <span className="block ml-2 pl-2 border-l text-muted-foreground font-medium">
              {getCurrency(program.network)?.display}
            </span>
          </div>
          <div className="inline-flex items-center self-start py-1 px-2 rounded-md text-sm bg-secondary">
            <span className="mr-3 text-neutral-400">DEADLINE</span>
            <span className="font-medium text-muted-foreground">
              {format(new Date(program.deadline ?? new Date()), 'dd . MMM . yyyy').toUpperCase()}
            </span>
            {program.deadline && <Badge className="ml-2">{dDay(program.deadline)}</Badge>}
          </div>
        </div>
      </Link>

      <div className="mb-6">
        <p className="leading-5 line-clamp-2 h-10 text-slate-500 text-sm font-normal">{summary}</p>
      </div>

      <div className="flex justify-between">
        <div className="text-xs font-semibold bg-gray-light rounded-md px-3 py-2 leading-4">
          Submitted Application
          <span className="ml-1 text-primary">{program.applications?.length ?? 0}</span>
        </div>
        <div className="text-xs font-semibold bg-gray-light rounded-md px-3 py-2 leading-4">
          Approved Application
          <span className="ml-1 text-green-600">
            {program.applications?.filter(
              (a) =>
                a.status === ApplicationStatus.Accepted || a.status === ApplicationStatus.Completed,
            ).length ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProgramCard;
