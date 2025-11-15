import github from '@/assets/icons/github.svg';
import linkedin from '@/assets/icons/linkedin.svg';
import twitter from '@/assets/icons/twitter.svg';

export const platformIcons: Record<string, { icon: string; alt: string }> = {
  twitter: { icon: twitter, alt: 'Twitter' },
  github: { icon: github, alt: 'GitHub' },
  linkedin: { icon: linkedin, alt: 'LinkedIn' },
};
export const statusColorMap: Record<string, string> = {
  'Not confirmed': 'bg-gray-400',
  Confirmed: 'bg-green-400',
  Published: 'bg-cyan-400',
  'Payment required': 'bg-blue-400',
  Completed: 'bg-purple-500',
  Refund: 'bg-red-500',
};
export const statusHostColorMap: Record<string, string> = {
  Ready: 'bg-gray-400',
  'Application ongoing': 'bg-green-400',
  'Funding ongoing': 'bg-cyan-400',
  'Project ongoing': 'bg-blue-400',
  'Program completed': 'bg-purple-500',
  Refund: 'bg-red-500',
};
export const statusInvestmentColorMap: Record<string, string> = {
  Ready: 'bg-gray-400',
  'Funding ongoing': 'bg-cyan-400',
  'Project ongoing': 'bg-blue-400',
  'Project completed': 'bg-purple-500',
  'Project failed': 'bg-red-500',
};
export const statuses = [
  { label: 'Not confirmed', sponsor: 0, validator: 2, builder: 20 },
  { label: 'Confirmed', sponsor: 0, validator: 2, builder: 20 },
  { label: 'Published', sponsor: 3, validator: 1, builder: 5 },
  { label: 'Payment required', sponsor: 0, validator: 10, builder: 12 },
  { label: 'Completed', sponsor: 10, validator: 0, builder: 56 },
  { label: 'Refund', sponsor: 0, validator: null, builder: 5 },
];

export const investmentStatuses = [
  { label: 'Ready', project: 2, supporter: 20 },
  { label: 'Funding ongoing', project: 2, supporter: 20 },
  { label: 'Project ongoing', project: 1, supporter: 5 },
  { label: 'Project completed', project: 10, supporter: 12 },
  { label: 'Project failed', project: 0, supporter: 56 },
];

export const hostStatuses = [
  { label: 'Ready', host: 2 },
  { label: 'Application ongoing', host: 2 },
  { label: 'Funding ongoing', host: 2 },
  { label: 'Project ongoing', host: 1 },
  { label: 'Program completed', host: 10 },
  { label: 'Refund', host: 0 },
];
