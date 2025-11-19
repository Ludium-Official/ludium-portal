import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ContractInformation } from '@/types/recruitment';
import { useState } from 'react';
import { ContractModal } from './contract/contract-modal';
import { useGetMilestonesV2Query } from '@/apollo/queries/milestones-v2.generated';

interface HireButtonProps {
  contractInformation: ContractInformation;
  disabled?: boolean;
}

export function HireButton({ contractInformation, disabled = false }: HireButtonProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const { data: milestonesData } = useGetMilestonesV2Query({
    variables: {
      query: {
        applicantId: contractInformation.applicant?.id,
        programId: contractInformation.programId,
      },
    },
  });
  const milestones = milestonesData?.milestonesV2?.data || [];
  const hasMilestones = milestones.length > 0;

  const handleHireClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleContinue = () => {
    setIsConfirmModalOpen(false);
    setIsContractModalOpen(true);
  };

  return (
    <>
      <Button className="mr-4 px-8 bg-primary" onClick={handleHireClick} disabled={disabled}>
        {hasMilestones ? 'Send Contract' : 'Hire'}
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
