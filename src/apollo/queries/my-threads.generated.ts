import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MyThreadsQueryVariables = Types.Exact<{
  input?: Types.InputMaybe<Types.ThreadsQueryInput>;
}>;


export type MyThreadsQuery = { __typename?: 'Query', myThreads?: { __typename?: 'PaginatedThread', count?: number | null, data?: Array<{ __typename?: 'Thread', id?: string | null, content?: string | null, authorNickname?: string | null, authorProfileImage?: string | null, likeCount?: number | null, dislikeCount?: number | null, replyCount?: number | null, isLiked?: boolean | null, isDisliked?: boolean | null, createdAt?: any | null, updatedAt?: any | null }> | null } | null };


export const MyThreadsDocument = gql`
    query myThreads($input: ThreadsQueryInput) {
  myThreads(input: $input) {
    count
    data {
      id
      content
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
 * __useMyThreadsQuery__
 *
 * To run a query within a React component, call `useMyThreadsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyThreadsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyThreadsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMyThreadsQuery(baseOptions?: Apollo.QueryHookOptions<MyThreadsQuery, MyThreadsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyThreadsQuery, MyThreadsQueryVariables>(MyThreadsDocument, options);
      }
export function useMyThreadsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyThreadsQuery, MyThreadsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyThreadsQuery, MyThreadsQueryVariables>(MyThreadsDocument, options);
        }
export function useMyThreadsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyThreadsQuery, MyThreadsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyThreadsQuery, MyThreadsQueryVariables>(MyThreadsDocument, options);
        }
export type MyThreadsQueryHookResult = ReturnType<typeof useMyThreadsQuery>;
export type MyThreadsLazyQueryHookResult = ReturnType<typeof useMyThreadsLazyQuery>;
export type MyThreadsSuspenseQueryHookResult = ReturnType<typeof useMyThreadsSuspenseQuery>;
export type MyThreadsQueryResult = Apollo.QueryResult<MyThreadsQuery, MyThreadsQueryVariables>;