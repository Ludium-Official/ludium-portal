import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ContractModal } from './contract/contract-modal';
import { useState } from 'react';
import { ContractInformation } from '@/types/recruitment';
import { ApplicationStatusV2 } from '@/types/types.generated';

interface HireButtonProps {
  contractInformation: ContractInformation;
  disabled?: boolean;
}

export function HireButton({ contractInformation, disabled = false }: HireButtonProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

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
        {contractInformation.applicationStatus === ApplicationStatusV2.InProgress
          ? 'Update Contract'
          : 'Hire'}
      </Button>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex justify-center text-center">
              <div className="w-60">Are you sure you want to hire this candidate?</div>
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-muted-foreground">
            Accepting it will open a pandora&apos;s box.
          </p>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button type="button" variant="default" className="w-full" onClick={handleContinue}>
              Continue writing
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
