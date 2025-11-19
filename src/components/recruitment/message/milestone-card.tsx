import { formatUTCDateLocal, fromUTCString } from '@/lib/utils';
import { MilestoneStatusV2 } from '@/types/types.generated';
import type { MilestoneCardProps } from '@/types/recruitment';

export function MilestoneCard({ milestone, onClick, isCompleted = false }: MilestoneCardProps) {
  const getDaysLeft = () => {
    if (!milestone.deadline) return null;
    const now = new Date();
    const deadline = fromUTCString(milestone.deadline);
    if (!deadline) return null;
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft();
  const isDraft = milestone.status === MilestoneStatusV2.Draft;
  const isUnderReview = milestone.status === MilestoneStatusV2.UnderReview;
  const isUrgent =
    !isCompleted &&
    !isDraft &&
    !isUnderReview &&
    daysLeft !== null &&
    daysLeft <= 3 &&
    daysLeft >= 0;

  const getBackgroundColor = () => {
    if (isDraft) return 'bg-[#F5F5F5] border-l-[#9CA3AF] hover:bg-[#E5E5E5]';
    if (isUnderReview) return 'bg-[#F0FFF5] border-l-[#4ADE80] hover:bg-[#E0FFE5]';
    if (isCompleted) return 'bg-[#F0EDFF] border-l-[#9E71C9] hover:bg-[#E5DDFF]';
    if (isUrgent) return 'bg-[#FFF9FC] border-l-[#EC4899] hover:bg-[#FFF0F7]';
    return 'bg-[#F5F8FF] border-l-[#60A5FA] hover:bg-[#EBF2FF]';
  };

  return (
    <div
      className={`space-y-2 p-2 rounded border-l-5 cursor-pointer transition-colors ${getBackgroundColor()}`}
      onClick={() => {
        onClick(milestone);
      }}
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {milestone.deadline && (
          <>
            {isUrgent && (
              <span className="text-[#EC4899] font-medium">
                {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'D-day' : `${daysLeft} days left`}
              </span>
            )}
            <span>{formatUTCDateLocal(milestone.deadline)}</span>
          </>
        )}
      </div>
      <div>
        <p className="text-sm font-medium">{milestone.title}</p>
      </div>
    </div>
  );
}
