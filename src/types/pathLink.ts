import type { LucideIcon } from 'lucide-react';

export interface PathLinkProps {
  name: string;
  path: string;
  icon: LucideIcon;
  submenu?: {
    name: string;
    path: string;
    icon?: LucideIcon;
  }[];
}
