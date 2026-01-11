import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ToggleThreadCommentReactionMutationVariables = Types.Exact<{
  input: Types.ToggleThreadCommentReactionInput;
}>;


export type ToggleThreadCommentReactionMutation = { __typename?: 'Mutation', toggleThreadCommentReaction?: { __typename?: 'ThreadCommentReactionResult', isLiked?: boolean | null, isDisliked?: boolean | null, likeCount?: number | null, dislikeCount?: number | null } | null };


export const ToggleThreadCommentReactionDocument = gql`
    mutation toggleThreadCommentReaction($input: ToggleThreadCommentReactionInput!) {
  toggleThreadCommentReaction(input: $input) {
    isLiked
    isDisliked
    likeCount
    dislikeCount
  }
}
    `;
export type ToggleThreadCommentReactionMutationFn = Apollo.MutationFunction<ToggleThreadCommentReactionMutation, ToggleThreadCommentReactionMutationVariables>;

/**
 * __useToggleThreadCommentReactionMutation__
 *
 * To run a mutation, you first call `useToggleThreadCommentReactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleThreadCommentReactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleThreadCommentReactionMutation, { data, loading, error }] = useToggleThreadCommentReactionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleThreadCommentReactionMutation(baseOptions?: Apollo.MutationHookOptions<ToggleThreadCommentReactionMutation, ToggleThreadCommentReactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleThreadCommentReactionMutation, ToggleThreadCommentReactionMutationVariables>(ToggleThreadCommentReactionDocument, options);
      }
export type ToggleThreadCommentReactionMutationHookResult = ReturnType<typeof useToggleThreadCommentReactionMutation>;
export type ToggleThreadCommentReactionMutationResult = Apollo.MutationResult<ToggleThreadCommentReactionMutation>;
export type ToggleThreadCommentReactionMutationOptions = Apollo.BaseMutationOptions<ToggleThreadCommentReactionMutation, ToggleThreadCommentReactionMutationVariables>;