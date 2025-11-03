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

export const getUserDisplayName = (
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null,
): string => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`.trim();
  }
  return email || 'Unknown';
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

/**
 * 한국어 형식으로 날짜를 포맷합니다 (YYYY-MM-DD)
 * @param date - 날짜 문자열, Date 객체, 또는 null/undefined
 * @returns 포맷된 날짜 문자열 또는 "YYYY-MM-DD" (날짜가 없을 경우)
 */
export const formatDateKorean = (date: string | null | undefined): string => {
  if (!date) return 'YYYY-MM-DD';
  try {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return 'YYYY-MM-DD';
  }
};

/**
 * 날짜에 일수를 더한 날짜를 반환합니다
 * @param date - 기준 날짜 (문자열, Date 객체, 또는 null/undefined)
 * @param days - 더할 일수 (기본값: 0)
 * @returns 포맷된 날짜 문자열 또는 "YYYY-MM-DD" (날짜가 없을 경우)
 */
export const addDaysToDate = (date: string | null | undefined, days: number = 0): string => {
  if (!date) return 'YYYY-MM-DD';
  try {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + days);
    return dateObj.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return 'YYYY-MM-DD';
  }
};

export const formatPrice = (price: string | number) => {
  return Number.parseInt(price.toString()).toLocaleString('en-US');
};

export const timeAgo = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 1) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  } else {
    return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
  }
};
