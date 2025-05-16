import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CommentQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type CommentQuery = { __typename?: 'Query', comment?: { __typename?: 'Comment', id?: string | null, content?: string | null, createdAt?: any | null, author?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null, image?: string | null } | null, parent?: { __typename?: 'Comment', id?: string | null, content?: string | null, createdAt?: any | null, author?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null, image?: string | null } | null } | null, post?: { __typename?: 'Post', id?: string | null, title?: string | null } | null, replies?: Array<{ __typename?: 'Comment', id?: string | null, content?: string | null, createdAt?: any | null, author?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null, image?: string | null } | null }> | null } | null };


export const CommentDocument = gql`
    query comment($id: ID!) {
  comment(id: $id) {
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
    post {
      id
      title
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
 * __useCommentQuery__
 *
 * To run a query within a React component, call `useCommentQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCommentQuery(baseOptions: Apollo.QueryHookOptions<CommentQuery, CommentQueryVariables> & ({ variables: CommentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CommentQuery, CommentQueryVariables>(CommentDocument, options);
      }
export function useCommentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommentQuery, CommentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CommentQuery, CommentQueryVariables>(CommentDocument, options);
        }
export function useCommentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CommentQuery, CommentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CommentQuery, CommentQueryVariables>(CommentDocument, options);
        }
export type CommentQueryHookResult = ReturnType<typeof useCommentQuery>;
export type CommentLazyQueryHookResult = ReturnType<typeof useCommentLazyQuery>;
export type CommentSuspenseQueryHookResult = ReturnType<typeof useCommentSuspenseQuery>;
export type CommentQueryResult = Apollo.QueryResult<CommentQuery, CommentQueryVariables>;