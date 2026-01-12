import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateArticleCommentMutationVariables = Types.Exact<{
  input: Types.CreateArticleCommentInput;
}>;


export type CreateArticleCommentMutation = { __typename?: 'Mutation', createArticleComment?: { __typename?: 'ArticleComment', id?: string | null, articleId?: string | null, authorId?: number | null, authorNickname?: string | null, authorProfileImage?: string | null, content?: string | null, parentId?: string | null, likeCount?: number | null, dislikeCount?: number | null, replyCount?: number | null, isLiked?: boolean | null, isDisliked?: boolean | null, createdAt?: any | null, updatedAt?: any | null, deletedAt?: any | null } | null };


export const CreateArticleCommentDocument = gql`
    mutation createArticleComment($input: CreateArticleCommentInput!) {
  createArticleComment(input: $input) {
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
export type CreateArticleCommentMutationFn = Apollo.MutationFunction<CreateArticleCommentMutation, CreateArticleCommentMutationVariables>;

/**
 * __useCreateArticleCommentMutation__
 *
 * To run a mutation, you first call `useCreateArticleCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateArticleCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createArticleCommentMutation, { data, loading, error }] = useCreateArticleCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateArticleCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateArticleCommentMutation, CreateArticleCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateArticleCommentMutation, CreateArticleCommentMutationVariables>(CreateArticleCommentDocument, options);
      }
export type CreateArticleCommentMutationHookResult = ReturnType<typeof useCreateArticleCommentMutation>;
export type CreateArticleCommentMutationResult = Apollo.MutationResult<CreateArticleCommentMutation>;
export type CreateArticleCommentMutationOptions = Apollo.BaseMutationOptions<CreateArticleCommentMutation, CreateArticleCommentMutationVariables>;