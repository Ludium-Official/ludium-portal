import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type BannerQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type BannerQuery = { __typename?: 'Query', banner?: { __typename?: 'Post', content?: string | null, summary?: string | null, createdAt?: any | null, id?: string | null, image?: string | null, title?: string | null, author?: { __typename?: 'User', about?: string | null, avatar?: any | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, isAdmin?: boolean | null, lastName?: string | null, loginType?: string | null, organizationName?: string | null, walletAddress?: string | null } | null, keywords?: Array<{ __typename?: 'Keyword', id?: string | null, name?: string | null }> | null } | null };


export const BannerDocument = gql`
    query banner {
  banner {
    author {
      about
      avatar
      email
      firstName
      id
      image
      isAdmin
      lastName
      loginType
      organizationName
      walletAddress
    }
    content
    summary
    createdAt
    id
    image
    keywords {
      id
      name
    }
    title
  }
}
    `;

/**
 * __useBannerQuery__
 *
 * To run a query within a React component, call `useBannerQuery` and pass it any options that fit your needs.
 * When your component renders, `useBannerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBannerQuery({
 *   variables: {
 *   },
 * });
 */
export function useBannerQuery(baseOptions?: Apollo.QueryHookOptions<BannerQuery, BannerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BannerQuery, BannerQueryVariables>(BannerDocument, options);
      }
export function useBannerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BannerQuery, BannerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BannerQuery, BannerQueryVariables>(BannerDocument, options);
        }
export function useBannerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<BannerQuery, BannerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BannerQuery, BannerQueryVariables>(BannerDocument, options);
        }
export type BannerQueryHookResult = ReturnType<typeof useBannerQuery>;
export type BannerLazyQueryHookResult = ReturnType<typeof useBannerLazyQuery>;
export type BannerSuspenseQueryHookResult = ReturnType<typeof useBannerSuspenseQuery>;
export type BannerQueryResult = Apollo.QueryResult<BannerQuery, BannerQueryVariables>;