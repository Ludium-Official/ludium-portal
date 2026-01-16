import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateThreadCommentMutationVariables = Types.Exact<{
  input: Types.UpdateThreadCommentInput;
}>;


export type UpdateThreadCommentMutation = { __typename?: 'Mutation', updateThreadComment?: { __typename?: 'ThreadComment', id?: string | null, threadId?: string | null, authorId?: number | null, authorNickname?: string | null, authorProfileImage?: string | null, content?: string | null, parentId?: string | null, likeCount?: number | null, dislikeCount?: number | null, replyCount?: number | null, isLiked?: boolean | null, isDisliked?: boolean | null, createdAt?: any | null, updatedAt?: any | null, deletedAt?: any | null } | null };


export const UpdateThreadCommentDocument = gql`
    mutation updateThreadComment($input: UpdateThreadCommentInput!) {
  updateThreadComment(input: $input) {
    id
    threadId
    authorId
    authorNickname
    authorProfileImage
    content
    parentId
    likeCount
    dislikeCount
    replyCount
    isLiked
    isDisliked
    createdAt
    updatedAt
    deletedAt
  }
}
    `;
export type UpdateThreadCommentMutationFn = Apollo.MutationFunction<UpdateThreadCommentMutation, UpdateThreadCommentMutationVariables>;

/**
 * __useUpdateThreadCommentMutation__
 *
 * To run a mutation, you first call `useUpdateThreadCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateThreadCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateThreadCommentMutation, { data, loading, error }] = useUpdateThreadCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateThreadCommentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateThreadCommentMutation, UpdateThreadCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateThreadCommentMutation, UpdateThreadCommentMutationVariables>(UpdateThreadCommentDocument, options);
      }
export type UpdateThreadCommentMutationHookResult = ReturnType<typeof useUpdateThreadCommentMutation>;
export type UpdateThreadCommentMutationResult = Apollo.MutationResult<UpdateThreadCommentMutation>;
export type UpdateThreadCommentMutationOptions = Apollo.BaseMutationOptions<UpdateThreadCommentMutation, UpdateThreadCommentMutationVariables>;