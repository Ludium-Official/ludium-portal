import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ArticleCommentsQueryVariables = Types.Exact<{
  articleId: Types.Scalars['ID']['input'];
}>;


export type ArticleCommentsQuery = { __typename?: 'Query', articleComments?: Array<{ __typename?: 'ArticleComment', id?: string | null, articleId?: string | null, authorId?: number | null, authorNickname?: string | null, authorProfileImage?: string | null, content?: string | null, parentId?: string | null, likeCount?: number | null, replyCount?: number | null, isLiked?: boolean | null, isDisliked?: boolean | null, createdAt?: any | null, updatedAt?: any | null, deletedAt?: any | null }> | null };


export const ArticleCommentsDocument = gql`
    query articleComments($articleId: ID!) {
  articleComments(articleId: $articleId) {
    id
    articleId
    authorId
    authorNickname
    authorProfileImage
    content
    parentId
    likeCount
    replyCount
    isLiked
    isDisliked
    createdAt
    updatedAt
    deletedAt
  }
}
    `;

/**
 * __useArticleCommentsQuery__
 *
 * To run a query within a React component, call `useArticleCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useArticleCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useArticleCommentsQuery({
 *   variables: {
 *      articleId: // value for 'articleId'
 *   },
 * });
 */
export function useArticleCommentsQuery(baseOptions: Apollo.QueryHookOptions<ArticleCommentsQuery, ArticleCommentsQueryVariables> & ({ variables: ArticleCommentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ArticleCommentsQuery, ArticleCommentsQueryVariables>(ArticleCommentsDocument, options);
      }
export function useArticleCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ArticleCommentsQuery, ArticleCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ArticleCommentsQuery, ArticleCommentsQueryVariables>(ArticleCommentsDocument, options);
        }
export function useArticleCommentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ArticleCommentsQuery, ArticleCommentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ArticleCommentsQuery, ArticleCommentsQueryVariables>(ArticleCommentsDocument, options);
        }
export type ArticleCommentsQueryHookResult = ReturnType<typeof useArticleCommentsQuery>;
export type ArticleCommentsLazyQueryHookResult = ReturnType<typeof useArticleCommentsLazyQuery>;
export type ArticleCommentsSuspenseQueryHookResult = ReturnType<typeof useArticleCommentsSuspenseQuery>;
export type ArticleCommentsQueryResult = Apollo.QueryResult<ArticleCommentsQuery, ArticleCommentsQueryVariables>;