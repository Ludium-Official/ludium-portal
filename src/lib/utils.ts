import { currencies, currencyIcons } from '@/constant/currencies';
import type { Application, Milestone, Program, User } from '@/types/types.generated';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatProgramStatus(program?: Program | null) {
  if (!program?.status) return '';
  return `${program?.status?.[0].toUpperCase()}${program?.status?.slice(1)}`.replace('_', ' ');
}

export function formatApplicationStatus(application?: Application | null) {
  if (!application?.status) return '';
  return `${application?.status?.[0].toUpperCase()}${application?.status?.slice(1)}`.replace(
    '_',
    ' ',
  );
}

export function formatMilestoneStatus(milestone?: Milestone | null) {
  if (!milestone?.status) return '';
  return `${milestone?.status?.[0].toUpperCase()}${milestone?.status?.slice(1)}`.replace('_', ' ');
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export const reduceString = (str: string, from: number, end: number): string => {
  return str ? `${str.substring(0, from)}...${str.substring(str.length - end)}` : '-';
};

export const commaNumber = (num: number | string) => {
  const [integer, decimal] = num.toString().split('.');
  const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decimal ? `${formattedInt}.${decimal}` : formattedInt;
};

export const getUserName = (user?: User | null) => {
  return user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : (user?.firstName ?? user?.lastName ?? user?.email ?? user?.organizationName ?? '');
};

export const mainnetDefaultNetwork =
  import.meta.env.VITE_VERCEL_ENVIRONMENT === 'mainnet' ? 'educhain' : 'educhain-testnet';

export const getCurrency = (network?: string | null) => {
  return currencies.find((c) => c.code === network);
};

export const getCurrencyIcon = (currency?: string | null) => {
  return currency ? currencyIcons[currency as keyof typeof currencyIcons] : null;
};
