import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type OnchainProgramInfoV2QueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type OnchainProgramInfoV2Query = { __typename?: 'Query', onchainProgramInfoV2?: { __typename?: 'OnchainProgramInfoV2', id?: string | null, networkId?: number | null, smartContractId?: number | null, onchainProgramId?: number | null, status?: Types.OnchainProgramStatusV2 | null, createdAt?: any | null, tx?: string | null } | null };


export const OnchainProgramInfoV2Document = gql`
    query onchainProgramInfoV2($id: ID!) {
  onchainProgramInfoV2(id: $id) {
    id
    networkId
    smartContractId
    onchainProgramId
    status
    createdAt
    tx
  }
}
    `;

/**
 * __useOnchainProgramInfoV2Query__
 *
 * To run a query within a React component, call `useOnchainProgramInfoV2Query` and pass it any options that fit your needs.
 * When your component renders, `useOnchainProgramInfoV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnchainProgramInfoV2Query({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOnchainProgramInfoV2Query(baseOptions: Apollo.QueryHookOptions<OnchainProgramInfoV2Query, OnchainProgramInfoV2QueryVariables> & ({ variables: OnchainProgramInfoV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OnchainProgramInfoV2Query, OnchainProgramInfoV2QueryVariables>(OnchainProgramInfoV2Document, options);
      }
export function useOnchainProgramInfoV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OnchainProgramInfoV2Query, OnchainProgramInfoV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OnchainProgramInfoV2Query, OnchainProgramInfoV2QueryVariables>(OnchainProgramInfoV2Document, options);
        }
export function useOnchainProgramInfoV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<OnchainProgramInfoV2Query, OnchainProgramInfoV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OnchainProgramInfoV2Query, OnchainProgramInfoV2QueryVariables>(OnchainProgramInfoV2Document, options);
        }
export type OnchainProgramInfoV2QueryHookResult = ReturnType<typeof useOnchainProgramInfoV2Query>;
export type OnchainProgramInfoV2LazyQueryHookResult = ReturnType<typeof useOnchainProgramInfoV2LazyQuery>;
export type OnchainProgramInfoV2SuspenseQueryHookResult = ReturnType<typeof useOnchainProgramInfoV2SuspenseQuery>;
export type OnchainProgramInfoV2QueryResult = Apollo.QueryResult<OnchainProgramInfoV2Query, OnchainProgramInfoV2QueryVariables>;