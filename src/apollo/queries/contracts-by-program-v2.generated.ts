import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ContractsByProgramV2QueryVariables = Types.Exact<{
  programId: Types.Scalars['String']['input'];
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type ContractsByProgramV2Query = { __typename?: 'Query', contractsByProgramV2?: { __typename?: 'PaginatedContractV2', count?: number | null, data?: Array<{ __typename?: 'ContractV2', id?: string | null, programId?: string | null, applicantId?: number | null, sponsorId?: number | null, onchainContractId?: number | null, smartContractId?: number | null, builder_signature?: string | null, contract_snapshot_hash?: string | null, contract_snapshot_cotents?: any | null, createdAt?: any | null }> | null } | null };


export const ContractsByProgramV2Document = gql`
    query contractsByProgramV2($programId: String!, $pagination: PaginationInput) {
  contractsByProgramV2(programId: $programId, pagination: $pagination) {
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
 * __useContractsByProgramV2Query__
 *
 * To run a query within a React component, call `useContractsByProgramV2Query` and pass it any options that fit your needs.
 * When your component renders, `useContractsByProgramV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useContractsByProgramV2Query({
 *   variables: {
 *      programId: // value for 'programId'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useContractsByProgramV2Query(baseOptions: Apollo.QueryHookOptions<ContractsByProgramV2Query, ContractsByProgramV2QueryVariables> & ({ variables: ContractsByProgramV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ContractsByProgramV2Query, ContractsByProgramV2QueryVariables>(ContractsByProgramV2Document, options);
      }
export function useContractsByProgramV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ContractsByProgramV2Query, ContractsByProgramV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ContractsByProgramV2Query, ContractsByProgramV2QueryVariables>(ContractsByProgramV2Document, options);
        }
export function useContractsByProgramV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ContractsByProgramV2Query, ContractsByProgramV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ContractsByProgramV2Query, ContractsByProgramV2QueryVariables>(ContractsByProgramV2Document, options);
        }
export type ContractsByProgramV2QueryHookResult = ReturnType<typeof useContractsByProgramV2Query>;
export type ContractsByProgramV2LazyQueryHookResult = ReturnType<typeof useContractsByProgramV2LazyQuery>;
export type ContractsByProgramV2SuspenseQueryHookResult = ReturnType<typeof useContractsByProgramV2SuspenseQuery>;
export type ContractsByProgramV2QueryResult = Apollo.QueryResult<ContractsByProgramV2Query, ContractsByProgramV2QueryVariables>;