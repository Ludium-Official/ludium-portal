import { recruitmentStatusColors } from '@/constant/status';

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => (
  <div className="inline-flex items-center gap-2 bg-[#18181B0A] rounded-[50px] px-[10px] py-[5px]">
    <div
      className="w-4 h-4 rounded-full"
      style={{
        backgroundColor: (status && recruitmentStatusColors[status]) || '#7E7E7E',
      }}
    />
    <span className="capitalize font-bold">{status}</span>
  </div>
);

export default StatusBadge;
