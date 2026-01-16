import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ThreadCommentsQueryVariables = Types.Exact<{
  threadId: Types.Scalars['ID']['input'];
}>;


export type ThreadCommentsQuery = { __typename?: 'Query', threadComments?: Array<{ __typename?: 'ThreadComment', id?: string | null, threadId?: string | null, authorId?: number | null, authorNickname?: string | null, authorProfileImage?: string | null, content?: string | null, parentId?: string | null, likeCount?: number | null, dislikeCount?: number | null, replyCount?: number | null, isLiked?: boolean | null, isDisliked?: boolean | null, createdAt?: any | null, updatedAt?: any | null, deletedAt?: any | null }> | null };


export const ThreadCommentsDocument = gql`
    query threadComments($threadId: ID!) {
  threadComments(threadId: $threadId) {
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
 * __useThreadCommentsQuery__
 *
 * To run a query within a React component, call `useThreadCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useThreadCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useThreadCommentsQuery({
 *   variables: {
 *      threadId: // value for 'threadId'
 *   },
 * });
 */
export function useThreadCommentsQuery(baseOptions: Apollo.QueryHookOptions<ThreadCommentsQuery, ThreadCommentsQueryVariables> & ({ variables: ThreadCommentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ThreadCommentsQuery, ThreadCommentsQueryVariables>(ThreadCommentsDocument, options);
      }
export function useThreadCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ThreadCommentsQuery, ThreadCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ThreadCommentsQuery, ThreadCommentsQueryVariables>(ThreadCommentsDocument, options);
        }
export function useThreadCommentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ThreadCommentsQuery, ThreadCommentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ThreadCommentsQuery, ThreadCommentsQueryVariables>(ThreadCommentsDocument, options);
        }
export type ThreadCommentsQueryHookResult = ReturnType<typeof useThreadCommentsQuery>;
export type ThreadCommentsLazyQueryHookResult = ReturnType<typeof useThreadCommentsLazyQuery>;
export type ThreadCommentsSuspenseQueryHookResult = ReturnType<typeof useThreadCommentsSuspenseQuery>;
export type ThreadCommentsQueryResult = Apollo.QueryResult<ThreadCommentsQuery, ThreadCommentsQueryVariables>;