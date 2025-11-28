import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateContractV2MutationVariables = Types.Exact<{
  input: Types.CreateContractV2Input;
}>;


export type CreateContractV2Mutation = { __typename?: 'Mutation', createContractV2?: { __typename?: 'ContractV2', id?: string | null, programId?: number | null, applicantId?: number | null, sponsorId?: number | null, onchainContractId?: number | null, smartContractId?: number | null, builder_signature?: string | null, contract_snapshot_hash?: string | null, contract_snapshot_cotents?: any | null, createdAt?: any | null } | null };


export const CreateContractV2Document = gql`
    mutation createContractV2($input: CreateContractV2Input!) {
  createContractV2(input: $input) {
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
export type CreateContractV2MutationFn = Apollo.MutationFunction<CreateContractV2Mutation, CreateContractV2MutationVariables>;

/**
 * __useCreateContractV2Mutation__
 *
 * To run a mutation, you first call `useCreateContractV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateContractV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createContractV2Mutation, { data, loading, error }] = useCreateContractV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateContractV2Mutation(baseOptions?: Apollo.MutationHookOptions<CreateContractV2Mutation, CreateContractV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateContractV2Mutation, CreateContractV2MutationVariables>(CreateContractV2Document, options);
      }
export type CreateContractV2MutationHookResult = ReturnType<typeof useCreateContractV2Mutation>;
export type CreateContractV2MutationResult = Apollo.MutationResult<CreateContractV2Mutation>;
export type CreateContractV2MutationOptions = Apollo.BaseMutationOptions<CreateContractV2Mutation, CreateContractV2MutationVariables>;