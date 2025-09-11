import { ProgramStatusBadge } from '@/components/status-badge';
import { Progress } from '@/components/ui/progress';
import type { Program } from '@/types/types.generated';
import { ChevronRightIcon, ImageIcon } from 'lucide-react';

type Props = {
  program: Program;
  isStatus?: boolean;
};
export default function ProgramHostCard({ program, isStatus }: Props) {
  const formattedDate = new Date(program.deadline)
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();

  const [day, month, year] = formattedDate.split(' ');
  return (
    <div className="flex flex-col gap-6 p-5 border rounded-lg">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[6px]">
            {program.keywords?.map((keyword) => (
              <div
                key={keyword.id}
                className="flex items-center justify-center bg-secondary rounded-full px-[10px] h-5"
              >
                <p className="font-semibold text-xs text-gray-dark">{keyword.name}</p>
              </div>
            ))}
          </div>
          <ProgramStatusBadge program={program} />
        </div>
        <div className="flex gap-4">
          {program.creator?.image ? (
            <img
              src={program.creator.image}
              alt="Preview"
              className="object-cover w-[144px] h-[144px] rounded-[6px]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-[144px] h-[144px]">
              <ImageIcon className="w-[144px] h-[144px] text-[#666666] mb-2" />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <p className="font-bold text-lg text-gray-dark line-clamp-1">{program.name}</p>
            {isStatus && (
              <div className="rounded-md px-2 bg-black/5">
                <div className="flex items-center py-1 gap-3">
                  <p className="font-semibold text-sm text-neutral-400">STATUS</p>
                  <Progress value={25} className="flex-1 bg-gray-200" />
                  <div className="flex items-center gap-0.5">
                    <p className="font-bold text-xl text-primary">25</p>
                    <p className="font-bold text-sm text-muted-foreground">%</p>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-[rgba(0,0,0,0.04)] flex items-center rounded-md h-8 px-2 gap-2 max-w-[325px]">
              <p className="font-semibold text-sm text-neutral-400">DATE</p>
              <div className="flex items-center gap-1.5 font-medium text-sm text-muted-foreground">
                <div className="flex gap-[2px]">
                  <span>{day}</span>
                  <span>.</span>
                  <span>{month}</span>
                  <span>.</span>
                  <span>{year}</span>
                </div>
                <p>-</p>
                <div className="f flex gap-[2px]">
                  <span>{day}</span>
                  <span>.</span>
                  <span>{month}</span>
                  <span>.</span>
                  <span>{year}</span>
                </div>
              </div>
              <div className="h-5 px-[10px] flex items-center justify-center rounded-full bg-gray-dark">
                <p className="font-semibold text-xs text-primary-foreground w-full mx-auto whitespace-nowrap">
                  {`D-${Math.max(
                    0,
                    program.deadline
                      ? Math.ceil(
                          (new Date(program.deadline).getTime() - Date.now()) /
                            (1000 * 60 * 60 * 24),
                        )
                      : 0,
                  )}`}
                </p>
              </div>
            </div>

            <p className="line-clamp-2 text-sm text-slate-500">{program.description}</p>
          </div>
        </div>
      </div>

      {isStatus ? (
        <div className="flex items-center justify-end gap-2">
          <p className="font-medium text-sm text-gray-dark">Project Management</p>
          <p className="font-bold text-sm text-primary">6</p>
          <ChevronRightIcon width={16} height={16} />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="bg-secondary h-9 flex items-center px-3 gap-2 rounded-md">
            <p className="font-medium text-sm text-gray-dark">Submitted Project</p>
            <p className="font-bold text-sm text-primary">+99</p>
          </div>
          <div className="bg-secondary h-9 flex items-center px-3 gap-1 rounded-md">
            <p className="font-medium text-sm text-gray-dark">Approved Project</p>
            <p className="font-bold text-sm text-green-600">2</p>
          </div>
        </div>
      )}
    </div>
  );
}
