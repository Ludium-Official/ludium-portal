import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateProgramMutationVariables = Types.Exact<{
  input: Types.UpdateProgramInput;
}>;


export type UpdateProgramMutation = { __typename?: 'Mutation', updateProgram?: { __typename?: 'Program', currency?: string | null, deadline?: any | null, description?: string | null, id?: string | null, name?: string | null, price?: string | null, status?: string | null, summary?: string | null } | null };


export const UpdateProgramDocument = gql`
    mutation updateProgram($input: UpdateProgramInput!) {
  updateProgram(input: $input) {
    currency
    deadline
    description
    id
    name
    price
    status
    summary
  }
}
    `;
export type UpdateProgramMutationFn = Apollo.MutationFunction<UpdateProgramMutation, UpdateProgramMutationVariables>;

/**
 * __useUpdateProgramMutation__
 *
 * To run a mutation, you first call `useUpdateProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProgramMutation, { data, loading, error }] = useUpdateProgramMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProgramMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProgramMutation, UpdateProgramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProgramMutation, UpdateProgramMutationVariables>(UpdateProgramDocument, options);
      }
export type UpdateProgramMutationHookResult = ReturnType<typeof useUpdateProgramMutation>;
export type UpdateProgramMutationResult = Apollo.MutationResult<UpdateProgramMutation>;
export type UpdateProgramMutationOptions = Apollo.BaseMutationOptions<UpdateProgramMutation, UpdateProgramMutationVariables>;