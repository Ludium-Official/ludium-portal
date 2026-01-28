import type { ApplicationSidebarProps } from '@/types/recruitment';
import { FileContractAccordion } from './file-contract-accordion';
import { MilestoneAccordion } from './milestone-accordion';

export function ApplicationSidebar({
  activeMilestones,
  completedMilestones,
  files,
  contracts,
  isSponsor,
  isHandleMakeNewMilestone,
  onMilestoneClick,
  onNewMilestoneClick,
  onContractClick,
}: ApplicationSidebarProps) {
  return (
    <div className="h-full p-4 bg-[#FBF5FF] overflow-y-auto rounded-r-xl space-y-3 relative z-0">
      <MilestoneAccordion
        activeMilestones={activeMilestones}
        completedMilestones={completedMilestones}
        onMilestoneClick={onMilestoneClick}
        onNewMilestoneClick={onNewMilestoneClick}
        isSponsor={isSponsor}
        isHandleMakeNewMilestone={isHandleMakeNewMilestone}
      />

      <FileContractAccordion
        files={files}
        contracts={contracts}
        onContractClick={onContractClick}
      />
    </div>
  );
}
