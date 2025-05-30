import type { Program } from '@/types/types.generated';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatProgramStatus(program?: Program | null) {
  if (!program?.status) return '';
  return `${program?.status?.[0].toUpperCase()}${program?.status?.slice(1)}`.replace('_', ' ');
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export const reduceString = (str: string, from: number, end: number): string => {
  return str ? str.substring(0, from) + '...' + str.substring(str.length - end) : '-';
};

export const commaNumber = (num: number | string) => {
  const [integer, decimal] = num.toString().split('.');
  const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decimal ? `${formattedInt}.${decimal}` : formattedInt;
};
