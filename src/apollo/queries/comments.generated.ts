import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CommentsQueryVariables = Types.Exact<{
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type CommentsQuery = { __typename?: 'Query', comments?: { __typename?: 'PaginatedComments', count?: number | null, data?: Array<{ __typename?: 'Comment', id?: string | null, content?: string | null, createdAt?: any | null, author?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null, image?: string | null } | null, parent?: { __typename?: 'Comment', id?: string | null, content?: string | null, createdAt?: any | null, author?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null, image?: string | null } | null } | null, replies?: Array<{ __typename?: 'Comment', id?: string | null, content?: string | null, createdAt?: any | null, author?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null, image?: string | null } | null }> | null }> | null } | null };


export const CommentsDocument = gql`
    query comments($pagination: PaginationInput) {
  comments(pagination: $pagination) {
    count
    data {
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
}
    `;

/**
 * __useCommentsQuery__
 *
 * To run a query within a React component, call `useCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useCommentsQuery(baseOptions?: Apollo.QueryHookOptions<CommentsQuery, CommentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CommentsQuery, CommentsQueryVariables>(CommentsDocument, options);
      }
export function useCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommentsQuery, CommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CommentsQuery, CommentsQueryVariables>(CommentsDocument, options);
        }
export function useCommentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CommentsQuery, CommentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CommentsQuery, CommentsQueryVariables>(CommentsDocument, options);
        }
export type CommentsQueryHookResult = ReturnType<typeof useCommentsQuery>;
export type CommentsLazyQueryHookResult = ReturnType<typeof useCommentsLazyQuery>;
export type CommentsSuspenseQueryHookResult = ReturnType<typeof useCommentsSuspenseQuery>;
export type CommentsQueryResult = Apollo.QueryResult<CommentsQuery, CommentsQueryVariables>;