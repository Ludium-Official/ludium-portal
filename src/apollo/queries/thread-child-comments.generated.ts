import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ThreadChildCommentsQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID']['input'];
}>;


export type ThreadChildCommentsQuery = { __typename?: 'Query', threadChildComments?: Array<{ __typename?: 'ThreadComment', id?: string | null, threadId?: string | null, authorId?: number | null, authorNickname?: string | null, authorProfileImage?: string | null, content?: string | null, parentId?: string | null, likeCount?: number | null, dislikeCount?: number | null, replyCount?: number | null, isLiked?: boolean | null, isDisliked?: boolean | null, createdAt?: any | null, updatedAt?: any | null, deletedAt?: any | null }> | null };


export const ThreadChildCommentsDocument = gql`
    query threadChildComments($parentId: ID!) {
  threadChildComments(parentId: $parentId) {
    id
    threadId
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
 * __useThreadChildCommentsQuery__
 *
 * To run a query within a React component, call `useThreadChildCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useThreadChildCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useThreadChildCommentsQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useThreadChildCommentsQuery(baseOptions: Apollo.QueryHookOptions<ThreadChildCommentsQuery, ThreadChildCommentsQueryVariables> & ({ variables: ThreadChildCommentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ThreadChildCommentsQuery, ThreadChildCommentsQueryVariables>(ThreadChildCommentsDocument, options);
      }
export function useThreadChildCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ThreadChildCommentsQuery, ThreadChildCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ThreadChildCommentsQuery, ThreadChildCommentsQueryVariables>(ThreadChildCommentsDocument, options);
        }
export function useThreadChildCommentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ThreadChildCommentsQuery, ThreadChildCommentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ThreadChildCommentsQuery, ThreadChildCommentsQueryVariables>(ThreadChildCommentsDocument, options);
        }
export type ThreadChildCommentsQueryHookResult = ReturnType<typeof useThreadChildCommentsQuery>;
export type ThreadChildCommentsLazyQueryHookResult = ReturnType<typeof useThreadChildCommentsLazyQuery>;
export type ThreadChildCommentsSuspenseQueryHookResult = ReturnType<typeof useThreadChildCommentsSuspenseQuery>;
export type ThreadChildCommentsQueryResult = Apollo.QueryResult<ThreadChildCommentsQuery, ThreadChildCommentsQueryVariables>;