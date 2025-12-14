import { GetProgramsBySponsorV2Query } from '@/apollo/queries/get-programs-by-sponser.generated';

export type SponsorHiringActivityFilter = 'all' | 'open' | 'ongoing' | 'completed';

export type BuilderHiringActivityFilter = 'applied' | 'ongoing' | 'completed';

export interface HiringActivityFilterOption {
  key: SponsorHiringActivityFilter | BuilderHiringActivityFilter;
  label: string;
  dotColor: string;
}

export type SponsorProgramData = NonNullable<
  NonNullable<GetProgramsBySponsorV2Query['programsBysponsorIdV2']>['data']
>[number];

export interface MyJobPostsTableProps {
  activityFilter: HiringActivityFilterOption;
  programs: SponsorProgramData[];
  totalCount: number;
  loading: boolean;
  error?: Error | null;
  onRefetch?: () => void;
  variant: 'sponsor' | 'builder';
}

// Hired Builders Types
export type HiredBuilderStatus = 'in_progress' | 'completed';

export interface HiredBuilder {
  id: string;
  name: string;
  role: string;
  profileImage?: string;
  status: HiredBuilderStatus;
  milestones: number;
  paidAmount: string;
  totalAmount: string;
  tokenId: string;
}

// Milestone Progress Types
export interface MilestoneProgressData {
  completed: number;
  total: number;
}

// Upcoming Payments Types
export interface PaymentItem {
  id: string;
  dueDate: string;
  amount: string;
  tokenId: string;
}

export interface BuilderPayments {
  builder: {
    id: string;
    name: string;
    profileImage?: string;
  };
  payments: PaymentItem[];
}
