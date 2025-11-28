import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NetworksV2QueryVariables = Types.Exact<{
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type NetworksV2Query = { __typename?: 'Query', networksV2?: { __typename?: 'PaginatedNetworksV2', count?: number | null, data?: Array<{ __typename?: 'NetworkV2', id?: string | null, chainId?: number | null, chainName?: string | null, mainnet?: boolean | null, exploreUrl?: string | null }> | null } | null };


export const NetworksV2Document = gql`
    query networksV2($pagination: PaginationInput) {
  networksV2(pagination: $pagination) {
    data {
      id
      chainId
      chainName
      mainnet
      exploreUrl
    }
    count
  }
}
    `;

/**
 * __useNetworksV2Query__
 *
 * To run a query within a React component, call `useNetworksV2Query` and pass it any options that fit your needs.
 * When your component renders, `useNetworksV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNetworksV2Query({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useNetworksV2Query(baseOptions?: Apollo.QueryHookOptions<NetworksV2Query, NetworksV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NetworksV2Query, NetworksV2QueryVariables>(NetworksV2Document, options);
      }
export function useNetworksV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NetworksV2Query, NetworksV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NetworksV2Query, NetworksV2QueryVariables>(NetworksV2Document, options);
        }
export function useNetworksV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NetworksV2Query, NetworksV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NetworksV2Query, NetworksV2QueryVariables>(NetworksV2Document, options);
        }
export type NetworksV2QueryHookResult = ReturnType<typeof useNetworksV2Query>;
export type NetworksV2LazyQueryHookResult = ReturnType<typeof useNetworksV2LazyQuery>;
export type NetworksV2SuspenseQueryHookResult = ReturnType<typeof useNetworksV2SuspenseQuery>;
export type NetworksV2QueryResult = Apollo.QueryResult<NetworksV2Query, NetworksV2QueryVariables>;