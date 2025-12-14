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
}
