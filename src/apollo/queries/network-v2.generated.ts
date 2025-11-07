import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NetworkV2QueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type NetworkV2Query = { __typename?: 'Query', networkV2?: { __typename?: 'NetworkV2', id?: string | null, chainId?: number | null, chainName?: string | null, mainnet?: boolean | null, exploreUrl?: string | null } | null };


export const NetworkV2Document = gql`
    query networkV2($id: ID!) {
  networkV2(id: $id) {
    id
    chainId
    chainName
    mainnet
    exploreUrl
  }
}
    `;

/**
 * __useNetworkV2Query__
 *
 * To run a query within a React component, call `useNetworkV2Query` and pass it any options that fit your needs.
 * When your component renders, `useNetworkV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNetworkV2Query({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useNetworkV2Query(baseOptions: Apollo.QueryHookOptions<NetworkV2Query, NetworkV2QueryVariables> & ({ variables: NetworkV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NetworkV2Query, NetworkV2QueryVariables>(NetworkV2Document, options);
      }
export function useNetworkV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NetworkV2Query, NetworkV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NetworkV2Query, NetworkV2QueryVariables>(NetworkV2Document, options);
        }
export function useNetworkV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NetworkV2Query, NetworkV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NetworkV2Query, NetworkV2QueryVariables>(NetworkV2Document, options);
        }
export type NetworkV2QueryHookResult = ReturnType<typeof useNetworkV2Query>;
export type NetworkV2LazyQueryHookResult = ReturnType<typeof useNetworkV2LazyQuery>;
export type NetworkV2SuspenseQueryHookResult = ReturnType<typeof useNetworkV2SuspenseQuery>;
export type NetworkV2QueryResult = Apollo.QueryResult<NetworkV2Query, NetworkV2QueryVariables>;