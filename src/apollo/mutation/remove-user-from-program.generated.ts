import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RemoveUserFromProgramMutationVariables = Types.Exact<{
  programId: Types.Scalars['ID']['input'];
  userId: Types.Scalars['ID']['input'];
}>;


export type RemoveUserFromProgramMutation = { __typename?: 'Mutation', removeUserFromProgram?: { __typename?: 'Program', id?: string | null } | null };


export const RemoveUserFromProgramDocument = gql`
    mutation removeUserFromProgram($programId: ID!, $userId: ID!) {
  removeUserFromProgram(programId: $programId, userId: $userId) {
    id
  }
}
    `;
export type RemoveUserFromProgramMutationFn = Apollo.MutationFunction<RemoveUserFromProgramMutation, RemoveUserFromProgramMutationVariables>;

/**
 * __useRemoveUserFromProgramMutation__
 *
 * To run a mutation, you first call `useRemoveUserFromProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserFromProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserFromProgramMutation, { data, loading, error }] = useRemoveUserFromProgramMutation({
 *   variables: {
 *      programId: // value for 'programId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useRemoveUserFromProgramMutation(baseOptions?: Apollo.MutationHookOptions<RemoveUserFromProgramMutation, RemoveUserFromProgramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveUserFromProgramMutation, RemoveUserFromProgramMutationVariables>(RemoveUserFromProgramDocument, options);
      }
export type RemoveUserFromProgramMutationHookResult = ReturnType<typeof useRemoveUserFromProgramMutation>;
export type RemoveUserFromProgramMutationResult = Apollo.MutationResult<RemoveUserFromProgramMutation>;
export type RemoveUserFromProgramMutationOptions = Apollo.BaseMutationOptions<RemoveUserFromProgramMutation, RemoveUserFromProgramMutationVariables>;