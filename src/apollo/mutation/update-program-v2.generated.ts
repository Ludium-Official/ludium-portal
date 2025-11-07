import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateProgramV2MutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  input: Types.UpdateProgramV2Input;
}>;


export type UpdateProgramV2Mutation = { __typename?: 'Mutation', updateProgramV2?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, skills?: Array<string> | null, deadline?: any | null, invitedMembers?: Array<string> | null, status?: Types.ProgramStatusV2 | null, visibility?: Types.ProgramVisibilityV2 | null, networkId?: number | null, price?: string | null, token_id?: number | null, createdAt?: any | null, updatedAt?: any | null } | null };


export const UpdateProgramV2Document = gql`
    mutation updateProgramV2($id: ID!, $input: UpdateProgramV2Input!) {
  updateProgramV2(id: $id, input: $input) {
    id
    title
    description
    skills
    deadline
    invitedMembers
    status
    visibility
    networkId
    price
    token_id
    createdAt
    updatedAt
  }
}
    `;
export type UpdateProgramV2MutationFn = Apollo.MutationFunction<UpdateProgramV2Mutation, UpdateProgramV2MutationVariables>;

/**
 * __useUpdateProgramV2Mutation__
 *
 * To run a mutation, you first call `useUpdateProgramV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProgramV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProgramV2Mutation, { data, loading, error }] = useUpdateProgramV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProgramV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateProgramV2Mutation, UpdateProgramV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProgramV2Mutation, UpdateProgramV2MutationVariables>(UpdateProgramV2Document, options);
      }
export type UpdateProgramV2MutationHookResult = ReturnType<typeof useUpdateProgramV2Mutation>;
export type UpdateProgramV2MutationResult = Apollo.MutationResult<UpdateProgramV2Mutation>;
export type UpdateProgramV2MutationOptions = Apollo.BaseMutationOptions<UpdateProgramV2Mutation, UpdateProgramV2MutationVariables>;