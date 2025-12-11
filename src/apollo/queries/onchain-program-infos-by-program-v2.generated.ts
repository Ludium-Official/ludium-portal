import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type OnchainProgramInfosByProgramV2QueryVariables = Types.Exact<{
  programId: Types.Scalars['String']['input'];
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type OnchainProgramInfosByProgramV2Query = { __typename?: 'Query', onchainProgramInfosByProgramV2?: { __typename?: 'PaginatedOnchainProgramInfoV2', count?: number | null, data?: Array<{ __typename?: 'OnchainProgramInfoV2', id?: string | null, networkId?: number | null, smartContractId?: number | null, onchainProgramId?: number | null, status?: Types.OnchainProgramStatusV2 | null, createdAt?: any | null, tx?: string | null }> | null } | null };


export const OnchainProgramInfosByProgramV2Document = gql`
    query onchainProgramInfosByProgramV2($programId: String!, $pagination: PaginationInput) {
  onchainProgramInfosByProgramV2(programId: $programId, pagination: $pagination) {
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
 * __useOnchainProgramInfosByProgramV2Query__
 *
 * To run a query within a React component, call `useOnchainProgramInfosByProgramV2Query` and pass it any options that fit your needs.
 * When your component renders, `useOnchainProgramInfosByProgramV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnchainProgramInfosByProgramV2Query({
 *   variables: {
 *      programId: // value for 'programId'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useOnchainProgramInfosByProgramV2Query(baseOptions: Apollo.QueryHookOptions<OnchainProgramInfosByProgramV2Query, OnchainProgramInfosByProgramV2QueryVariables> & ({ variables: OnchainProgramInfosByProgramV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OnchainProgramInfosByProgramV2Query, OnchainProgramInfosByProgramV2QueryVariables>(OnchainProgramInfosByProgramV2Document, options);
      }
export function useOnchainProgramInfosByProgramV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OnchainProgramInfosByProgramV2Query, OnchainProgramInfosByProgramV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OnchainProgramInfosByProgramV2Query, OnchainProgramInfosByProgramV2QueryVariables>(OnchainProgramInfosByProgramV2Document, options);
        }
export function useOnchainProgramInfosByProgramV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<OnchainProgramInfosByProgramV2Query, OnchainProgramInfosByProgramV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OnchainProgramInfosByProgramV2Query, OnchainProgramInfosByProgramV2QueryVariables>(OnchainProgramInfosByProgramV2Document, options);
        }
export type OnchainProgramInfosByProgramV2QueryHookResult = ReturnType<typeof useOnchainProgramInfosByProgramV2Query>;
export type OnchainProgramInfosByProgramV2LazyQueryHookResult = ReturnType<typeof useOnchainProgramInfosByProgramV2LazyQuery>;
export type OnchainProgramInfosByProgramV2SuspenseQueryHookResult = ReturnType<typeof useOnchainProgramInfosByProgramV2SuspenseQuery>;
export type OnchainProgramInfosByProgramV2QueryResult = Apollo.QueryResult<OnchainProgramInfosByProgramV2Query, OnchainProgramInfosByProgramV2QueryVariables>;