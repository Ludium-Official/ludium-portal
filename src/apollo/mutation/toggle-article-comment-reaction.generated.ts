import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ToggleArticleCommentReactionMutationVariables = Types.Exact<{
  input: Types.ToggleArticleCommentReactionInput;
}>;


export type ToggleArticleCommentReactionMutation = { __typename?: 'Mutation', toggleArticleCommentReaction?: { __typename?: 'CommentReactionResult', likeCount?: number | null, dislikeCount?: number | null, isLiked?: boolean | null, isDisliked?: boolean | null } | null };


export const ToggleArticleCommentReactionDocument = gql`
    mutation toggleArticleCommentReaction($input: ToggleArticleCommentReactionInput!) {
  toggleArticleCommentReaction(input: $input) {
    likeCount
    dislikeCount
    isLiked
    isDisliked
  }
}
    `;
export type ToggleArticleCommentReactionMutationFn = Apollo.MutationFunction<ToggleArticleCommentReactionMutation, ToggleArticleCommentReactionMutationVariables>;

/**
 * __useToggleArticleCommentReactionMutation__
 *
 * To run a mutation, you first call `useToggleArticleCommentReactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleArticleCommentReactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleArticleCommentReactionMutation, { data, loading, error }] = useToggleArticleCommentReactionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleArticleCommentReactionMutation(baseOptions?: Apollo.MutationHookOptions<ToggleArticleCommentReactionMutation, ToggleArticleCommentReactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleArticleCommentReactionMutation, ToggleArticleCommentReactionMutationVariables>(ToggleArticleCommentReactionDocument, options);
      }
export type ToggleArticleCommentReactionMutationHookResult = ReturnType<typeof useToggleArticleCommentReactionMutation>;
export type ToggleArticleCommentReactionMutationResult = Apollo.MutationResult<ToggleArticleCommentReactionMutation>;
export type ToggleArticleCommentReactionMutationOptions = Apollo.BaseMutationOptions<ToggleArticleCommentReactionMutation, ToggleArticleCommentReactionMutationVariables>;