import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ContractInformation } from '@/types/recruitment';
import { useMemo, useState } from 'react';
import { ContractModal } from './contract/contract-modal';
import { ApplicationStatusV2, MilestoneStatusV2, MilestoneV2 } from '@/types/types.generated';

interface HireButtonProps {
  contractInformation: ContractInformation;
  milestones: MilestoneV2[];
}

export function HireButton({ contractInformation, milestones }: HireButtonProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const isActiveHireButton = useMemo(() => {
    const isUnderReviewMilestones =
      milestones.filter((m) => m.status === MilestoneStatusV2.UnderReview).length > 0;

    return (
      isUnderReviewMilestones &&
      contractInformation.applicationInfo.status !== ApplicationStatusV2.PendingSignature
    );
  }, [milestones, contractInformation.applicationInfo.status]);

  const isMilestoneUpdate =
    milestones.filter(
      (milestone) =>
        milestone.status === MilestoneStatusV2.Completed ||
        milestone.status === MilestoneStatusV2.InProgress ||
        milestone.status === MilestoneStatusV2.Update,
    ).length > 0;

  const handleHireClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleContinue = () => {
    setIsConfirmModalOpen(false);
    setIsContractModalOpen(true);
  };

  return (
    <>
      <Button
        className="mr-4 px-8 bg-primary"
        onClick={handleHireClick}
        disabled={!isActiveHireButton}
      >
        {isMilestoneUpdate ? 'Send Contract' : 'Hire'}
      </Button>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex justify-center text-center">
              <div className="w-60">Are you sure you want to hire this candidate?</div>
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-muted-foreground">
            The contract will be created based on the milestones you’ve set.
          </p>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button type="button" variant="default" className="w-full" onClick={handleContinue}>
              Proceed to Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ContractModal
        open={isContractModalOpen}
        onOpenChange={setIsContractModalOpen}
        contractInformation={contractInformation}
      />
    </>
  );
}
