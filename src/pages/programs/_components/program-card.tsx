import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { dDay, getCurrency, getCurrencyIcon, timeAgo } from '@/lib/utils';
import { ProgramV2 } from '@/types/types.generated';
import { format } from 'date-fns';
import { Link } from 'react-router';

function ProgramCard({ program }: { program: ProgramV2 }) {
  const { id, createdAt, currency, deadline, description, network, price, title } = program ?? {};

  return (
    <div className="block w-full max-h-[292px] border border-gray-border rounded-lg p-5">
      <Link to={`/programs/${id}`} className="flex flex-col gap-4 mb-4">
        <div className="text-xl font-bold">{title}</div>
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="" alt="sponser-img" />
          </Avatar>
          <div className="text-muted-foreground font-medium">Juniahn Lee</div>
        </div>
        <div className="flex gap-4">
          <div className="inline-flex items-center self-start bg-secondary text-sm py-1 px-2 rounded-md">
            <span className="mr-3 text-neutral-400">PRICE</span>
            {price ? (
              <>
                <span className="flex items-center gap-1 text-muted-foreground font-medium">
                  {getCurrencyIcon(currency)} {price}
                  <span className="ml-1">{currency}</span>
                </span>
                <span className="block ml-2 pl-2 border-l text-muted-foreground font-medium">
                  {getCurrency(network)?.display}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground font-medium">Negotiable</span>
            )}
          </div>
          <div className="inline-flex items-center self-start py-1 px-2 rounded-md text-sm bg-secondary">
            <span className="mr-3 text-neutral-400">DEADLINE</span>
            <span className="font-medium text-muted-foreground">
              {format(new Date(deadline ?? new Date()), 'dd . MMM . yyyy').toUpperCase()}
            </span>
            {deadline && <Badge className="ml-2">{dDay(deadline)}</Badge>}
          </div>
        </div>
      </Link>

      <p className="mb-3 leading-5 line-clamp-2 h-10 text-slate-500 text-sm font-normal">
        {description}
      </p>

      <div className="flex items-center justify-between text-sm text-[#8C8C8C]">
        <div>{createdAt ? timeAgo(createdAt) : ''}</div>
        <div className="px-3 py-2 leading-4">
          Applicants:
          <span className="ml-1 font-semibold">{1}</span>
        </div>
      </div>
    </div>
  );
}

export default ProgramCard;
