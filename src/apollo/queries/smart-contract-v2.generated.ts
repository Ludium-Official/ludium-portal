import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SmartContractV2QueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type SmartContractV2Query = { __typename?: 'Query', smartContractV2?: { __typename?: 'SmartContractV2', id?: string | null, chainInfoId?: number | null, address?: string | null, name?: string | null } | null };


export const SmartContractV2Document = gql`
    query smartContractV2($id: ID!) {
  smartContractV2(id: $id) {
    id
    chainInfoId
    address
    name
  }
}
    `;

/**
 * __useSmartContractV2Query__
 *
 * To run a query within a React component, call `useSmartContractV2Query` and pass it any options that fit your needs.
 * When your component renders, `useSmartContractV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSmartContractV2Query({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSmartContractV2Query(baseOptions: Apollo.QueryHookOptions<SmartContractV2Query, SmartContractV2QueryVariables> & ({ variables: SmartContractV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SmartContractV2Query, SmartContractV2QueryVariables>(SmartContractV2Document, options);
      }
export function useSmartContractV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SmartContractV2Query, SmartContractV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SmartContractV2Query, SmartContractV2QueryVariables>(SmartContractV2Document, options);
        }
export function useSmartContractV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SmartContractV2Query, SmartContractV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SmartContractV2Query, SmartContractV2QueryVariables>(SmartContractV2Document, options);
        }
export type SmartContractV2QueryHookResult = ReturnType<typeof useSmartContractV2Query>;
export type SmartContractV2LazyQueryHookResult = ReturnType<typeof useSmartContractV2LazyQuery>;
export type SmartContractV2SuspenseQueryHookResult = ReturnType<typeof useSmartContractV2SuspenseQuery>;
export type SmartContractV2QueryResult = Apollo.QueryResult<SmartContractV2Query, SmartContractV2QueryVariables>;