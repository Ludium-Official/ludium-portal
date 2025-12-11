import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getNetworkDisplayName, getTokenIcon } from '@/constant/network-icons';
import { dDay, getInitials, getUserDisplayName, timeAgo } from '@/lib/utils';
import type { ProgramV2 } from '@/types/types.generated';
import { format } from 'date-fns';
import { Link } from 'react-router';

function ProgramCard({ program }: { program: ProgramV2 }) {
  const { id, createdAt, deadline, price, title, network, token, applicationCount } = program ?? {};

  return (
    <div className="block w-full max-w-full max-h-[292px] border border-gray-border rounded-lg p-5">
      <Link to={`/programs/${id}`} className="flex flex-col gap-3 mb-4">
        <div className="text-lg font-bold line-clamp-1 min-h-[28px]">{title}</div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar className="w-7 h-7">
            <AvatarImage src={program.sponsor?.profileImage || ''} />
            <AvatarFallback className="text-xs">
              {getInitials(
                getUserDisplayName(
                  program.sponsor?.firstName,
                  program.sponsor?.lastName,
                  program.sponsor?.email,
                ),
              )}
            </AvatarFallback>
          </Avatar>
          {getUserDisplayName(
            program.sponsor?.firstName,
            program.sponsor?.lastName,
            program.sponsor?.email,
          )}
        </div>

        <div className="flex gap-3">
          <div className="inline-flex items-center self-start bg-secondary text-sm py-1 px-2 rounded-md">
            <span className="mr-3 text-xs font-semibold text-neutral-400">PRICE</span>
            {price ? (
              <span className="flex items-center gap-1 text-muted-foreground font-medium">
                {token && getTokenIcon(token.tokenName || 'EDU')} {price}
                <span className="ml-1">{token?.tokenName}</span>
              </span>
            ) : (
              <span className="text-muted-foreground font-medium">Negotiable</span>
            )}
            <span className="block ml-2 pl-2 border-l text-muted-foreground font-medium">
              {network && getNetworkDisplayName(network.chainName || 'educhain')}
            </span>
          </div>
          <div className="inline-flex items-center self-start py-1 px-2 rounded-md text-sm bg-secondary">
            <span className="mr-3 text-xs font-semibold text-neutral-400">DEADLINE</span>
            <span className="font-medium text-muted-foreground">
              {format(new Date(deadline ?? new Date()), 'dd . MMM . yyyy').toUpperCase()}
            </span>
            {deadline && <Badge className="ml-2">{dDay(deadline)}</Badge>}
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between text-sm text-[#8C8C8C]">
        <div>{createdAt ? timeAgo(createdAt) : ''}</div>
        <div className="px-3 py-2 leading-4">
          Applicants:
          <span className="ml-1 font-semibold">
            {applicationCount && applicationCount > 10 ? '10+' : (applicationCount ?? 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProgramCard;
