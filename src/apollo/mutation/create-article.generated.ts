import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateArticleMutationVariables = Types.Exact<{
  input: Types.CreateArticleInput;
}>;


export type CreateArticleMutation = { __typename?: 'Mutation', createArticle?: { __typename?: 'Article', id?: string | null, title?: string | null, description?: string | null, coverImage?: string | null, type?: Types.ArticleType | null, status?: Types.ArticleStatus | null, isPin?: boolean | null, view?: number | null, likeCount?: number | null, commentCount?: number | null, isLiked?: boolean | null, createdAt?: any | null, updatedAt?: any | null, author?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null, email?: string | null, walletAddress?: string | null } | null } | null };


export const CreateArticleDocument = gql`
    mutation createArticle($input: CreateArticleInput!) {
  createArticle(input: $input) {
    id
    title
    description
    coverImage
    type
    status
    isPin
    view
    likeCount
    commentCount
    isLiked
    createdAt
    updatedAt
    author {
      id
      nickname
      profileImage
      email
      walletAddress
    }
  }
}
    `;
export type CreateArticleMutationFn = Apollo.MutationFunction<CreateArticleMutation, CreateArticleMutationVariables>;

/**
 * __useCreateArticleMutation__
 *
 * To run a mutation, you first call `useCreateArticleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateArticleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createArticleMutation, { data, loading, error }] = useCreateArticleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateArticleMutation(baseOptions?: Apollo.MutationHookOptions<CreateArticleMutation, CreateArticleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateArticleMutation, CreateArticleMutationVariables>(CreateArticleDocument, options);
      }
export type CreateArticleMutationHookResult = ReturnType<typeof useCreateArticleMutation>;
export type CreateArticleMutationResult = Apollo.MutationResult<CreateArticleMutation>;
export type CreateArticleMutationOptions = Apollo.BaseMutationOptions<CreateArticleMutation, CreateArticleMutationVariables>;