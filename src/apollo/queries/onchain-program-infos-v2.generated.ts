import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type OnchainProgramInfosV2QueryVariables = Types.Exact<{
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type OnchainProgramInfosV2Query = { __typename?: 'Query', onchainProgramInfosV2?: { __typename?: 'PaginatedOnchainProgramInfoV2', count?: number | null, data?: Array<{ __typename?: 'OnchainProgramInfoV2', id?: string | null, networkId?: number | null, smartContractId?: number | null, onchainProgramId?: number | null, status?: Types.OnchainProgramStatusV2 | null, createdAt?: any | null, tx?: string | null }> | null } | null };


export const OnchainProgramInfosV2Document = gql`
    query onchainProgramInfosV2($pagination: PaginationInput) {
  onchainProgramInfosV2(pagination: $pagination) {
    data {
      id
      networkId
      smartContractId
      onchainProgramId
      status
      createdAt
      tx
    }
    count
  }
}
    `;

/**
 * __useOnchainProgramInfosV2Query__
 *
 * To run a query within a React component, call `useOnchainProgramInfosV2Query` and pass it any options that fit your needs.
 * When your component renders, `useOnchainProgramInfosV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnchainProgramInfosV2Query({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useOnchainProgramInfosV2Query(baseOptions?: Apollo.QueryHookOptions<OnchainProgramInfosV2Query, OnchainProgramInfosV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OnchainProgramInfosV2Query, OnchainProgramInfosV2QueryVariables>(OnchainProgramInfosV2Document, options);
      }
export function useOnchainProgramInfosV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OnchainProgramInfosV2Query, OnchainProgramInfosV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OnchainProgramInfosV2Query, OnchainProgramInfosV2QueryVariables>(OnchainProgramInfosV2Document, options);
        }
export function useOnchainProgramInfosV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<OnchainProgramInfosV2Query, OnchainProgramInfosV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OnchainProgramInfosV2Query, OnchainProgramInfosV2QueryVariables>(OnchainProgramInfosV2Document, options);
        }
export type OnchainProgramInfosV2QueryHookResult = ReturnType<typeof useOnchainProgramInfosV2Query>;
export type OnchainProgramInfosV2LazyQueryHookResult = ReturnType<typeof useOnchainProgramInfosV2LazyQuery>;
export type OnchainProgramInfosV2SuspenseQueryHookResult = ReturnType<typeof useOnchainProgramInfosV2SuspenseQuery>;
export type OnchainProgramInfosV2QueryResult = Apollo.QueryResult<OnchainProgramInfosV2Query, OnchainProgramInfosV2QueryVariables>;