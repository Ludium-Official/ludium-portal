import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MilestoneProgressQueryVariables = Types.Exact<{
  input: Types.MilestoneProgressInput;
}>;


export type MilestoneProgressQuery = { __typename?: 'Query', milestoneProgress?: { __typename?: 'MilestoneProgress', completed?: number | null, total?: number | null } | null };

export type HiredBuildersQueryVariables = Types.Exact<{
  input: Types.HiredBuildersInput;
}>;


export type HiredBuildersQuery = { __typename?: 'Query', hiredBuilders?: { __typename?: 'PaginatedHiredBuilders', count?: number | null, data?: Array<{ __typename?: 'HiredBuilderV2', id?: number | null, nickname?: string | null, profileImage?: string | null, role?: string | null, status?: string | null, milestoneCount?: number | null, paidAmount?: string | null, totalAmount?: string | null, tokenId?: number | null }> | null } | null };

export type BuilderMilestonesQueryVariables = Types.Exact<{
  input: Types.BuilderMilestonesInput;
}>;


export type BuilderMilestonesQuery = { __typename?: 'Query', builderMilestones?: { __typename?: 'PaginatedBuilderMilestones', count?: number | null, data?: Array<{ __typename?: 'BuilderMilestoneV2', id?: string | null, title?: string | null, deadline?: any | null, status?: string | null, tokenId?: number | null, unpaidAmount?: string | null, paidAmount?: string | null }> | null } | null };

export type UpcomingPaymentsQueryVariables = Types.Exact<{
  input: Types.UpcomingPaymentsInput;
}>;


export type UpcomingPaymentsQuery = { __typename?: 'Query', upcomingPayments?: Array<{ __typename?: 'UpcomingPayment', builder?: { __typename?: 'BuilderInfo', nickname?: string | null, profileImage?: string | null } | null, payment?: Array<{ __typename?: 'PaymentInfo', payout?: string | null, deadline?: any | null, tokenId?: number | null }> | null }> | null };


export const MilestoneProgressDocument = gql`
    query milestoneProgress($input: MilestoneProgressInput!) {
  milestoneProgress(input: $input) {
    completed
    total
  }
}
    `;

