import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeleteThreadCommentMutationVariables = Types.Exact<{
  input: Types.DeleteThreadCommentInput;
}>;


export type DeleteThreadCommentMutation = { __typename?: 'Mutation', deleteThreadComment?: boolean | null };


export const DeleteThreadCommentDocument = gql`
    mutation deleteThreadComment($input: DeleteThreadCommentInput!) {
  deleteThreadComment(input: $input)
}
    `;
export type DeleteThreadCommentMutationFn = Apollo.MutationFunction<DeleteThreadCommentMutation, DeleteThreadCommentMutationVariables>;

/**
 * __useDeleteThreadCommentMutation__
 *
 * To run a mutation, you first call `useDeleteThreadCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteThreadCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteThreadCommentMutation, { data, loading, error }] = useDeleteThreadCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteThreadCommentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteThreadCommentMutation, DeleteThreadCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteThreadCommentMutation, DeleteThreadCommentMutationVariables>(DeleteThreadCommentDocument, options);
      }
export type DeleteThreadCommentMutationHookResult = ReturnType<typeof useDeleteThreadCommentMutation>;
export type DeleteThreadCommentMutationResult = Apollo.MutationResult<DeleteThreadCommentMutation>;
export type DeleteThreadCommentMutationOptions = Apollo.BaseMutationOptions<DeleteThreadCommentMutation, DeleteThreadCommentMutationVariables>;