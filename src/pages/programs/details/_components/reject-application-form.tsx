import { useRejectApplicationMutation } from '@/apollo/mutation/reject-application.generated';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

function RejectApplicationForm({
  refetch,
  applicationId,
}: { refetch?: () => void; applicationId?: string | null }) {
  const [reason, setReason] = useState<string>();

  const [rejectApplication] = useRejectApplicationMutation();

  return (
    <form>
      <DialogTitle className="text-2xl font-semibold mb-6">Reject application</DialogTitle>

      <DialogDescription className="hidden" />

      <label htmlFor="reason" className="mb-4">
        <p className="text-sm font-medium mb-2">Reson</p>
        <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>

      <div className="w-full flex justify-end mt-5">
        <Button
          type="button"
          className="h-10 ml-auto"
          variant="outline"
          onClick={() =>
            rejectApplication({
              variables: {
                id: applicationId ?? '',
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

export default RejectApplicationForm;
