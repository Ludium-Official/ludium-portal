import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TokenV2QueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type TokenV2Query = { __typename?: 'Query', tokenV2?: { __typename?: 'TokenV2', id?: string | null, chainInfoId?: number | null, tokenName?: string | null, tokenAddress?: string | null } | null };


export const TokenV2Document = gql`
    query tokenV2($id: ID!) {
  tokenV2(id: $id) {
    id
    chainInfoId
    tokenName
    tokenAddress
  }
}
    `;

/**
 * __useTokenV2Query__
 *
 * To run a query within a React component, call `useTokenV2Query` and pass it any options that fit your needs.
 * When your component renders, `useTokenV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenV2Query({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTokenV2Query(baseOptions: Apollo.QueryHookOptions<TokenV2Query, TokenV2QueryVariables> & ({ variables: TokenV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenV2Query, TokenV2QueryVariables>(TokenV2Document, options);
      }
export function useTokenV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenV2Query, TokenV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenV2Query, TokenV2QueryVariables>(TokenV2Document, options);
        }
export function useTokenV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TokenV2Query, TokenV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TokenV2Query, TokenV2QueryVariables>(TokenV2Document, options);
        }
export type TokenV2QueryHookResult = ReturnType<typeof useTokenV2Query>;
export type TokenV2LazyQueryHookResult = ReturnType<typeof useTokenV2LazyQuery>;
export type TokenV2SuspenseQueryHookResult = ReturnType<typeof useTokenV2SuspenseQuery>;
export type TokenV2QueryResult = Apollo.QueryResult<TokenV2Query, TokenV2QueryVariables>;