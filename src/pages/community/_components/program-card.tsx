import { Badge } from '@/components/ui/badge';
import {} from '@/components/ui/dialog';
import { useAuth } from '@/lib/hooks/use-auth';
import { formatProgramStatus } from '@/lib/utils';
import { ApplicationStatus, type Program } from '@/types/types.generated';
import { format } from 'date-fns';
import { ArrowRight, Settings } from 'lucide-react';
import { Link } from 'react-router';

function ProgramCard({ program }: { program: Program }) {
  const { isSponsor } = useAuth();
  const { id, name, keywords, summary } = program ?? {};
  const badgeVariants = ['teal', 'orange', 'pink'];

  return (
    <div className="block w-full border border-[#E9E9E9] rounded-[20px] px-10 pt-8 pb-6">
      <div className="flex justify-between mb-5">
        <div className="flex gap-2 mb-1">
          {keywords?.map((k, i) => (
            <Badge
              key={k.id}
              variant={
                badgeVariants[i % badgeVariants.length] as 'default' | 'secondary' | 'purple'
              }
            >
              {k.name}
            </Badge>
          ))}
        </div>
        <span className="font-medium flex gap-2 items-center text-sm">
          {formatProgramStatus(program)}{' '}
          {isSponsor && (
            <Link to={`/programs/${program?.id}/edit`}>
              <Settings className="w-4 h-4" />
            </Link>
          )}
        </span>
      </div>

      <Link to={`/programs/${id}`} className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <h2 className="text-lg font-bold">{name}</h2>
      </Link>
      <div className="mb-4">
        <p className="font-sans font-bold bg-[#F8ECFF] text-[#B331FF] leading-4 text-xs inline-flex items-center py-1 px-2 rounded-[6px]">
          <span className="inline-block mr-2">
            {program?.price} {program?.currency}
          </span>
          <span className="h-3 border-l border-[#B331FF] inline-block" />
          <span className="inline-block ml-2">
            DEADLINE{' '}
            {format(new Date(program?.deadline ?? new Date()), 'dd . MMM . yyyy').toUpperCase()}
          </span>
        </p>
      </div>

      <div className="mb-6">
        <p className="text-foreground text-sm font-normal leading-5 truncate">{summary}</p>
      </div>

      <div className="flex justify-between">
        <div className="space-x-3">
          <Link
            to={`/programs/${id}#applications`}
            className="text-xs font-semibold bg-[#F4F4F5] rounded-full px-2.5 py-0.5 leading-4"
          >
            Submitted Application{' '}
            <span className="text-[#B331FF]">{program.applications?.length ?? 0}</span>
          </Link>
          <Link
            to={`/programs/${id}#applications`}
            className="text-xs font-semibold bg-[#18181B] text-white rounded-full px-2.5 py-0.5"
          >
            Approved Application{' '}
            <span className="text-[#FDE047]">
              {program.applications?.filter((a) => a.status === ApplicationStatus.Approved)
                .length ?? 0}
            </span>
          </Link>
        </div>

        <Link to={`/programs/${id}`} className="flex items-center gap-2 text-sm">
          See details <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default ProgramCard;
