import { Badge } from '@/components/ui/badge';
import type { Program } from '@/types/types.generated';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

interface MainProgramCardProps {
  program: Program;
}

function MainProgramCard({ program }: MainProgramCardProps) {
  // Calculate days remaining
  const deadline = new Date(program?.deadline ?? new Date());
  const today = new Date();
  const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Link
      to={`/programs/${program.id}`}
      className="bg-white border border-gray-200 min-w-[624px] w-[624px] h-[272px] p-6 rounded-lg hover:shadow-md transition-shadow flex flex-col"
    >
      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          {program?.keywords?.slice(0, 3)?.map((k) => (
            <Badge
              key={k.id}
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-700 border-0 px-3 py-1 rounded-full"
            >
              {k.name}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-purple-500 rounded-full" />
          <span className="text-xs text-gray-700">Completed</span>
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
          <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase">
            {program?.name}
          </h3>

          <div className="space-y-3 flex-1">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">STATUS</span>
                <span className="text-xs text-purple-600 font-medium">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-500 block">DATE</span>
                <span className="text-sm text-gray-900">
                  {format(deadline, 'dd . MMM . yyyy')} – {format(new Date(deadline.getTime() + 90 * 24 * 60 * 60 * 1000), 'dd . MMM . yyyy')}
                </span>
              </div>
              <Badge className="bg-gray-800 text-white text-xs px-2 py-1">
                D-{daysRemaining > 0 ? daysRemaining : 0}
              </Badge>
            </div>

            <p className="text-sm text-gray-700 line-clamp-2 flex-1">
              {program?.summary}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm text-gray-900">Project Management</span>
              <div className="flex items-center gap-1">
                <span className="text-sm text-purple-600 font-medium">6</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MainProgramCard; 