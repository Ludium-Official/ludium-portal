import type { HiringActivityProgramsQuery } from '@/apollo/queries/hiring-activity-v2.generated';
import type { JobActivityProgramsQuery } from '@/apollo/queries/job-activity-v2.generated';

export type SponsorHiringActivityFilter = 'all' | 'open' | 'ongoing' | 'completed';

export type BuilderHiringActivityFilter = 'applied' | 'ongoing' | 'completed';

export interface HiringActivityFilterOption {
  key: SponsorHiringActivityFilter | BuilderHiringActivityFilter;
  label: string;
  dotColor: string;
}

export type SponsorProgramData = NonNullable<
  NonNullable<HiringActivityProgramsQuery['hiringActivityPrograms']>['data']
>[number];

export type BuilderProgramData = NonNullable<
  NonNullable<JobActivityProgramsQuery['jobActivityPrograms']>['data']
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
