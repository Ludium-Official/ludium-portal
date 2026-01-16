import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ArticleChildCommentsQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID']['input'];
}>;


export type ArticleChildCommentsQuery = { __typename?: 'Query', articleChildComments?: Array<{ __typename?: 'ArticleComment', id?: string | null, articleId?: string | null, authorId?: number | null, authorNickname?: string | null, authorProfileImage?: string | null, content?: string | null, parentId?: string | null, likeCount?: number | null, dislikeCount?: number | null, replyCount?: number | null, isLiked?: boolean | null, isDisliked?: boolean | null, createdAt?: any | null, updatedAt?: any | null, deletedAt?: any | null }> | null };


export const ArticleChildCommentsDocument = gql`
    query articleChildComments($parentId: ID!) {
  articleChildComments(parentId: $parentId) {
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

/**
 * __useArticleChildCommentsQuery__
 *
 * To run a query within a React component, call `useArticleChildCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useArticleChildCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useArticleChildCommentsQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useArticleChildCommentsQuery(baseOptions: Apollo.QueryHookOptions<ArticleChildCommentsQuery, ArticleChildCommentsQueryVariables> & ({ variables: ArticleChildCommentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ArticleChildCommentsQuery, ArticleChildCommentsQueryVariables>(ArticleChildCommentsDocument, options);
      }
export function useArticleChildCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ArticleChildCommentsQuery, ArticleChildCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ArticleChildCommentsQuery, ArticleChildCommentsQueryVariables>(ArticleChildCommentsDocument, options);
        }
export function useArticleChildCommentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ArticleChildCommentsQuery, ArticleChildCommentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ArticleChildCommentsQuery, ArticleChildCommentsQueryVariables>(ArticleChildCommentsDocument, options);
        }
export type ArticleChildCommentsQueryHookResult = ReturnType<typeof useArticleChildCommentsQuery>;
export type ArticleChildCommentsLazyQueryHookResult = ReturnType<typeof useArticleChildCommentsLazyQuery>;
export type ArticleChildCommentsSuspenseQueryHookResult = ReturnType<typeof useArticleChildCommentsSuspenseQuery>;
export type ArticleChildCommentsQueryResult = Apollo.QueryResult<ArticleChildCommentsQuery, ArticleChildCommentsQueryVariables>;