// import { useRejectProgramMutation } from '@/apollo/mutation/reject-program.generated';
import { useRejectProgramMutation } from '@/apollo/mutation/reject-program.generated';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

function RejectProgramForm({
  refetch,
  programId,
}: { refetch?: () => void; programId?: string | null }) {
  const [reason, setReason] = useState<string>();

  const [rejectProgram] = useRejectProgramMutation();

  return (
    <form>
      <DialogTitle className="text-2xl font-semibold mb-6">Reject program</DialogTitle>

      <DialogDescription className="hidden" />

      <label htmlFor="reason" className="mb-4">
        <p className="text-sm font-medium mb-2">Reason</p>
        <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>

      <div className="w-full flex justify-end mt-5">
        <Button
          type="button"
          className="h-10 ml-auto"
          variant="outline"
          onClick={() =>
            rejectProgram({
              variables: {
                id: programId ?? '',
                rejectionReason: reason,
              },
              onCompleted: () => {
                refetch?.();
              },
            })
          }
        >
          Reject
        </Button>
      </div>
    </form>
  );
}

export default RejectProgramForm;
