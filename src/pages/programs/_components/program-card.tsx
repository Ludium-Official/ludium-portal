import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/use-auth';
import { getCurrency } from '@/lib/utils';
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
    <div className="block w-full border border-gray-border rounded-[20px] px-10 pt-8 pb-6">
      <div className="flex justify-between mb-2">
        <div className="flex gap-2 mb-1">
          {keywords?.slice(0, 3)?.map((k) => (
            <Badge
              key={k.id}
              variant='secondary'
            >
              {k.name}
            </Badge>
          ))}

          {(program?.keywords?.length ?? 0) > 3 && (
            <Badge variant="secondary">+{(program?.keywords?.length ?? 0) - 3} more</Badge>
          )}
        </div>
        <div className="font-medium flex gap-2 items-center text-sm">
          {/* <span className='block px-2.5 py-0.5'>
            {formatProgramStatus(program)}
          </span> */}
          <ProgramStatusBadge program={program} />
          {isSponsor && (
            <Link to={`/programs/${program?.id}/edit`}>
              <Settings className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      <Link to={`/programs/${id}`} className="flex items-stretch gap-4 mb-4">
        <div className="w-[104px] h-[104px] bg-slate-200 rounded-md " />
        <div className='flex flex-col justify-between'>
          <h2 className="text-lg font-bold">{name}</h2>
          <div className='inline-flex self-start text-sm bg-secondary py-1 px-2 items-center rounded-md'><span className='text-neutral-400 mr-3'>PRICE</span> <span className='flex items-center text-muted-foreground gap-1 font-medium'>{getCurrency(program?.network)?.icon} {program?.price} {program?.currency}</span><span className='block ml-2 border-l pl-2 text-muted-foreground font-medium'>{getCurrency(program?.network)?.display}</span></div>
          <div className='inline-flex self-start text-sm bg-secondary py-1 px-2 items-center rounded-md'><span className='text-neutral-400 mr-3'>DEADLINE</span>
            <span className='font-medium text-muted-foreground'>
              {format(new Date(program?.deadline ?? new Date()), 'dd . MMM . yyyy').toUpperCase()}
            </span>
          </div>
        </div>
      </Link>

      <div className="mb-6">
        <p className="text-foreground text-sm font-normal leading-5 line-clamp-2">{summary}</p>
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
            {program.applications?.filter((a) => a.status === ApplicationStatus.Accepted)
              .length ?? 0}
          </span>
        </Link>
      </div>
    </div>
  );
}

export default ProgramCard;
