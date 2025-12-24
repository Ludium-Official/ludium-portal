import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DashboardV2QueryVariables = Types.Exact<{ [key: string]: never; }>;


export type DashboardV2Query = { __typename?: 'Query', dashboardV2?: { __typename?: 'DashboardV2', hiringActivity?: { __typename?: 'SponsorHiringActivity', openPrograms?: number | null, ongoingPrograms?: number | null } | null, jobActivity?: { __typename?: 'BuilderJobActivity', appliedPrograms?: number | null, ongoingPrograms?: number | null } | null, sponsorPaymentOverview?: Array<{ __typename?: 'PaymentWeek', label?: string | null, budget?: string | null }> | null, builderPaymentOverview?: Array<{ __typename?: 'PaymentWeek', label?: string | null, budget?: string | null }> | null } | null };


export const DashboardV2Document = gql`
    query dashboardV2 {
  dashboardV2 {
    hiringActivity {
      openPrograms
      ongoingPrograms
    }
    jobActivity {
      appliedPrograms
      ongoingPrograms
    }
    sponsorPaymentOverview {
      label
      budget
    }
    builderPaymentOverview {
      label
      budget
    }
  }
}
    `;

/**
 * __useDashboardV2Query__
 *
 * To run a query within a React component, call `useDashboardV2Query` and pass it any options that fit your needs.
 * When your component renders, `useDashboardV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardV2Query({
 *   variables: {
 *   },
 * });
 */
export function useDashboardV2Query(baseOptions?: Apollo.QueryHookOptions<DashboardV2Query, DashboardV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DashboardV2Query, DashboardV2QueryVariables>(DashboardV2Document, options);
      }
export function useDashboardV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DashboardV2Query, DashboardV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DashboardV2Query, DashboardV2QueryVariables>(DashboardV2Document, options);
        }
export function useDashboardV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DashboardV2Query, DashboardV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DashboardV2Query, DashboardV2QueryVariables>(DashboardV2Document, options);
        }
export type DashboardV2QueryHookResult = ReturnType<typeof useDashboardV2Query>;
export type DashboardV2LazyQueryHookResult = ReturnType<typeof useDashboardV2LazyQuery>;
export type DashboardV2SuspenseQueryHookResult = ReturnType<typeof useDashboardV2SuspenseQuery>;
export type DashboardV2QueryResult = Apollo.QueryResult<DashboardV2Query, DashboardV2QueryVariables>;