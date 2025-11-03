import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId?: string | null;
  programId?: string | null;
}

export function ContractModal({
  open,
  onOpenChange,
  applicationId,
  programId,
}: ContractModalProps) {
  // TODO: 계약서 작성 폼 구현
  const handleSubmit = () => {
    console.log('Submit contract', { applicationId, programId });
    // TODO: API 호출로 계약서 생성
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Contract</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {/* TODO: 계약서 작성 폼 내용 */}
          <p className="text-muted-foreground">Contract form will be here</p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="default" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
