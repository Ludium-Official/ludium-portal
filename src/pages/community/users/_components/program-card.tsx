import cryptoIcon from '@/assets/icons/crypto.svg';
import { ProgramStatusBadge } from '@/components/status-badge';
import type { Program } from '@/types/types.generated';
import { ChevronRightIcon, ImageIcon } from 'lucide-react';

type Props = {
  program: Program;
};
export default function ProgramCard({ program }: Props) {
  const formattedDate = new Date(program.deadline)
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();

  const [day, month, year] = formattedDate.split(' ');
  return (
    <div className="flex flex-col gap-3 p-5 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[6px]">
          {program.keywords?.map((keyword) => (
            <div
              key={keyword.id}
              className="flex items-center justify-center bg-secondary rounded-full px-[10px] h-5"
            >
              <p className="font-semibold text-xs text-gray-dark">{keyword.name}</p>
            </div>
          ))}
        </div>
        <ProgramStatusBadge program={program} />
      </div>
      <div className="flex gap-4">
        {program.creator?.image ? (
          <img
            src={program.creator.image}
            alt="Preview"
            className="object-cover w-[100px] h-[100px] rounded-[6px]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <ImageIcon className="w-[100px] h-[100px] text-[#666666] mb-2" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <p className="font-bold text-lg text-gray-dark line-clamp-1">{program.name}</p>
          <div className="bg-[rgba(0,0,0,0.04)] flex items-center rounded-md h-7 px-2 gap-2 max-w-[260px]">
            <div className="flex gap-3">
              <p className="font-semibold text-sm text-neutral-400">PRICE</p>
              <div className="flex items-center gap-1">
                <p className="font-bold text-sm text-muted-foreground">{program.price}</p>
                <img src={cryptoIcon} width={16} height={16} alt="crypto" />
                <p className="font-medium text-sm text-muted-foreground">{program.currency}</p>
              </div>
            </div>
            <div className="border-l pl-2">
              <p className="font-medium text-sm text-muted-foreground">{program.network}</p>
            </div>
          </div>
          <div className="bg-[rgba(0,0,0,0.04)] flex items-center rounded-md h-7 px-2 gap-2 max-w-[260px]">
            <div className="flex gap-3">
              <p className="font-semibold text-sm text-neutral-400">DEADLINE</p>
              <div className="font-medium text-sm text-muted-foreground flex gap-[2px] pl-[11px]">
                <span>{day}</span>
                <span>.</span>
                <span>{month}</span>
                <span>.</span>
                <span>{year}</span>
              </div>
            </div>
            <div className="h-5 px-[10px] flex items-center justify-center rounded-full bg-gray-dark">
              <p className="font-semibold text-xs text-primary-foreground">D-7</p>
            </div>
          </div>
        </div>
      </div>
      <p className="line-clamp-2 text-sm text-slate-500">{program.description}</p>
      <div className="py-2 px-3 flex items-center justify-end gap-2">
        <p className="font-medium text-sm text-gray-dark">Application Management</p>
        <p className="font-bold text-sm text-primary">6</p>
        <ChevronRightIcon width={16} height={16} />
      </div>
    </div>
  );
}
