import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateOnchainProgramInfoV2MutationVariables = Types.Exact<{
  input: Types.CreateOnchainProgramInfoV2Input;
}>;


export type CreateOnchainProgramInfoV2Mutation = { __typename?: 'Mutation', createOnchainProgramInfoV2?: { __typename?: 'OnchainProgramInfoV2', programId?: number | null, networkId?: number | null, onchainProgramId?: number | null, smartContractId?: number | null, status?: Types.OnchainProgramStatusV2 | null, tx?: string | null } | null };


export const CreateOnchainProgramInfoV2Document = gql`
    mutation createOnchainProgramInfoV2($input: CreateOnchainProgramInfoV2Input!) {
  createOnchainProgramInfoV2(input: $input) {
    programId
    networkId
    onchainProgramId
    smartContractId
    status
    tx
  }
}
    `;
export type CreateOnchainProgramInfoV2MutationFn = Apollo.MutationFunction<CreateOnchainProgramInfoV2Mutation, CreateOnchainProgramInfoV2MutationVariables>;

/**
 * __useCreateOnchainProgramInfoV2Mutation__
 *
 * To run a mutation, you first call `useCreateOnchainProgramInfoV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOnchainProgramInfoV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOnchainProgramInfoV2Mutation, { data, loading, error }] = useCreateOnchainProgramInfoV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOnchainProgramInfoV2Mutation(baseOptions?: Apollo.MutationHookOptions<CreateOnchainProgramInfoV2Mutation, CreateOnchainProgramInfoV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOnchainProgramInfoV2Mutation, CreateOnchainProgramInfoV2MutationVariables>(CreateOnchainProgramInfoV2Document, options);
      }
export type CreateOnchainProgramInfoV2MutationHookResult = ReturnType<typeof useCreateOnchainProgramInfoV2Mutation>;
export type CreateOnchainProgramInfoV2MutationResult = Apollo.MutationResult<CreateOnchainProgramInfoV2Mutation>;
export type CreateOnchainProgramInfoV2MutationOptions = Apollo.BaseMutationOptions<CreateOnchainProgramInfoV2Mutation, CreateOnchainProgramInfoV2MutationVariables>;