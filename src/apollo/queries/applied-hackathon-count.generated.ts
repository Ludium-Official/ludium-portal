import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AppliedHackathonCountQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AppliedHackathonCountQuery = { __typename?: 'Query', appliedHackathonCount?: number | null };


export const AppliedHackathonCountDocument = gql`
    query appliedHackathonCount {
  appliedHackathonCount
}
    `;

/**
 * __useAppliedHackathonCountQuery__
 *
 * To run a query within a React component, call `useAppliedHackathonCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppliedHackathonCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppliedHackathonCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useAppliedHackathonCountQuery(baseOptions?: Apollo.QueryHookOptions<AppliedHackathonCountQuery, AppliedHackathonCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AppliedHackathonCountQuery, AppliedHackathonCountQueryVariables>(AppliedHackathonCountDocument, options);
      }
export function useAppliedHackathonCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AppliedHackathonCountQuery, AppliedHackathonCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AppliedHackathonCountQuery, AppliedHackathonCountQueryVariables>(AppliedHackathonCountDocument, options);
        }
export function useAppliedHackathonCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AppliedHackathonCountQuery, AppliedHackathonCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AppliedHackathonCountQuery, AppliedHackathonCountQueryVariables>(AppliedHackathonCountDocument, options);
        }
export type AppliedHackathonCountQueryHookResult = ReturnType<typeof useAppliedHackathonCountQuery>;
export type AppliedHackathonCountLazyQueryHookResult = ReturnType<typeof useAppliedHackathonCountLazyQuery>;
export type AppliedHackathonCountSuspenseQueryHookResult = ReturnType<typeof useAppliedHackathonCountSuspenseQuery>;
export type AppliedHackathonCountQueryResult = Apollo.QueryResult<AppliedHackathonCountQuery, AppliedHackathonCountQueryVariables>;