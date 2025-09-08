import { ApplicationStatusBadge } from '@/components/status-badge';
import { Progress } from '@/components/ui/progress';
import { getCurrencyIcon } from '@/lib/utils';
import type { Application } from '@/types/types.generated';
import { format } from 'date-fns';
import { ImageIcon } from 'lucide-react';

type Props = {
  application: Application;
  isProject?: boolean;
  isSupporter?: boolean;
};
export default function ProgramProjectCard({ application, isProject, isSupporter }: Props) {
  return (
    <div className="flex flex-col gap-4 p-5 border rounded-lg">
      <div className="w-fit">
        <ApplicationStatusBadge application={application} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {application.applicant?.image ? (
            <img
              src={application.applicant.image}
              alt="Preview"
              className="object-cover w-8 h-8 rounded-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <ImageIcon className="w-8 h-8 text-[#666666] rounded-full" />
            </div>
          )}
          <p className="font-bold text-sm text-gray-dark">{application.applicant?.firstName}</p>
        </div>
        <div className="flex flex-col rounded-md px-2 bg-black/5">
          <div className="flex justify-between items-center py-1">
            <p className="font-semibold text-sm text-neutral-400">PRIZE</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <p className="font-bold text-sm text-muted-foreground">
                  {application?.program?.price}
                </p>
                {getCurrencyIcon(application?.program?.currency)}
                <p className="font-medium text-sm text-muted-foreground">
                  {application?.program?.currency}
                </p>
              </div>
              <div className="border-l pl-2">
                <p className="font-medium text-sm text-muted-foreground">
                  {application?.program?.network}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center py-1 gap-3">
            <p className="font-semibold text-sm text-neutral-400">STATUS</p>
            <Progress value={application?.fundingProgress ?? 0} className="flex-1 bg-gray-200" />
            <div className="flex items-center gap-0.5">
              <p className="font-bold text-xl text-primary">{application?.fundingProgress ?? 0}</p>
              <p className="font-bold text-sm text-muted-foreground">%</p>
            </div>
          </div>
        </div>
        {isProject && <p className="line-clamp-2 text-sm text-gray-dark">{application.summary}</p>}
        {isSupporter && (
          <div className="flex flex-col rounded-md px-2 bg-black/5">
            <div className="flex justify-between items-center py-1">
              <p className="font-bold text-sm text-gray-dark">PAYED</p>
              <div className="flex items-center gap-1">
                <p className="font-bold text-xl text-primary">{application?.program?.price}</p>
                {getCurrencyIcon(application?.program?.currency)}
                <p className="font-medium text-sm text-muted-foreground">
                  {application?.program?.currency}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <p className="font-semibold text-sm text-neutral-400">PAYED DATE</p>
              <p className="text-sm text-muted-foreground">
                {application?.program?.deadline
                  ? format(application?.program?.deadline, 'yyyy.MM.dd')
                  : ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
