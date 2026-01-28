import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { MilestoneV2 } from '@/types/types.generated';
import { Plus } from 'lucide-react';
import { MilestoneCard } from './milestone-card';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MilestoneAccordionProps {
  activeMilestones: MilestoneV2[];
  completedMilestones: MilestoneV2[];
  onMilestoneClick: (milestone: MilestoneV2) => void;
  onNewMilestoneClick?: () => void;
  isSponsor?: boolean;
  isHandleMakeNewMilestone?: boolean;
  defaultOpen?: string[];
}

export function MilestoneAccordion({
  activeMilestones,
  completedMilestones,
  onMilestoneClick,
  onNewMilestoneClick,
  isSponsor = false,
  isHandleMakeNewMilestone = false,
  defaultOpen = ['milestone', 'completed'],
}: MilestoneAccordionProps) {
  const isMobile = useIsMobile();

  return (
    <Accordion
      type="multiple"
      defaultValue={defaultOpen}
      className={cn('bg-white rounded-lg', isMobile && 'border border-gray-200')}
    >
      <AccordionItem value="milestone" className="px-3">
        <AccordionTrigger className="hover:no-underline py-3">
          <div className="flex items-center justify-between w-full">
            <span className="font-medium text-base">Milestone</span>
            {isSponsor && isHandleMakeNewMilestone && onNewMilestoneClick && (
              <Plus
                className="cursor-pointer w-4 h-4"
                onClick={(e) => {
                  e.stopPropagation();
                  onNewMilestoneClick();
                }}
              />
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 pb-3">
          {activeMilestones.map((milestone) => (
            <MilestoneCard key={milestone.id} milestone={milestone} onClick={onMilestoneClick} />
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="completed" className="px-3">
        <AccordionTrigger className="hover:no-underline py-3">
          <span className="font-medium text-base">Completed</span>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 pb-3">
          {completedMilestones.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              onClick={onMilestoneClick}
              isCompleted={true}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
