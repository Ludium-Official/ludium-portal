import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TokensByNetworkV2QueryVariables = Types.Exact<{
  networkId: Types.Scalars['Int']['input'];
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type TokensByNetworkV2Query = { __typename?: 'Query', tokensByNetworkV2?: { __typename?: 'PaginatedTokensV2', count?: number | null, data?: Array<{ __typename?: 'TokenV2', id?: string | null, chainInfoId?: number | null, tokenName?: string | null, tokenAddress?: string | null }> | null } | null };


export const TokensByNetworkV2Document = gql`
    query tokensByNetworkV2($networkId: Int!, $pagination: PaginationInput) {
  tokensByNetworkV2(networkId: $networkId, pagination: $pagination) {
    data {
      id
      chainInfoId
      tokenName
      tokenAddress
    }
    count
  }
}
    `;

/**
 * __useTokensByNetworkV2Query__
 *
 * To run a query within a React component, call `useTokensByNetworkV2Query` and pass it any options that fit your needs.
 * When your component renders, `useTokensByNetworkV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokensByNetworkV2Query({
 *   variables: {
 *      networkId: // value for 'networkId'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useTokensByNetworkV2Query(baseOptions: Apollo.QueryHookOptions<TokensByNetworkV2Query, TokensByNetworkV2QueryVariables> & ({ variables: TokensByNetworkV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokensByNetworkV2Query, TokensByNetworkV2QueryVariables>(TokensByNetworkV2Document, options);
      }
export function useTokensByNetworkV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokensByNetworkV2Query, TokensByNetworkV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokensByNetworkV2Query, TokensByNetworkV2QueryVariables>(TokensByNetworkV2Document, options);
        }
export function useTokensByNetworkV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TokensByNetworkV2Query, TokensByNetworkV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TokensByNetworkV2Query, TokensByNetworkV2QueryVariables>(TokensByNetworkV2Document, options);
        }
export type TokensByNetworkV2QueryHookResult = ReturnType<typeof useTokensByNetworkV2Query>;
export type TokensByNetworkV2LazyQueryHookResult = ReturnType<typeof useTokensByNetworkV2LazyQuery>;
export type TokensByNetworkV2SuspenseQueryHookResult = ReturnType<typeof useTokensByNetworkV2SuspenseQuery>;
export type TokensByNetworkV2QueryResult = Apollo.QueryResult<TokensByNetworkV2Query, TokensByNetworkV2QueryVariables>;