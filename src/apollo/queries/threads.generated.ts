import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ThreadsQueryVariables = Types.Exact<{
  input?: Types.InputMaybe<Types.ThreadsQueryInput>;
}>;


export type ThreadsQuery = { __typename?: 'Query', threads?: { __typename?: 'PaginatedThread', count?: number | null, data?: Array<{ __typename?: 'Thread', id?: string | null, content?: string | null, images?: Array<string> | null, authorNickname?: string | null, authorProfileImage?: string | null, likeCount?: number | null, dislikeCount?: number | null, replyCount?: number | null, isLiked?: boolean | null, isDisliked?: boolean | null, createdAt?: any | null, updatedAt?: any | null }> | null } | null };


export const ThreadsDocument = gql`
    query threads($input: ThreadsQueryInput) {
  threads(input: $input) {
    count
    data {
      id
      content
      images
      authorNickname
      authorProfileImage
      likeCount
      dislikeCount
      replyCount
      isLiked
      isDisliked
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useThreadsQuery__
 *
 * To run a query within a React component, call `useThreadsQuery` and pass it any options that fit your needs.
 * When your component renders, `useThreadsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useThreadsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useThreadsQuery(baseOptions?: Apollo.QueryHookOptions<ThreadsQuery, ThreadsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ThreadsQuery, ThreadsQueryVariables>(ThreadsDocument, options);
      }
export function useThreadsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ThreadsQuery, ThreadsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ThreadsQuery, ThreadsQueryVariables>(ThreadsDocument, options);
        }
export function useThreadsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ThreadsQuery, ThreadsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ThreadsQuery, ThreadsQueryVariables>(ThreadsDocument, options);
        }
export type ThreadsQueryHookResult = ReturnType<typeof useThreadsQuery>;
export type ThreadsLazyQueryHookResult = ReturnType<typeof useThreadsLazyQuery>;
export type ThreadsSuspenseQueryHookResult = ReturnType<typeof useThreadsSuspenseQuery>;
export type ThreadsQueryResult = Apollo.QueryResult<ThreadsQuery, ThreadsQueryVariables>;