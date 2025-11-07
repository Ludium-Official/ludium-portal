import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TokensV2QueryVariables = Types.Exact<{
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type TokensV2Query = { __typename?: 'Query', tokensV2?: { __typename?: 'PaginatedTokensV2', count?: number | null, data?: Array<{ __typename?: 'TokenV2', id?: string | null, chainInfoId?: number | null, tokenName?: string | null, tokenAddress?: string | null, decimals?: number | null }> | null } | null };


export const TokensV2Document = gql`
    query tokensV2($pagination: PaginationInput) {
  tokensV2(pagination: $pagination) {
    data {
      id
      chainInfoId
      tokenName
      tokenAddress
      decimals
    }
    count
  }
}
    `;

/**
 * __useTokensV2Query__
 *
 * To run a query within a React component, call `useTokensV2Query` and pass it any options that fit your needs.
 * When your component renders, `useTokensV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokensV2Query({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useTokensV2Query(baseOptions?: Apollo.QueryHookOptions<TokensV2Query, TokensV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokensV2Query, TokensV2QueryVariables>(TokensV2Document, options);
      }
export function useTokensV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokensV2Query, TokensV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokensV2Query, TokensV2QueryVariables>(TokensV2Document, options);
        }
export function useTokensV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TokensV2Query, TokensV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TokensV2Query, TokensV2QueryVariables>(TokensV2Document, options);
        }
export type TokensV2QueryHookResult = ReturnType<typeof useTokensV2Query>;
export type TokensV2LazyQueryHookResult = ReturnType<typeof useTokensV2LazyQuery>;
export type TokensV2SuspenseQueryHookResult = ReturnType<typeof useTokensV2SuspenseQuery>;
export type TokensV2QueryResult = Apollo.QueryResult<TokensV2Query, TokensV2QueryVariables>;