import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ToggleThreadReactionMutationVariables = Types.Exact<{
  input: Types.ToggleThreadReactionInput;
}>;


export type ToggleThreadReactionMutation = { __typename?: 'Mutation', toggleThreadReaction?: { __typename?: 'ThreadReactionResult', isLiked?: boolean | null, isDisliked?: boolean | null, likeCount?: number | null, dislikeCount?: number | null } | null };


export const ToggleThreadReactionDocument = gql`
    mutation toggleThreadReaction($input: ToggleThreadReactionInput!) {
  toggleThreadReaction(input: $input) {
    isLiked
    isDisliked
    likeCount
    dislikeCount
  }
}
    `;
export type ToggleThreadReactionMutationFn = Apollo.MutationFunction<ToggleThreadReactionMutation, ToggleThreadReactionMutationVariables>;

/**
 * __useToggleThreadReactionMutation__
 *
 * To run a mutation, you first call `useToggleThreadReactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleThreadReactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleThreadReactionMutation, { data, loading, error }] = useToggleThreadReactionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleThreadReactionMutation(baseOptions?: Apollo.MutationHookOptions<ToggleThreadReactionMutation, ToggleThreadReactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleThreadReactionMutation, ToggleThreadReactionMutationVariables>(ToggleThreadReactionDocument, options);
      }
export type ToggleThreadReactionMutationHookResult = ReturnType<typeof useToggleThreadReactionMutation>;
export type ToggleThreadReactionMutationResult = Apollo.MutationResult<ToggleThreadReactionMutation>;
export type ToggleThreadReactionMutationOptions = Apollo.BaseMutationOptions<ToggleThreadReactionMutation, ToggleThreadReactionMutationVariables>;