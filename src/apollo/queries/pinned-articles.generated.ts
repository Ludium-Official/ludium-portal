import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PinnedArticlesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type PinnedArticlesQuery = { __typename?: 'Query', pinnedArticles?: Array<{ __typename?: 'Article', id?: string | null, title?: string | null, description?: string | null, coverImage?: string | null, type?: Types.ArticleType | null, status?: Types.ArticleStatus | null, isPin?: boolean | null, view?: number | null, likeCount?: number | null, commentCount?: number | null, isLiked?: boolean | null, createdAt?: any | null, updatedAt?: any | null, author?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null, email?: string | null, walletAddress?: string | null } | null }> | null };


export const PinnedArticlesDocument = gql`
    query pinnedArticles {
  pinnedArticles {
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

/**
 * __usePinnedArticlesQuery__
 *
 * To run a query within a React component, call `usePinnedArticlesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePinnedArticlesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePinnedArticlesQuery({
 *   variables: {
 *   },
 * });
 */
export function usePinnedArticlesQuery(baseOptions?: Apollo.QueryHookOptions<PinnedArticlesQuery, PinnedArticlesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PinnedArticlesQuery, PinnedArticlesQueryVariables>(PinnedArticlesDocument, options);
      }
export function usePinnedArticlesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PinnedArticlesQuery, PinnedArticlesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PinnedArticlesQuery, PinnedArticlesQueryVariables>(PinnedArticlesDocument, options);
        }
export function usePinnedArticlesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PinnedArticlesQuery, PinnedArticlesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PinnedArticlesQuery, PinnedArticlesQueryVariables>(PinnedArticlesDocument, options);
        }
export type PinnedArticlesQueryHookResult = ReturnType<typeof usePinnedArticlesQuery>;
export type PinnedArticlesLazyQueryHookResult = ReturnType<typeof usePinnedArticlesLazyQuery>;
export type PinnedArticlesSuspenseQueryHookResult = ReturnType<typeof usePinnedArticlesSuspenseQuery>;
export type PinnedArticlesQueryResult = Apollo.QueryResult<PinnedArticlesQuery, PinnedArticlesQueryVariables>;