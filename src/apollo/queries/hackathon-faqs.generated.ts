import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HackathonFaqsQueryVariables = Types.Exact<{
  hackathonId: Types.Scalars['ID']['input'];
}>;


export type HackathonFaqsQuery = { __typename?: 'Query', hackathonFaqs?: Array<{ __typename?: 'HackathonFaq', id?: string | null, hackathonId?: string | null, title?: string | null, description?: string | null, sortOrder?: number | null, createdAt?: any | null, updatedAt?: any | null }> | null };


export const HackathonFaqsDocument = gql`
    query hackathonFaqs($hackathonId: ID!) {
  hackathonFaqs(hackathonId: $hackathonId) {
    id
    hackathonId
    title
    description
    sortOrder
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useHackathonFaqsQuery__
 *
 * To run a query within a React component, call `useHackathonFaqsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHackathonFaqsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHackathonFaqsQuery({
 *   variables: {
 *      hackathonId: // value for 'hackathonId'
 *   },
 * });
 */
export function useHackathonFaqsQuery(baseOptions: Apollo.QueryHookOptions<HackathonFaqsQuery, HackathonFaqsQueryVariables> & ({ variables: HackathonFaqsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HackathonFaqsQuery, HackathonFaqsQueryVariables>(HackathonFaqsDocument, options);
      }
export function useHackathonFaqsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HackathonFaqsQuery, HackathonFaqsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HackathonFaqsQuery, HackathonFaqsQueryVariables>(HackathonFaqsDocument, options);
        }
export function useHackathonFaqsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HackathonFaqsQuery, HackathonFaqsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HackathonFaqsQuery, HackathonFaqsQueryVariables>(HackathonFaqsDocument, options);
        }
export type HackathonFaqsQueryHookResult = ReturnType<typeof useHackathonFaqsQuery>;
export type HackathonFaqsLazyQueryHookResult = ReturnType<typeof useHackathonFaqsLazyQuery>;
export type HackathonFaqsSuspenseQueryHookResult = ReturnType<typeof useHackathonFaqsSuspenseQuery>;
export type HackathonFaqsQueryResult = Apollo.QueryResult<HackathonFaqsQuery, HackathonFaqsQueryVariables>;