import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RecommendedArticlesQueryVariables = Types.Exact<{
  type: Types.ArticleType;
}>;


export type RecommendedArticlesQuery = { __typename?: 'Query', recommendedArticles?: Array<{ __typename?: 'Article', id?: string | null, title?: string | null, description?: string | null, coverImage?: string | null, type?: Types.ArticleType | null, status?: Types.ArticleStatus | null, isPin?: boolean | null, view?: number | null, likeCount?: number | null, commentCount?: number | null, isLiked?: boolean | null, createdAt?: any | null, updatedAt?: any | null, author?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null, email?: string | null, walletAddress?: string | null } | null }> | null };


export const RecommendedArticlesDocument = gql`
    query recommendedArticles($type: ArticleType!) {
  recommendedArticles(type: $type) {
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
 * __useRecommendedArticlesQuery__
 *
 * To run a query within a React component, call `useRecommendedArticlesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecommendedArticlesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecommendedArticlesQuery({
 *   variables: {
 *      type: // value for 'type'
 *   },
 * });
 */
export function useRecommendedArticlesQuery(baseOptions: Apollo.QueryHookOptions<RecommendedArticlesQuery, RecommendedArticlesQueryVariables> & ({ variables: RecommendedArticlesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecommendedArticlesQuery, RecommendedArticlesQueryVariables>(RecommendedArticlesDocument, options);
      }
export function useRecommendedArticlesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecommendedArticlesQuery, RecommendedArticlesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecommendedArticlesQuery, RecommendedArticlesQueryVariables>(RecommendedArticlesDocument, options);
        }
export function useRecommendedArticlesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RecommendedArticlesQuery, RecommendedArticlesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RecommendedArticlesQuery, RecommendedArticlesQueryVariables>(RecommendedArticlesDocument, options);
        }
export type RecommendedArticlesQueryHookResult = ReturnType<typeof useRecommendedArticlesQuery>;
export type RecommendedArticlesLazyQueryHookResult = ReturnType<typeof useRecommendedArticlesLazyQuery>;
export type RecommendedArticlesSuspenseQueryHookResult = ReturnType<typeof useRecommendedArticlesSuspenseQuery>;
export type RecommendedArticlesQueryResult = Apollo.QueryResult<RecommendedArticlesQuery, RecommendedArticlesQueryVariables>;