import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ProgramsV2QueryVariables = Types.Exact<{
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type ProgramsV2Query = { __typename?: 'Query', programsV2?: { __typename?: 'PaginatedProgramsV2', count?: number | null, data?: Array<{ __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, skills?: Array<string> | null, deadline?: any | null, invitedMembers?: Array<string> | null, status?: Types.ProgramStatusV2 | null, visibility?: Types.ProgramVisibilityV2 | null, networkId?: number | null, price?: string | null, token_id?: number | null, createdAt?: any | null, updatedAt?: any | null }> | null } | null };


export const ProgramsV2Document = gql`
    query programsV2($pagination: PaginationInput) {
  programsV2(pagination: $pagination) {
    data {
      id
      title
      description
      skills
      deadline
      invitedMembers
      status
      visibility
      networkId
      price
      token_id
      createdAt
      updatedAt
    }
    count
  }
}
    `;

/**
 * __useProgramsV2Query__
 *
 * To run a query within a React component, call `useProgramsV2Query` and pass it any options that fit your needs.
 * When your component renders, `useProgramsV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgramsV2Query({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useProgramsV2Query(baseOptions?: Apollo.QueryHookOptions<ProgramsV2Query, ProgramsV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProgramsV2Query, ProgramsV2QueryVariables>(ProgramsV2Document, options);
      }
export function useProgramsV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgramsV2Query, ProgramsV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProgramsV2Query, ProgramsV2QueryVariables>(ProgramsV2Document, options);
        }
export function useProgramsV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProgramsV2Query, ProgramsV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProgramsV2Query, ProgramsV2QueryVariables>(ProgramsV2Document, options);
        }
export type ProgramsV2QueryHookResult = ReturnType<typeof useProgramsV2Query>;
export type ProgramsV2LazyQueryHookResult = ReturnType<typeof useProgramsV2LazyQuery>;
export type ProgramsV2SuspenseQueryHookResult = ReturnType<typeof useProgramsV2SuspenseQuery>;
export type ProgramsV2QueryResult = Apollo.QueryResult<ProgramsV2Query, ProgramsV2QueryVariables>;