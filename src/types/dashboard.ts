import { HiringActivityV2Query } from '@/apollo/queries/hiring-activity-v2.generated';
import { JobActivityV2Query } from '@/apollo/queries/job-activity-v2.generated';

export type SponsorHiringActivityFilter = 'all' | 'open' | 'ongoing' | 'completed';

export type BuilderHiringActivityFilter = 'applied' | 'ongoing' | 'completed';

export interface HiringActivityFilterOption {
  key: SponsorHiringActivityFilter | BuilderHiringActivityFilter;
  label: string;
  dotColor: string;
}

export type SponsorProgramData = NonNullable<
  NonNullable<NonNullable<HiringActivityV2Query['hiringActivityV2']>['programs']>['data']
>[number];

export type BuilderProgramData = NonNullable<
  NonNullable<NonNullable<JobActivityV2Query['jobActivityV2']>['programs']>['data']
>[number];

export type ProgramData = SponsorProgramData | BuilderProgramData;

export interface MyJobPostsTableProps {
  activityFilter: HiringActivityFilterOption;
  programs: ProgramData[];
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
