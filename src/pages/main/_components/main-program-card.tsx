import { Badge } from '@/components/ui/badge';
import { ApplicationStatus, type Program } from '@/types/types.generated';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
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

  // Find the latest active application and get its funding progress
  const latestActiveApplication = useMemo(() => {
    if (!program?.applications?.length) return null;

    // Filter for active applications (Accepted or Completed status)
    const activeApplications = program.applications.filter(
      (app) =>
        app.status === ApplicationStatus.Accepted || app.status === ApplicationStatus.Completed,
    );

    if (!activeApplications.length) return null;

    // Return the first one (assuming they're ordered by latest first, or we can sort by creation date if needed)
    return activeApplications[0];
  }, [program?.applications]);

  // Use the funding progress from the latest active application, fallback to 0
  const fundingProgress = latestActiveApplication?.fundingProgress ?? 0;

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
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
          <div className="w-[14px] h-[14px] bg-purple-500 rounded-full" />
          <span className="text-sm text-gray-700 font-semibold">Completed</span>
        </div>
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
            <div className="bg-[#0000000A] rounded px-2 py-1 flex justify-between items-center gap-3">
              <span className="text-sm text-neutral-400 font-semibold">STATUS</span>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${fundingProgress}%` }}
                />
              </div>
              <span className="text-xl text-primary font-bold flex items-center">
                {fundingProgress}
                <span className="text-sm text-muted-foreground">%</span>
              </span>
            </div>

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
              <span className="text-sm text-primary font-bold">6</span>
              <ChevronRight className="w-4 h-4 text-secondary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MainProgramCard;
