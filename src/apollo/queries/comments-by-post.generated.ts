import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CommentsByPostQueryVariables = Types.Exact<{
  postId: Types.Scalars['ID']['input'];
}>;


export type CommentsByPostQuery = { __typename?: 'Query', commentsByPost?: Array<{ __typename?: 'Comment', id?: string | null, content?: string | null, createdAt?: any | null, author?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null, image?: string | null } | null, parent?: { __typename?: 'Comment', id?: string | null, content?: string | null, createdAt?: any | null, author?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null, image?: string | null } | null } | null, replies?: Array<{ __typename?: 'Comment', id?: string | null, content?: string | null, createdAt?: any | null, author?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null, image?: string | null } | null }> | null }> | null };


export const CommentsByPostDocument = gql`
    query commentsByPost($postId: ID!) {
  commentsByPost(postId: $postId) {
    id
    content
    createdAt
    author {
      id
      firstName
      lastName
      image
    }
    parent {
      id
      content
      createdAt
      author {
        id
        firstName
        lastName
        image
      }
    }
    replies {
      id
      content
      createdAt
      author {
        id
        firstName
        lastName
        image
      }
    }
  }
}
    `;

/**
 * __useCommentsByPostQuery__
 *
 * To run a query within a React component, call `useCommentsByPostQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommentsByPostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentsByPostQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useCommentsByPostQuery(baseOptions: Apollo.QueryHookOptions<CommentsByPostQuery, CommentsByPostQueryVariables> & ({ variables: CommentsByPostQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CommentsByPostQuery, CommentsByPostQueryVariables>(CommentsByPostDocument, options);
      }
export function useCommentsByPostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommentsByPostQuery, CommentsByPostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CommentsByPostQuery, CommentsByPostQueryVariables>(CommentsByPostDocument, options);
        }
export function useCommentsByPostSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CommentsByPostQuery, CommentsByPostQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CommentsByPostQuery, CommentsByPostQueryVariables>(CommentsByPostDocument, options);
        }
export type CommentsByPostQueryHookResult = ReturnType<typeof useCommentsByPostQuery>;
export type CommentsByPostLazyQueryHookResult = ReturnType<typeof useCommentsByPostLazyQuery>;
export type CommentsByPostSuspenseQueryHookResult = ReturnType<typeof useCommentsByPostSuspenseQuery>;
export type CommentsByPostQueryResult = Apollo.QueryResult<CommentsByPostQuery, CommentsByPostQueryVariables>;