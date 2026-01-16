import { CircleAlert, MessageCircle, Scroll, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  label: string;
  path: string;
  icon?: LucideIcon;
  submenu?: { label: string; path: string }[];
  external?: boolean;
}

export const getMenuItems = (isLoggedIn: boolean): MenuItem[] => [
  { label: 'Home', path: '/' },
  ...(isLoggedIn
    ? [
        {
          label: 'My Space',
          path: '/dashboard',
          icon: UserRound,
          submenu: [
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Profile', path: '/profile' },
            { label: 'Portfolio', path: '/portfolio' },
          ],
        },
      ]
    : []),
  {
    label: 'Program',
    path: '/programs',
    icon: Scroll,
    submenu: [{ label: 'Recruitment', path: '/programs/recruitment' }],
  },
  {
    label: 'Community',
    path: '/community',
    icon: MessageCircle,
    submenu: [
      { label: 'Articles', path: '/community/articles' },
      { label: 'Threads', path: '/community/threads' },
    ],
  },
];

export const aboutLink: MenuItem = {
  label: 'About',
  path: 'https://ludium.oopy.io/',
  icon: CircleAlert,
  external: true,
};
