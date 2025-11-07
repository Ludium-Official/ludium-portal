import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateProgramWithOnchainV2MutationVariables = Types.Exact<{
  input: Types.CreateProgramWithOnchainV2Input;
}>;


export type CreateProgramWithOnchainV2Mutation = { __typename?: 'Mutation', createProgramWithOnchainV2?: { __typename?: 'CreateProgramWithOnchainV2Payload', onchain?: { __typename?: 'OnchainProgramInfoV2', networkId?: number | null, onchainProgramId?: number | null, programId?: number | null, smartContractId?: number | null, status?: Types.OnchainProgramStatusV2 | null, tx?: string | null } | null, program?: { __typename?: 'ProgramV2', deadline?: any | null, description?: string | null, invitedMembers?: Array<string> | null, networkId?: number | null, price?: string | null, skills?: Array<string> | null, status?: Types.ProgramStatusV2 | null, title?: string | null } | null } | null };


export const CreateProgramWithOnchainV2Document = gql`
    mutation CreateProgramWithOnchainV2($input: CreateProgramWithOnchainV2Input!) {
  createProgramWithOnchainV2(input: $input) {
    onchain {
      networkId
      onchainProgramId
      programId
      smartContractId
      status
      tx
    }
    program {
      deadline
      description
      invitedMembers
      networkId
      price
      skills
      status
      title
    }
  }
}
    `;
export type CreateProgramWithOnchainV2MutationFn = Apollo.MutationFunction<CreateProgramWithOnchainV2Mutation, CreateProgramWithOnchainV2MutationVariables>;

/**
 * __useCreateProgramWithOnchainV2Mutation__
 *
 * To run a mutation, you first call `useCreateProgramWithOnchainV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProgramWithOnchainV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProgramWithOnchainV2Mutation, { data, loading, error }] = useCreateProgramWithOnchainV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProgramWithOnchainV2Mutation(baseOptions?: Apollo.MutationHookOptions<CreateProgramWithOnchainV2Mutation, CreateProgramWithOnchainV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProgramWithOnchainV2Mutation, CreateProgramWithOnchainV2MutationVariables>(CreateProgramWithOnchainV2Document, options);
      }
export type CreateProgramWithOnchainV2MutationHookResult = ReturnType<typeof useCreateProgramWithOnchainV2Mutation>;
export type CreateProgramWithOnchainV2MutationResult = Apollo.MutationResult<CreateProgramWithOnchainV2Mutation>;
export type CreateProgramWithOnchainV2MutationOptions = Apollo.BaseMutationOptions<CreateProgramWithOnchainV2Mutation, CreateProgramWithOnchainV2MutationVariables>;