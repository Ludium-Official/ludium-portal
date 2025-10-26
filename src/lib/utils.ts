import { currencies, currencyIcons } from '@/constant/currencies';
import {
  type Application,
  type Milestone,
  type Program,
  ProgramStatus,
  type User,
} from '@/types/types.generated';
import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatStatus = (status?: string | null) => {
  if (!status) return '';
  return `${status[0].toUpperCase()}${status.slice(1)}`.replace('_', ' ');
};

export function formatProgramStatus(program?: Program | null) {
  if (!program?.status) return '';
  if (program.status === ProgramStatus.Pending) return 'Not confirmed';
  return formatStatus(program.status);
}

export function formatApplicationStatus(application?: Application | null) {
  return formatStatus(application?.status);
}

export function formatMilestoneStatus(milestone?: Milestone | null) {
  return formatStatus(milestone?.status);
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export const reduceString = (str: string, from: number, end: number): string => {
  if (!str) return '-';
  if (str.length <= from + end) return str;
  return `${str.substring(0, from)}...${str.substring(str.length - end)}`;
};

export const commaNumber = (num: number | string) => {
  const numStr = num.toString();
  const [integer, decimal] = numStr.split('.');
  const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decimal ? `${formattedInt}.${decimal}` : formattedInt;
};

export const getUserName = (user?: User | null) => {
  if (!user) return '';

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  return user.firstName ?? user.lastName ?? user.email ?? user.organizationName ?? '';
};

export const mainnetDefaultNetwork =
  import.meta.env.VITE_VERCEL_ENVIRONMENT === 'mainnet' ? 'educhain' : 'educhain-testnet';

export const getCurrency = (network?: string | null) => {
  return currencies.find((c) => c.code === network);
};

export const getCurrencyIcon = (currency?: string | null) => {
  return currency ? currencyIcons[currency as keyof typeof currencyIcons] : null;
};

// Helper function to sort tierSettings entries
// By default sorts in reverse order: platinum, gold, silver, bronze
// Pass reverse=false to sort in ascending order: bronze, silver, gold, platinum
export const sortTierSettings = (
  tierSettings: Record<string, { enabled: boolean; maxAmount?: number }>,
  reverse = true,
) => {
  const TIER_ORDER = ['bronze', 'silver', 'gold', 'platinum'];
  const tierOrder = reverse ? [...TIER_ORDER].reverse() : TIER_ORDER;

  return Object.entries(tierSettings).sort(([keyA], [keyB]) => {
    const indexA = tierOrder.indexOf(keyA);
    const indexB = tierOrder.indexOf(keyB);
    return indexA - indexB;
  });
};

const userAgent = navigator.userAgent || navigator.vendor;
export const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
  userAgent,
);

export const dDay = (deadline: Date) => {
  const deadlineDate = new Date(deadline);
  const today = new Date();

  deadlineDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return `D-${daysRemaining}`;
};

export const formatDate = (date: Date | string) => {
  return format(new Date(date), 'MMMM d, yyyy');
};

// Format price with thousands separator
export const formatPrice = (price: string | number) => {
  return Number.parseInt(price.toString()).toLocaleString('en-US');
};
