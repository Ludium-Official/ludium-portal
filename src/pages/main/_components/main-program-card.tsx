import { ProgramStatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import type { Program } from '@/types/types.generated';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

interface MainProgramCardProps {
  program: Program;
}

function MainProgramCard({ program }: MainProgramCardProps) {
  // Calculate days remaining
  const deadline = new Date(program?.deadline ?? new Date());
  const today = new Date();
  const daysRemaining = Math.max(
    0,
    Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
  );

  return (
    <Link
      to={`/investments/${program.id}`}
      className="bg-white border border-gray-200 min-w-[624px] w-[624px] h-[292px] p-6 rounded-lg hover:shadow-md transition-shadow flex flex-col"
    >
      <div className="flex justify-between mb-2">
        <div className="flex gap-2">
          {program?.keywords?.slice(0, 3)?.map((k) => (
            <Badge
              key={k.id}
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-700 border-0 px-3 py-1 rounded-full font-semibold"
            >
              {k.name}
            </Badge>
          ))}
        </div>
        <ProgramStatusBadge program={program} />
      </div>

      <div className="flex gap-6 flex-1">
        <div className="w-[156px] h-[156px] bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
          {program?.image ? (
            <img
              src={program.image}
              alt={program?.name || 'Program image'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg" />
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2 truncate max-w-[394px]">
            {program?.name}
          </h3>

          <div className="space-y-2 flex-1 mb-3">
            <div className="inline-flex gap-2 justify-between items-center bg-[#0000000A] rounded px-2 py-1">
              <span className="text-sm text-neutral-400 font-semibold">DATE</span>
              <span className="text-sm font-medium text-muted-foreground">
                {format(deadline, 'dd . MMM . yyyy')} –{' '}
                {format(new Date(deadline.getTime() + 90 * 24 * 60 * 60 * 1000), 'dd . MMM . yyyy')}
              </span>
              <Badge className="bg-gray-800 text-white text-xs px-2">
                D-{daysRemaining > 0 ? daysRemaining : 0}
              </Badge>
            </div>

            <p className="text-sm text-gray-700 line-clamp-2 text-wrap max-w-[412px]">
              {program?.summary}
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 mt-auto">
            <span className="text-sm text-secondary-foreground font-medium">
              Project Management
            </span>
            <div className="flex items-center gap-1">
              <span className="text-sm text-primary font-bold">
                {program.applications?.length || 0}
              </span>
              <ChevronRight className="w-4 h-4 text-secondary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MainProgramCard;
