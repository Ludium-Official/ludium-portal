import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateThreadCommentMutationVariables = Types.Exact<{
  input: Types.CreateThreadCommentInput;
}>;


export type CreateThreadCommentMutation = { __typename?: 'Mutation', createThreadComment?: { __typename?: 'ThreadComment', id?: string | null, threadId?: string | null, authorId?: number | null, authorNickname?: string | null, authorProfileImage?: string | null, content?: string | null, parentId?: string | null, likeCount?: number | null, dislikeCount?: number | null, replyCount?: number | null, isLiked?: boolean | null, isDisliked?: boolean | null, createdAt?: any | null, updatedAt?: any | null, deletedAt?: any | null } | null };


export const CreateThreadCommentDocument = gql`
    mutation createThreadComment($input: CreateThreadCommentInput!) {
  createThreadComment(input: $input) {
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
export type CreateThreadCommentMutationFn = Apollo.MutationFunction<CreateThreadCommentMutation, CreateThreadCommentMutationVariables>;

/**
 * __useCreateThreadCommentMutation__
 *
 * To run a mutation, you first call `useCreateThreadCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateThreadCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createThreadCommentMutation, { data, loading, error }] = useCreateThreadCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateThreadCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateThreadCommentMutation, CreateThreadCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateThreadCommentMutation, CreateThreadCommentMutationVariables>(CreateThreadCommentDocument, options);
      }
export type CreateThreadCommentMutationHookResult = ReturnType<typeof useCreateThreadCommentMutation>;
export type CreateThreadCommentMutationResult = Apollo.MutationResult<CreateThreadCommentMutation>;
export type CreateThreadCommentMutationOptions = Apollo.BaseMutationOptions<CreateThreadCommentMutation, CreateThreadCommentMutationVariables>;