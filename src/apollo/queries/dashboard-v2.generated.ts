import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HiringActivityQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type HiringActivityQuery = { __typename?: 'Query', hiringActivity?: { __typename?: 'SponsorHiringActivity', openPrograms?: number | null, ongoingPrograms?: number | null } | null };

export type JobActivityQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type JobActivityQuery = { __typename?: 'Query', jobActivity?: { __typename?: 'BuilderJobActivity', appliedPrograms?: number | null, ongoingPrograms?: number | null } | null };

export type SponsorPaymentOverviewQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type SponsorPaymentOverviewQuery = { __typename?: 'Query', sponsorPaymentOverview?: Array<{ __typename?: 'PaymentWeek', label?: string | null, budget?: string | null }> | null };

export type BuilderPaymentOverviewQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type BuilderPaymentOverviewQuery = { __typename?: 'Query', builderPaymentOverview?: Array<{ __typename?: 'PaymentWeek', label?: string | null, budget?: string | null }> | null };


export const HiringActivityDocument = gql`
    query hiringActivity {
  hiringActivity {
    openPrograms
    ongoingPrograms
  }
}
    `;

/**
 * __useHiringActivityQuery__
 *
 * To run a query within a React component, call `useHiringActivityQuery` and pass it any options that fit your needs.
 * When your component renders, `useHiringActivityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHiringActivityQuery({
 *   variables: {
 *   },
 * });
 */
export function useHiringActivityQuery(baseOptions?: Apollo.QueryHookOptions<HiringActivityQuery, HiringActivityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HiringActivityQuery, HiringActivityQueryVariables>(HiringActivityDocument, options);
      }
export function useHiringActivityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HiringActivityQuery, HiringActivityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HiringActivityQuery, HiringActivityQueryVariables>(HiringActivityDocument, options);
        }
export function useHiringActivitySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HiringActivityQuery, HiringActivityQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HiringActivityQuery, HiringActivityQueryVariables>(HiringActivityDocument, options);
        }
export type HiringActivityQueryHookResult = ReturnType<typeof useHiringActivityQuery>;
export type HiringActivityLazyQueryHookResult = ReturnType<typeof useHiringActivityLazyQuery>;
export type HiringActivitySuspenseQueryHookResult = ReturnType<typeof useHiringActivitySuspenseQuery>;
export type HiringActivityQueryResult = Apollo.QueryResult<HiringActivityQuery, HiringActivityQueryVariables>;
export const JobActivityDocument = gql`
    query jobActivity {
  jobActivity {
    appliedPrograms
    ongoingPrograms
  }
}
    `;

/**
 * __useJobActivityQuery__
 *
 * To run a query within a React component, call `useJobActivityQuery` and pass it any options that fit your needs.
 * When your component renders, `useJobActivityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useJobActivityQuery({
 *   variables: {
 *   },
 * });
 */
export function useJobActivityQuery(baseOptions?: Apollo.QueryHookOptions<JobActivityQuery, JobActivityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<JobActivityQuery, JobActivityQueryVariables>(JobActivityDocument, options);
      }
export function useJobActivityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<JobActivityQuery, JobActivityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<JobActivityQuery, JobActivityQueryVariables>(JobActivityDocument, options);
        }
export function useJobActivitySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<JobActivityQuery, JobActivityQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<JobActivityQuery, JobActivityQueryVariables>(JobActivityDocument, options);
        }
export type JobActivityQueryHookResult = ReturnType<typeof useJobActivityQuery>;
export type JobActivityLazyQueryHookResult = ReturnType<typeof useJobActivityLazyQuery>;
export type JobActivitySuspenseQueryHookResult = ReturnType<typeof useJobActivitySuspenseQuery>;
export type JobActivityQueryResult = Apollo.QueryResult<JobActivityQuery, JobActivityQueryVariables>;
export const SponsorPaymentOverviewDocument = gql`
    query sponsorPaymentOverview {
  sponsorPaymentOverview {
    label
    budget
  }
}
    `;

/**
 * __useSponsorPaymentOverviewQuery__
 *
 * To run a query within a React component, call `useSponsorPaymentOverviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useSponsorPaymentOverviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSponsorPaymentOverviewQuery({
 *   variables: {
 *   },
 * });
 */
export function useSponsorPaymentOverviewQuery(baseOptions?: Apollo.QueryHookOptions<SponsorPaymentOverviewQuery, SponsorPaymentOverviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SponsorPaymentOverviewQuery, SponsorPaymentOverviewQueryVariables>(SponsorPaymentOverviewDocument, options);
      }
export function useSponsorPaymentOverviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SponsorPaymentOverviewQuery, SponsorPaymentOverviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SponsorPaymentOverviewQuery, SponsorPaymentOverviewQueryVariables>(SponsorPaymentOverviewDocument, options);
        }
export function useSponsorPaymentOverviewSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SponsorPaymentOverviewQuery, SponsorPaymentOverviewQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SponsorPaymentOverviewQuery, SponsorPaymentOverviewQueryVariables>(SponsorPaymentOverviewDocument, options);
        }
export type SponsorPaymentOverviewQueryHookResult = ReturnType<typeof useSponsorPaymentOverviewQuery>;
export type SponsorPaymentOverviewLazyQueryHookResult = ReturnType<typeof useSponsorPaymentOverviewLazyQuery>;
export type SponsorPaymentOverviewSuspenseQueryHookResult = ReturnType<typeof useSponsorPaymentOverviewSuspenseQuery>;
export type SponsorPaymentOverviewQueryResult = Apollo.QueryResult<SponsorPaymentOverviewQuery, SponsorPaymentOverviewQueryVariables>;
export const BuilderPaymentOverviewDocument = gql`
    query builderPaymentOverview {
  builderPaymentOverview {
    label
    budget
  }
}
    `;

/**
 * __useBuilderPaymentOverviewQuery__
 *
 * To run a query within a React component, call `useBuilderPaymentOverviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useBuilderPaymentOverviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBuilderPaymentOverviewQuery({
 *   variables: {
 *   },
 * });
 */
export function useBuilderPaymentOverviewQuery(baseOptions?: Apollo.QueryHookOptions<BuilderPaymentOverviewQuery, BuilderPaymentOverviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BuilderPaymentOverviewQuery, BuilderPaymentOverviewQueryVariables>(BuilderPaymentOverviewDocument, options);
      }
export function useBuilderPaymentOverviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BuilderPaymentOverviewQuery, BuilderPaymentOverviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BuilderPaymentOverviewQuery, BuilderPaymentOverviewQueryVariables>(BuilderPaymentOverviewDocument, options);
        }
export function useBuilderPaymentOverviewSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BuilderPaymentOverviewQuery, BuilderPaymentOverviewQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BuilderPaymentOverviewQuery, BuilderPaymentOverviewQueryVariables>(BuilderPaymentOverviewDocument, options);
        }
export type BuilderPaymentOverviewQueryHookResult = ReturnType<typeof useBuilderPaymentOverviewQuery>;
export type BuilderPaymentOverviewLazyQueryHookResult = ReturnType<typeof useBuilderPaymentOverviewLazyQuery>;
export type BuilderPaymentOverviewSuspenseQueryHookResult = ReturnType<typeof useBuilderPaymentOverviewSuspenseQuery>;
export type BuilderPaymentOverviewQueryResult = Apollo.QueryResult<BuilderPaymentOverviewQuery, BuilderPaymentOverviewQueryVariables>;