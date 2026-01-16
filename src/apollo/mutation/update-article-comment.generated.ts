import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateArticleCommentMutationVariables = Types.Exact<{
  input: Types.UpdateArticleCommentInput;
}>;


export type UpdateArticleCommentMutation = { __typename?: 'Mutation', updateArticleComment?: { __typename?: 'ArticleComment', id?: string | null, articleId?: string | null, authorId?: number | null, authorNickname?: string | null, authorProfileImage?: string | null, content?: string | null, parentId?: string | null, likeCount?: number | null, dislikeCount?: number | null, replyCount?: number | null, isLiked?: boolean | null, isDisliked?: boolean | null, createdAt?: any | null, updatedAt?: any | null, deletedAt?: any | null } | null };


export const UpdateArticleCommentDocument = gql`
    mutation updateArticleComment($input: UpdateArticleCommentInput!) {
  updateArticleComment(input: $input) {
    id
    articleId
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
export type UpdateArticleCommentMutationFn = Apollo.MutationFunction<UpdateArticleCommentMutation, UpdateArticleCommentMutationVariables>;

/**
 * __useUpdateArticleCommentMutation__
 *
 * To run a mutation, you first call `useUpdateArticleCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateArticleCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateArticleCommentMutation, { data, loading, error }] = useUpdateArticleCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateArticleCommentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateArticleCommentMutation, UpdateArticleCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateArticleCommentMutation, UpdateArticleCommentMutationVariables>(UpdateArticleCommentDocument, options);
      }
export type UpdateArticleCommentMutationHookResult = ReturnType<typeof useUpdateArticleCommentMutation>;
export type UpdateArticleCommentMutationResult = Apollo.MutationResult<UpdateArticleCommentMutation>;
export type UpdateArticleCommentMutationOptions = Apollo.BaseMutationOptions<UpdateArticleCommentMutation, UpdateArticleCommentMutationVariables>;