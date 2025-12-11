import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ContractsByApplicationV2QueryVariables = Types.Exact<{
  applicationId: Types.Scalars['Int']['input'];
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type ContractsByApplicationV2Query = { __typename?: 'Query', contractsByApplicationV2?: { __typename?: 'PaginatedContractV2', count?: number | null, data?: Array<{ __typename?: 'ContractV2', id?: string | null, programId?: string | null, applicantId?: number | null, sponsorId?: number | null, onchainContractId?: number | null, smartContractId?: number | null, builder_signature?: string | null, contract_snapshot_hash?: string | null, contract_snapshot_cotents?: any | null, createdAt?: any | null }> | null } | null };


export const ContractsByApplicationV2Document = gql`
    query contractsByApplicationV2($applicationId: Int!, $pagination: PaginationInput) {
  contractsByApplicationV2(applicationId: $applicationId, pagination: $pagination) {
    data {
      id
      programId
      applicantId
      sponsorId
      onchainContractId
      smartContractId
      builder_signature
      contract_snapshot_hash
      contract_snapshot_cotents
      createdAt
    }
    count
  }
}
    `;

/**
 * __useContractsByApplicationV2Query__
 *
 * To run a query within a React component, call `useContractsByApplicationV2Query` and pass it any options that fit your needs.
 * When your component renders, `useContractsByApplicationV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useContractsByApplicationV2Query({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useContractsByApplicationV2Query(baseOptions: Apollo.QueryHookOptions<ContractsByApplicationV2Query, ContractsByApplicationV2QueryVariables> & ({ variables: ContractsByApplicationV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ContractsByApplicationV2Query, ContractsByApplicationV2QueryVariables>(ContractsByApplicationV2Document, options);
      }
export function useContractsByApplicationV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ContractsByApplicationV2Query, ContractsByApplicationV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ContractsByApplicationV2Query, ContractsByApplicationV2QueryVariables>(ContractsByApplicationV2Document, options);
        }
export function useContractsByApplicationV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ContractsByApplicationV2Query, ContractsByApplicationV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ContractsByApplicationV2Query, ContractsByApplicationV2QueryVariables>(ContractsByApplicationV2Document, options);
        }
export type ContractsByApplicationV2QueryHookResult = ReturnType<typeof useContractsByApplicationV2Query>;
export type ContractsByApplicationV2LazyQueryHookResult = ReturnType<typeof useContractsByApplicationV2LazyQuery>;
export type ContractsByApplicationV2SuspenseQueryHookResult = ReturnType<typeof useContractsByApplicationV2SuspenseQuery>;
export type ContractsByApplicationV2QueryResult = Apollo.QueryResult<ContractsByApplicationV2Query, ContractsByApplicationV2QueryVariables>;