import { cn } from '@/lib/utils';
import type { FC } from 'react';

export type TierType = 'bronze' | 'silver' | 'gold' | 'platinum';

interface TierBadgeProps {
  tier?: TierType;
  className?: string;
}

const tierStyles: Record<TierType, { bg: string; text: string }> = {
  bronze: {
    bg: 'bg-[#EED5C1]',
    text: 'text-[#9F6636]',
  },
  silver: {
    bg: 'bg-[#E2E8F0]',
    text: 'text-[#64748B]',
  },
  gold: {
    bg: 'bg-[#FFDEA1]',
    text: 'text-[#CA8A04]',
  },
  platinum: {
    bg: 'bg-[#CAF0E3]',
    text: 'text-[#0D9488]',
  },
};

export const TierBadge: FC<TierBadgeProps> = ({ tier, className }) => {
  if (!tier) return null;
  const { bg, text } = tierStyles[tier] ?? { bg: 'bg-gray-200', text: 'text-gray-600' };

  return (
    <span
      className={cn(
        'inline-block rounded-full px-2 py-0.5 text-xs font-semibold',
        bg,
        text,
        className
      )}
      aria-label={`${tier.charAt(0).toUpperCase() + tier.slice(1)} tier badge`}
    >
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
};
