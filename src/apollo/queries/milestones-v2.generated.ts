import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetMilestonesV2QueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.MilestonesV2QueryInput>;
}>;


export type GetMilestonesV2Query = { __typename?: 'Query', milestonesV2?: { __typename?: 'PaginatedMilestonesV2', count?: number | null, currentPage?: number | null, totalPages?: number | null, hasNextPage?: boolean | null, hasPreviousPage?: boolean | null, data?: Array<{ __typename?: 'MilestoneV2', id?: string | null, title?: string | null, description?: string | null, payout?: string | null, deadline?: any | null, createdAt?: any | null, updatedAt?: any | null, status?: Types.MilestoneStatusV2 | null, applicant?: { __typename?: 'UserV2', id?: string | null, walletAddress?: string | null, email?: string | null, nickname?: string | null, profileImage?: string | null } | null, program?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, price?: string | null, deadline?: any | null, status?: Types.ProgramStatusV2 | null } | null }> | null } | null };


export const GetMilestonesV2Document = gql`
    query GetMilestonesV2($query: MilestonesV2QueryInput) {
  milestonesV2(query: $query) {
    count
    currentPage
    totalPages
    hasNextPage
    hasPreviousPage
    data {
      id
      title
      description
      payout
      deadline
      createdAt
      updatedAt
      status
      applicant {
        id
        walletAddress
        email
        nickname
        profileImage
      }
      program {
        id
        title
        description
        price
        deadline
        status
      }
    }
  }
}
    `;

/**
 * __useGetMilestonesV2Query__
 *
 * To run a query within a React component, call `useGetMilestonesV2Query` and pass it any options that fit your needs.
 * When your component renders, `useGetMilestonesV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMilestonesV2Query({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useGetMilestonesV2Query(baseOptions?: Apollo.QueryHookOptions<GetMilestonesV2Query, GetMilestonesV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMilestonesV2Query, GetMilestonesV2QueryVariables>(GetMilestonesV2Document, options);
      }
export function useGetMilestonesV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMilestonesV2Query, GetMilestonesV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMilestonesV2Query, GetMilestonesV2QueryVariables>(GetMilestonesV2Document, options);
        }
export function useGetMilestonesV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMilestonesV2Query, GetMilestonesV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMilestonesV2Query, GetMilestonesV2QueryVariables>(GetMilestonesV2Document, options);
        }
export type GetMilestonesV2QueryHookResult = ReturnType<typeof useGetMilestonesV2Query>;
export type GetMilestonesV2LazyQueryHookResult = ReturnType<typeof useGetMilestonesV2LazyQuery>;
export type GetMilestonesV2SuspenseQueryHookResult = ReturnType<typeof useGetMilestonesV2SuspenseQuery>;
export type GetMilestonesV2QueryResult = Apollo.QueryResult<GetMilestonesV2Query, GetMilestonesV2QueryVariables>;