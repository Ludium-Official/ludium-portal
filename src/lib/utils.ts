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

  return user.firstName ?? user.lastName ?? user.email ?? '';
};

export const getUserDisplayName = (nickname?: string | null, email?: string | null): string => {
  if (nickname) {
    return nickname;
  }
  return email || 'Unknown';
};

export const getUserInitialName = (nickname?: string | null, email?: string | null): string => {
  const name = getUserDisplayName(nickname, email);

  if (!name) return '??';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name[0]?.toUpperCase() || '??';
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

export const formatDate = (date: Date | string, shortMonth = false) => {
  const dateObj = typeof date === 'string' ? fromUTCString(date) : date;
  if (!dateObj) return '';

  return format(dateObj, shortMonth ? 'MMM d, yyyy' : 'MMMM d, yyyy');
};

export const addDaysToDate = (date: string | null | undefined, days = 0): string => {
  if (!date) return 'YYYY-MM-DD';
  try {
    const localDate = fromUTCString(date);
    if (!localDate) return 'YYYY-MM-DD';
    localDate.setDate(localDate.getDate() + days);
    return localDate.toLocaleDateString([], {
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

export const toUTCString = (date: Date | string | null | undefined): string | undefined => {
  if (!date) return undefined;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
};

export const fromUTCString = (utcDateString: string | null | undefined): Date | null => {
  if (!utcDateString) return null;
  try {
    return new Date(utcDateString);
  } catch {
    return null;
  }
};

export const formatUTCDate = (utcDateString: string | null | undefined): string => {
  if (!utcDateString) return '';
  const localDate = fromUTCString(utcDateString);
  if (!localDate) return '';
  return format(localDate, 'MMMM d, yyyy');
};

export const formatUTCDateLocal = (utcDateString: string | null | undefined): string => {
  if (!utcDateString) return 'YYYY-MM-DD';
  const localDate = fromUTCString(utcDateString);
  if (!localDate) return 'YYYY-MM-DD';
  return localDate.toLocaleDateString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatUTCTime = (utcDateString: string | null | undefined): string => {
  if (!utcDateString) return '';
  const localDate = fromUTCString(utcDateString);
  if (!localDate) return '';
  return localDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatUTCDateTime = (utcDateString: string | null | undefined): string => {
  if (!utcDateString) return '';
  const localDate = fromUTCString(utcDateString);
  if (!localDate) return '';
  return localDate.toLocaleString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getFormattedTimezone = (): string => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offsetMinutes = new Date().getTimezoneOffset();
  const offsetHours = Math.abs(Math.floor(offsetMinutes / 60));
  const offsetMins = Math.abs(offsetMinutes % 60);
  const sign = offsetMinutes <= 0 ? '+' : '-';
  const gmtOffset = `GMT${sign}${String(offsetHours).padStart(2, '0')}:${String(
    offsetMins,
  ).padStart(2, '0')}`;

  // Extract city name from timezone (e.g., "Asia/Seoul" -> "Seoul")
  const city = timeZone.split('/').pop()?.replace(/_/g, ' ') || '';

  // Get long timezone name
  const longName =
    new Intl.DateTimeFormat('en', {
      timeZone,
      timeZoneName: 'long',
    })
      .formatToParts(new Date())
      .find((part) => part.type === 'timeZoneName')?.value || '';

  return `(${gmtOffset}) ${longName} - ${city}`;
};

export const getBrowserTimezone = <T extends { label: string; value: string }>(
  timezoneOptions: T[],
): T | undefined => {
  if (timezoneOptions.length === 0) return undefined;

  const ianaTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const cityName = ianaTimezone.split('/').pop()?.replace(/_/g, ' ');

  if (cityName) {
    const matchByCity = timezoneOptions.find((tz) =>
      tz.label.toLowerCase().includes(cityName.toLowerCase()),
    );
    if (matchByCity) return matchByCity;
  }

  const browserTz = getFormattedTimezone();
  const matchByValue = timezoneOptions.find((tz) => tz.value === browserTz);
  if (matchByValue) return matchByValue;

  const offsetMatch = browserTz.match(/\(GMT[+-]\d{2}:\d{2}\)/);
  if (offsetMatch) {
    const matchByOffset = timezoneOptions.find((tz) => tz.value.startsWith(offsetMatch[0]));
    if (matchByOffset) return matchByOffset;
  }

  return undefined;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
