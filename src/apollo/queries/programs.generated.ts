import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ProgramsQueryVariables = Types.Exact<{
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type ProgramsQuery = { __typename?: 'Query', programs?: { __typename?: 'PaginatedPrograms', count?: number | null, data?: Array<{ __typename?: 'Program', currency?: string | null, deadline?: any | null, description?: string | null, id?: string | null, name?: string | null, price?: string | null, status?: string | null, summary?: string | null }> | null } | null };


export const ProgramsDocument = gql`
    query programs($pagination: PaginationInput) {
  programs(pagination: $pagination) {
    count
    data {
      currency
      deadline
      description
      id
      name
      price
      status
      summary
    }
  }
}
    `;

/**
 * __useProgramsQuery__
 *
 * To run a query within a React component, call `useProgramsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProgramsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgramsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useProgramsQuery(baseOptions?: Apollo.QueryHookOptions<ProgramsQuery, ProgramsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProgramsQuery, ProgramsQueryVariables>(ProgramsDocument, options);
      }
export function useProgramsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgramsQuery, ProgramsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProgramsQuery, ProgramsQueryVariables>(ProgramsDocument, options);
        }
export function useProgramsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProgramsQuery, ProgramsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProgramsQuery, ProgramsQueryVariables>(ProgramsDocument, options);
        }
export type ProgramsQueryHookResult = ReturnType<typeof useProgramsQuery>;
export type ProgramsLazyQueryHookResult = ReturnType<typeof useProgramsLazyQuery>;
export type ProgramsSuspenseQueryHookResult = ReturnType<typeof useProgramsSuspenseQuery>;
export type ProgramsQueryResult = Apollo.QueryResult<ProgramsQuery, ProgramsQueryVariables>;