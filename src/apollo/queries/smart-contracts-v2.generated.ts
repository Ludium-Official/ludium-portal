import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SmartContractsV2QueryVariables = Types.Exact<{
  pagination?: Types.InputMaybe<Types.PaginationInput>;
  chainInfoId?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type SmartContractsV2Query = { __typename?: 'Query', smartContractsV2?: { __typename?: 'PaginatedSmartContractsV2', count?: number | null, data?: Array<{ __typename?: 'SmartContractV2', id?: string | null, chainInfoId?: number | null, address?: string | null, name?: string | null }> | null } | null };


export const SmartContractsV2Document = gql`
    query smartContractsV2($pagination: PaginationInput, $chainInfoId: Int) {
  smartContractsV2(pagination: $pagination, chainInfoId: $chainInfoId) {
    data {
      id
      chainInfoId
      address
      name
    }
    count
  }
}
    `;

/**
 * __useSmartContractsV2Query__
 *
 * To run a query within a React component, call `useSmartContractsV2Query` and pass it any options that fit your needs.
 * When your component renders, `useSmartContractsV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSmartContractsV2Query({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      chainInfoId: // value for 'chainInfoId'
 *   },
 * });
 */
export function useSmartContractsV2Query(baseOptions?: Apollo.QueryHookOptions<SmartContractsV2Query, SmartContractsV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SmartContractsV2Query, SmartContractsV2QueryVariables>(SmartContractsV2Document, options);
      }
export function useSmartContractsV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SmartContractsV2Query, SmartContractsV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SmartContractsV2Query, SmartContractsV2QueryVariables>(SmartContractsV2Document, options);
        }
export function useSmartContractsV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SmartContractsV2Query, SmartContractsV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SmartContractsV2Query, SmartContractsV2QueryVariables>(SmartContractsV2Document, options);
        }
export type SmartContractsV2QueryHookResult = ReturnType<typeof useSmartContractsV2Query>;
export type SmartContractsV2LazyQueryHookResult = ReturnType<typeof useSmartContractsV2LazyQuery>;
export type SmartContractsV2SuspenseQueryHookResult = ReturnType<typeof useSmartContractsV2SuspenseQuery>;
export type SmartContractsV2QueryResult = Apollo.QueryResult<SmartContractsV2Query, SmartContractsV2QueryVariables>;