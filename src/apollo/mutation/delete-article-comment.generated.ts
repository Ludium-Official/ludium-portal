import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeleteArticleCommentMutationVariables = Types.Exact<{
  input: Types.DeleteArticleCommentInput;
}>;


export type DeleteArticleCommentMutation = { __typename?: 'Mutation', deleteArticleComment?: boolean | null };


export const DeleteArticleCommentDocument = gql`
    mutation deleteArticleComment($input: DeleteArticleCommentInput!) {
  deleteArticleComment(input: $input)
}
    `;
export type DeleteArticleCommentMutationFn = Apollo.MutationFunction<DeleteArticleCommentMutation, DeleteArticleCommentMutationVariables>;

/**
 * __useDeleteArticleCommentMutation__
 *
 * To run a mutation, you first call `useDeleteArticleCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteArticleCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteArticleCommentMutation, { data, loading, error }] = useDeleteArticleCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteArticleCommentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteArticleCommentMutation, DeleteArticleCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteArticleCommentMutation, DeleteArticleCommentMutationVariables>(DeleteArticleCommentDocument, options);
      }
export type DeleteArticleCommentMutationHookResult = ReturnType<typeof useDeleteArticleCommentMutation>;
export type DeleteArticleCommentMutationResult = Apollo.MutationResult<DeleteArticleCommentMutation>;
export type DeleteArticleCommentMutationOptions = Apollo.BaseMutationOptions<DeleteArticleCommentMutation, DeleteArticleCommentMutationVariables>;