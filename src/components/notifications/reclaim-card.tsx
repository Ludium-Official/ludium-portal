import { ApplicationStatusBadge } from '@/components/status-badge';
import { getCurrency, getCurrencyIcon } from '@/lib/utils';
import { ApplicationStatus } from '@/types/types.generated';

function ReclaimCard() {
  return (
    <div className="border rounded-lg p-3 space-y-2">
      <header className="flex justify-between items-center mb-3">
        <span className="block px-2 py-0.5 bg-[#0000000A] rounded-full font-semibold text-xs">
          Investment
        </span>

        <p className="text-xs text-muted-foreground">about 5 days ago</p>
      </header>
      <div className="flex items-center gap-2">
        {/* Avatar placeholder */}
        <div className="w-8 h-8 bg-gray-200 rounded-full" />

        <p className="font-bold text-sm">BUILDER NAME</p>
      </div>
      <p className="text-xs text-muted-foreground">
        <span className="font-bold">Project name</span> has given you a tier
      </p>

      <div className="flex justify-between self-start text-sm bg-secondary py-1 px-2 items-center rounded-md">
        <span className="text-neutral-400 mr-3">PRICE</span>{' '}
        <div className="flex items-center">
          <span className="flex items-center text-muted-foreground gap-1 font-medium">
            {getCurrencyIcon('USDT')} {1000} USDT
          </span>
          <span className="block ml-2 border-l pl-2 text-muted-foreground font-medium">
            {getCurrency('arbitrum')?.display}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">MILESTONE #1</p>
        <ApplicationStatusBadge application={{ status: ApplicationStatus.Rejected }} />
      </div>
    </div>
  );
}

export default ReclaimCard;
