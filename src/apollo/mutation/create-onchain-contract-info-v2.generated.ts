import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateOnchainContractInfoV2MutationVariables = Types.Exact<{
  input: Types.CreateOnchainContractInfoV2Input;
}>;


export type CreateOnchainContractInfoV2Mutation = { __typename?: 'Mutation', createOnchainContractInfoV2?: { __typename?: 'OnchainContractInfoV2', id?: string | null, programId?: number | null, applicantId?: number | null, sponsorId?: number | null, onchainContractId?: number | null, smartContractId?: number | null, status?: Types.OnchainContractStatusV2 | null, tx?: string | null, createdAt?: any | null } | null };


export const CreateOnchainContractInfoV2Document = gql`
    mutation createOnchainContractInfoV2($input: CreateOnchainContractInfoV2Input!) {
  createOnchainContractInfoV2(input: $input) {
    id
    programId
    applicantId
    sponsorId
    onchainContractId
    smartContractId
    status
    tx
    createdAt
  }
}
    `;
export type CreateOnchainContractInfoV2MutationFn = Apollo.MutationFunction<CreateOnchainContractInfoV2Mutation, CreateOnchainContractInfoV2MutationVariables>;

/**
 * __useCreateOnchainContractInfoV2Mutation__
 *
 * To run a mutation, you first call `useCreateOnchainContractInfoV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOnchainContractInfoV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOnchainContractInfoV2Mutation, { data, loading, error }] = useCreateOnchainContractInfoV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOnchainContractInfoV2Mutation(baseOptions?: Apollo.MutationHookOptions<CreateOnchainContractInfoV2Mutation, CreateOnchainContractInfoV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOnchainContractInfoV2Mutation, CreateOnchainContractInfoV2MutationVariables>(CreateOnchainContractInfoV2Document, options);
      }
export type CreateOnchainContractInfoV2MutationHookResult = ReturnType<typeof useCreateOnchainContractInfoV2Mutation>;
export type CreateOnchainContractInfoV2MutationResult = Apollo.MutationResult<CreateOnchainContractInfoV2Mutation>;
export type CreateOnchainContractInfoV2MutationOptions = Apollo.BaseMutationOptions<CreateOnchainContractInfoV2Mutation, CreateOnchainContractInfoV2MutationVariables>;