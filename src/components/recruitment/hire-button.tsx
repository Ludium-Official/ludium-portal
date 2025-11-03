import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ContractModal } from './contract-modal';
import { useState } from 'react';

interface HireButtonProps {
  applicationId?: string | null;
  programId?: string | null;
  disabled?: boolean;
}

export function HireButton({ applicationId, programId, disabled }: HireButtonProps) {
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
        Hire
      </Button>

      {/* Confirm Hire Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Are you sure you want to hire this candidate?
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-sm text-muted-foreground">
              Accepting it will open a pandora&apos;s box.
            </p>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button type="button" variant="default" className="w-full" onClick={handleContinue}>
              Continue writing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contract Modal */}
      <ContractModal
        open={isContractModalOpen}
        onOpenChange={setIsContractModalOpen}
        applicationId={applicationId}
        programId={programId}
      />
    </>
  );
}
