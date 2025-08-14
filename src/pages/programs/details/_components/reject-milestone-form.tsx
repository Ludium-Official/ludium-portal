import { useCheckMilestoneMutation } from '@/apollo/mutation/check-milestone.generated';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckMilestoneStatus } from '@/types/types.generated';
import { useState } from 'react';

function RejectMilestoneForm({
  refetch,
  milestoneId,
}: { refetch?: () => void; milestoneId?: string | null }) {
  const [reason, setReason] = useState<string>();

  const [checkMilestone] = useCheckMilestoneMutation();

  return (
    <form>
      <DialogTitle className="text-2xl font-semibold mb-6">Reject milestone</DialogTitle>

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
            checkMilestone({
              variables: {
                input: {
                  id: milestoneId ?? '',
                  rejectionReason: reason,
                  status: CheckMilestoneStatus.Rejected,
                },
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

export default RejectMilestoneForm;
