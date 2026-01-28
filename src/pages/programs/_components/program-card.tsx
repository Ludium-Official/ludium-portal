import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getNetworkIcon } from '@/constant/network-icons';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn, getInitials, getUserDisplayName, timeAgo } from '@/lib/utils';
import type { ProgramV2 } from '@/types/types.generated';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';

function ProgramCard({
  program,
  selectedProgramId,
  setSelectedProgramId,
}: { program: ProgramV2; selectedProgramId?: string; setSelectedProgramId: (id: string) => void }) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { id, createdAt, deadline, price, title, network, token } = program ?? {};
  const isSelected = selectedProgramId === id;

  const handleClick = () => {
    if (isMobile) {
      navigate(`/programs/recruitment/${id}`);
    } else {
      setSelectedProgramId(id ?? '');
    }
  };

  return (
    <div
      className={cn(
        'cursor-pointer border-b border-gray-border px-3 py-[14px]',
        !isMobile && isSelected && 'border border-primary rounded-md',
        isMobile && 'px-4',
      )}
      onClick={handleClick}
    >
      <div className="flex flex-col gap-3">
        <div className="font-bold line-clamp-1 min-h-[28px]">{title}</div>
        <div className="flex items-center w-fit bg-black/5 rounded-md px-2 py-1 text-xs">
          <div className="mr-1 [&_svg]:size-4">
            {network && getNetworkIcon(network.chainName || 'educhain')}
          </div>
          {price ? (
            <span className="text-muted-foreground font-medium">
              {price}
              <span className="ml-1">{token?.tokenName}</span>
            </span>
          ) : (
            <span className="text-muted-foreground font-medium">Negotiable</span>
          )}
          <span className="ml-2 mr-[6px] font-semibold text-neutral-400">DEADLINE</span>
          <span className="font-medium text-muted-foreground">
            {format(new Date(deadline ?? new Date()), 'dd . MMM . yyyy').toUpperCase()}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="w-7 h-7">
              <AvatarImage src={program.sponsor?.profileImage || ''} />
              <AvatarFallback className="text-xs">
                {getInitials(getUserDisplayName(program.sponsor?.nickname, program.sponsor?.email))}
              </AvatarFallback>
            </Avatar>
            {getUserDisplayName(program.sponsor?.nickname, program.sponsor?.email)}
          </div>
          <div className="flex justify-end text-xs text-muted-foreground">
            {createdAt ? timeAgo(createdAt) : ''}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramCard;
