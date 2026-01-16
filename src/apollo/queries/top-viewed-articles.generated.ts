import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TopViewedArticlesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TopViewedArticlesQuery = { __typename?: 'Query', topViewedArticles?: Array<{ __typename?: 'Article', id?: string | null, title?: string | null, coverImage?: string | null, createdAt?: any | null, author?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null } | null }> | null };


export const TopViewedArticlesDocument = gql`
    query topViewedArticles {
  topViewedArticles {
    id
    title
    coverImage
    createdAt
    author {
      id
      nickname
      profileImage
    }
  }
}
    `;

/**
 * __useTopViewedArticlesQuery__
 *
 * To run a query within a React component, call `useTopViewedArticlesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopViewedArticlesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopViewedArticlesQuery({
 *   variables: {
 *   },
 * });
 */
export function useTopViewedArticlesQuery(baseOptions?: Apollo.QueryHookOptions<TopViewedArticlesQuery, TopViewedArticlesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopViewedArticlesQuery, TopViewedArticlesQueryVariables>(TopViewedArticlesDocument, options);
      }
export function useTopViewedArticlesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopViewedArticlesQuery, TopViewedArticlesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopViewedArticlesQuery, TopViewedArticlesQueryVariables>(TopViewedArticlesDocument, options);
        }
export function useTopViewedArticlesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TopViewedArticlesQuery, TopViewedArticlesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TopViewedArticlesQuery, TopViewedArticlesQueryVariables>(TopViewedArticlesDocument, options);
        }
export type TopViewedArticlesQueryHookResult = ReturnType<typeof useTopViewedArticlesQuery>;
export type TopViewedArticlesLazyQueryHookResult = ReturnType<typeof useTopViewedArticlesLazyQuery>;
export type TopViewedArticlesSuspenseQueryHookResult = ReturnType<typeof useTopViewedArticlesSuspenseQuery>;
export type TopViewedArticlesQueryResult = Apollo.QueryResult<TopViewedArticlesQuery, TopViewedArticlesQueryVariables>;