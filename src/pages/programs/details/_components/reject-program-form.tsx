// import { useRejectProgramMutation } from '@/apollo/mutation/reject-program.generated';
import { useRejectProgramMutation } from '@/apollo/mutation/reject-program.generated';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import notify from '@/lib/notify';
import { useState } from 'react';

function RejectProgramForm({
  refetch,
  programId,
}: { refetch?: () => void; programId?: string | null }) {
  const [reason, setReason] = useState<string>();

  const [rejectProgram] = useRejectProgramMutation();

  return (
    <form>
      <DialogTitle className="text-2xl font-semibold px-6 pt-6">Submit Rejection of Program</DialogTitle>

      <DialogDescription className="hidden" />

      <DialogClose className='hidden' id='reject-program-form-close' />

      <label htmlFor="reason" className="block mb-4 py-6 px-10">
        <p className="text-sm font-medium mb-2">Reason</p>
        <Textarea id="reason" rows={5} value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>

      <div className="w-full flex justify-end mt-5 border-t p-6">
        <Button
          type="button"
          className="h-10 ml-auto"
          // variant="outline"
          onClick={() =>
            rejectProgram({
              variables: {
                id: programId ?? '',
                rejectionReason: reason,
              },
              onCompleted: () => {
                refetch?.();
                notify('Program rejected successfully', 'success');
                document.getElementById('reject-program-form-close')?.click();
              },
              onError: (error) => {
                notify(error.message, 'error');
              },
            })
          }
        >
          Submit Rejection
        </Button>
      </div>
    </form>
  );
}

export default RejectProgramForm;
