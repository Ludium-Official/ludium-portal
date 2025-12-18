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
