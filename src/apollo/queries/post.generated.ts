import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PostQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type PostQuery = { __typename?: 'Query', post?: { __typename?: 'Post', id?: string | null, title?: string | null, content?: string | null, image?: string | null, createdAt?: any | null, keywords?: Array<{ __typename?: 'Keyword', id?: string | null, name?: string | null }> | null, author?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null, image?: string | null } | null } | null };


export const PostDocument = gql`
    query post($id: ID!) {
  post(id: $id) {
    id
    title
    content
    image
    keywords {
      id
      name
    }
    author {
      id
      firstName
      lastName
      image
    }
    createdAt
  }
}
    `;

/**
 * __usePostQuery__
 *
 * To run a query within a React component, call `usePostQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePostQuery(baseOptions: Apollo.QueryHookOptions<PostQuery, PostQueryVariables> & ({ variables: PostQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PostQuery, PostQueryVariables>(PostDocument, options);
      }
export function usePostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostQuery, PostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PostQuery, PostQueryVariables>(PostDocument, options);
        }
export function usePostSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PostQuery, PostQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PostQuery, PostQueryVariables>(PostDocument, options);
        }
export type PostQueryHookResult = ReturnType<typeof usePostQuery>;
export type PostLazyQueryHookResult = ReturnType<typeof usePostLazyQuery>;
export type PostSuspenseQueryHookResult = ReturnType<typeof usePostSuspenseQuery>;
export type PostQueryResult = Apollo.QueryResult<PostQuery, PostQueryVariables>;