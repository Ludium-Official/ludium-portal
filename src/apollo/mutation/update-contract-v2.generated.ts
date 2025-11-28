import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateContractV2MutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  input: Types.UpdateContractV2Input;
}>;


export type UpdateContractV2Mutation = { __typename?: 'Mutation', updateContractV2?: { __typename?: 'ContractV2', id?: string | null, programId?: number | null, applicantId?: number | null, sponsorId?: number | null, onchainContractId?: number | null, smartContractId?: number | null, builder_signature?: string | null, contract_snapshot_hash?: string | null, contract_snapshot_cotents?: any | null, createdAt?: any | null } | null };


export const UpdateContractV2Document = gql`
    mutation updateContractV2($id: ID!, $input: UpdateContractV2Input!) {
  updateContractV2(id: $id, input: $input) {
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
}
    `;
export type UpdateContractV2MutationFn = Apollo.MutationFunction<UpdateContractV2Mutation, UpdateContractV2MutationVariables>;

/**
 * __useUpdateContractV2Mutation__
 *
 * To run a mutation, you first call `useUpdateContractV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateContractV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateContractV2Mutation, { data, loading, error }] = useUpdateContractV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateContractV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateContractV2Mutation, UpdateContractV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateContractV2Mutation, UpdateContractV2MutationVariables>(UpdateContractV2Document, options);
      }
export type UpdateContractV2MutationHookResult = ReturnType<typeof useUpdateContractV2Mutation>;
export type UpdateContractV2MutationResult = Apollo.MutationResult<UpdateContractV2Mutation>;
export type UpdateContractV2MutationOptions = Apollo.BaseMutationOptions<UpdateContractV2Mutation, UpdateContractV2MutationVariables>;