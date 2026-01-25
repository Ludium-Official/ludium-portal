import { recruitmentStatusColors } from '@/constant/status';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';

const StatusBadge: React.FC<{ status?: string; className?: string }> = ({ status, className }) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 bg-[#18181B0A] rounded-[50px] px-[10px] py-[5px]',
        isMobile && 'py-[2px]',
        className,
      )}
    >
      <div
        className={cn('w-4 h-4 rounded-full', isMobile && 'w-3 h-3')}
        style={{
          backgroundColor: (status && recruitmentStatusColors[status]) || '#7E7E7E',
        }}
      />
      <span className="capitalize font-bold">{status}</span>
    </div>
  );
};

export default StatusBadge;
