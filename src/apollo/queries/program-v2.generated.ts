import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ProgramV2QueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ProgramV2Query = { __typename?: 'Query', programV2?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, skills?: Array<string> | null, deadline?: any | null, invitedMembers?: Array<string> | null, status?: Types.ProgramStatusV2 | null, visibility?: Types.ProgramVisibilityV2 | null, network?: string | null, price?: string | null, currency?: string | null, createdAt?: any | null, updatedAt?: any | null } | null };


export const ProgramV2Document = gql`
    query programV2($id: ID!) {
  programV2(id: $id) {
    id
    title
    description
    skills
    deadline
    invitedMembers
    status
    visibility
    network
    price
    currency
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useProgramV2Query__
 *
 * To run a query within a React component, call `useProgramV2Query` and pass it any options that fit your needs.
 * When your component renders, `useProgramV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgramV2Query({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProgramV2Query(baseOptions: Apollo.QueryHookOptions<ProgramV2Query, ProgramV2QueryVariables> & ({ variables: ProgramV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProgramV2Query, ProgramV2QueryVariables>(ProgramV2Document, options);
      }
export function useProgramV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgramV2Query, ProgramV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProgramV2Query, ProgramV2QueryVariables>(ProgramV2Document, options);
        }
export function useProgramV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProgramV2Query, ProgramV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProgramV2Query, ProgramV2QueryVariables>(ProgramV2Document, options);
        }
export type ProgramV2QueryHookResult = ReturnType<typeof useProgramV2Query>;
export type ProgramV2LazyQueryHookResult = ReturnType<typeof useProgramV2LazyQuery>;
export type ProgramV2SuspenseQueryHookResult = ReturnType<typeof useProgramV2SuspenseQuery>;
export type ProgramV2QueryResult = Apollo.QueryResult<ProgramV2Query, ProgramV2QueryVariables>;