/**
 * __useMilestoneProgressQuery__
 *
 * To run a query within a React component, call `useMilestoneProgressQuery` and pass it any options that fit your needs.
 * When your component renders, `useMilestoneProgressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMilestoneProgressQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMilestoneProgressQuery(baseOptions: Apollo.QueryHookOptions<MilestoneProgressQuery, MilestoneProgressQueryVariables> & ({ variables: MilestoneProgressQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MilestoneProgressQuery, MilestoneProgressQueryVariables>(MilestoneProgressDocument, options);
      }
export function useMilestoneProgressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MilestoneProgressQuery, MilestoneProgressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MilestoneProgressQuery, MilestoneProgressQueryVariables>(MilestoneProgressDocument, options);
        }
export function useMilestoneProgressSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MilestoneProgressQuery, MilestoneProgressQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MilestoneProgressQuery, MilestoneProgressQueryVariables>(MilestoneProgressDocument, options);
        }
export type MilestoneProgressQueryHookResult = ReturnType<typeof useMilestoneProgressQuery>;
export type MilestoneProgressLazyQueryHookResult = ReturnType<typeof useMilestoneProgressLazyQuery>;
export type MilestoneProgressSuspenseQueryHookResult = ReturnType<typeof useMilestoneProgressSuspenseQuery>;
export type MilestoneProgressQueryResult = Apollo.QueryResult<MilestoneProgressQuery, MilestoneProgressQueryVariables>;
export const HiredBuildersDocument = gql`
    query hiredBuilders($input: HiredBuildersInput!) {
  hiredBuilders(input: $input) {
    data {
      id
      nickname
      profileImage
      role
      status
      milestoneCount
      paidAmount
      totalAmount
      tokenId
    }
    count
  }
}
    `;

/**
 * __useHiredBuildersQuery__
 *
 * To run a query within a React component, call `useHiredBuildersQuery` and pass it any options that fit your needs.
 * When your component renders, `useHiredBuildersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHiredBuildersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useHiredBuildersQuery(baseOptions: Apollo.QueryHookOptions<HiredBuildersQuery, HiredBuildersQueryVariables> & ({ variables: HiredBuildersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HiredBuildersQuery, HiredBuildersQueryVariables>(HiredBuildersDocument, options);
      }
export function useHiredBuildersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HiredBuildersQuery, HiredBuildersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HiredBuildersQuery, HiredBuildersQueryVariables>(HiredBuildersDocument, options);
        }
export function useHiredBuildersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HiredBuildersQuery, HiredBuildersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HiredBuildersQuery, HiredBuildersQueryVariables>(HiredBuildersDocument, options);
        }
export type HiredBuildersQueryHookResult = ReturnType<typeof useHiredBuildersQuery>;
export type HiredBuildersLazyQueryHookResult = ReturnType<typeof useHiredBuildersLazyQuery>;
export type HiredBuildersSuspenseQueryHookResult = ReturnType<typeof useHiredBuildersSuspenseQuery>;
export type HiredBuildersQueryResult = Apollo.QueryResult<HiredBuildersQuery, HiredBuildersQueryVariables>;
export const BuilderMilestonesDocument = gql`
    query builderMilestones($input: BuilderMilestonesInput!) {
  builderMilestones(input: $input) {
    data {
      id
      title
      deadline
      status
      tokenId
      unpaidAmount
      paidAmount
    }
    count
  }
}
    `;

/**
 * __useBuilderMilestonesQuery__
 *
 * To run a query within a React component, call `useBuilderMilestonesQuery` and pass it any options that fit your needs.
 * When your component renders, `useBuilderMilestonesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBuilderMilestonesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useBuilderMilestonesQuery(baseOptions: Apollo.QueryHookOptions<BuilderMilestonesQuery, BuilderMilestonesQueryVariables> & ({ variables: BuilderMilestonesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BuilderMilestonesQuery, BuilderMilestonesQueryVariables>(BuilderMilestonesDocument, options);
      }
export function useBuilderMilestonesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BuilderMilestonesQuery, BuilderMilestonesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BuilderMilestonesQuery, BuilderMilestonesQueryVariables>(BuilderMilestonesDocument, options);
        }
export function useBuilderMilestonesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BuilderMilestonesQuery, BuilderMilestonesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BuilderMilestonesQuery, BuilderMilestonesQueryVariables>(BuilderMilestonesDocument, options);
        }
export type BuilderMilestonesQueryHookResult = ReturnType<typeof useBuilderMilestonesQuery>;
export type BuilderMilestonesLazyQueryHookResult = ReturnType<typeof useBuilderMilestonesLazyQuery>;
export type BuilderMilestonesSuspenseQueryHookResult = ReturnType<typeof useBuilderMilestonesSuspenseQuery>;
export type BuilderMilestonesQueryResult = Apollo.QueryResult<BuilderMilestonesQuery, BuilderMilestonesQueryVariables>;
export const UpcomingPaymentsDocument = gql`
    query upcomingPayments($input: UpcomingPaymentsInput!) {
  upcomingPayments(input: $input) {
    builder {
      nickname
      profileImage
    }
    payment {
      payout
      deadline
      tokenId
    }
  }
}
    `;

/**
 * __useUpcomingPaymentsQuery__
 *
 * To run a query within a React component, call `useUpcomingPaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpcomingPaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpcomingPaymentsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpcomingPaymentsQuery(baseOptions: Apollo.QueryHookOptions<UpcomingPaymentsQuery, UpcomingPaymentsQueryVariables> & ({ variables: UpcomingPaymentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UpcomingPaymentsQuery, UpcomingPaymentsQueryVariables>(UpcomingPaymentsDocument, options);
      }
export function useUpcomingPaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UpcomingPaymentsQuery, UpcomingPaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UpcomingPaymentsQuery, UpcomingPaymentsQueryVariables>(UpcomingPaymentsDocument, options);
        }
export function useUpcomingPaymentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UpcomingPaymentsQuery, UpcomingPaymentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UpcomingPaymentsQuery, UpcomingPaymentsQueryVariables>(UpcomingPaymentsDocument, options);
        }
export type UpcomingPaymentsQueryHookResult = ReturnType<typeof useUpcomingPaymentsQuery>;
export type UpcomingPaymentsLazyQueryHookResult = ReturnType<typeof useUpcomingPaymentsLazyQuery>;
export type UpcomingPaymentsSuspenseQueryHookResult = ReturnType<typeof useUpcomingPaymentsSuspenseQuery>;
export type UpcomingPaymentsQueryResult = Apollo.QueryResult<UpcomingPaymentsQuery, UpcomingPaymentsQueryVariables>;