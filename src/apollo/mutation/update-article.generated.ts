import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateArticleMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  input: Types.UpdateArticleInput;
}>;


export type UpdateArticleMutation = { __typename?: 'Mutation', updateArticle?: { __typename?: 'Article', id?: string | null, title?: string | null, description?: string | null, coverImage?: string | null, type?: Types.ArticleType | null, status?: Types.ArticleStatus | null, isPin?: boolean | null, view?: number | null, likeCount?: number | null, commentCount?: number | null, isLiked?: boolean | null, createdAt?: any | null, updatedAt?: any | null, author?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null, email?: string | null, walletAddress?: string | null } | null } | null };


export const UpdateArticleDocument = gql`
    mutation updateArticle($id: ID!, $input: UpdateArticleInput!) {
  updateArticle(id: $id, input: $input) {
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
export type UpdateArticleMutationFn = Apollo.MutationFunction<UpdateArticleMutation, UpdateArticleMutationVariables>;

/**
 * __useUpdateArticleMutation__
 *
 * To run a mutation, you first call `useUpdateArticleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateArticleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateArticleMutation, { data, loading, error }] = useUpdateArticleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateArticleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateArticleMutation, UpdateArticleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateArticleMutation, UpdateArticleMutationVariables>(UpdateArticleDocument, options);
      }
export type UpdateArticleMutationHookResult = ReturnType<typeof useUpdateArticleMutation>;
export type UpdateArticleMutationResult = Apollo.MutationResult<UpdateArticleMutation>;
export type UpdateArticleMutationOptions = Apollo.BaseMutationOptions<UpdateArticleMutation, UpdateArticleMutationVariables>;