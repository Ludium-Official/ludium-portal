import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ThreadQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ThreadQuery = { __typename?: 'Query', thread?: { __typename?: 'Thread', id?: string | null, content?: string | null, authorNickname?: string | null, authorProfileImage?: string | null, likeCount?: number | null, dislikeCount?: number | null, replyCount?: number | null, isLiked?: boolean | null, isDisliked?: boolean | null, createdAt?: any | null, updatedAt?: any | null } | null };


export const ThreadDocument = gql`
    query thread($id: ID!) {
  thread(id: $id) {
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
    `;

/**
 * __useThreadQuery__
 *
 * To run a query within a React component, call `useThreadQuery` and pass it any options that fit your needs.
 * When your component renders, `useThreadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useThreadQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useThreadQuery(baseOptions: Apollo.QueryHookOptions<ThreadQuery, ThreadQueryVariables> & ({ variables: ThreadQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ThreadQuery, ThreadQueryVariables>(ThreadDocument, options);
      }
export function useThreadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ThreadQuery, ThreadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ThreadQuery, ThreadQueryVariables>(ThreadDocument, options);
        }
export function useThreadSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ThreadQuery, ThreadQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ThreadQuery, ThreadQueryVariables>(ThreadDocument, options);
        }
export type ThreadQueryHookResult = ReturnType<typeof useThreadQuery>;
export type ThreadLazyQueryHookResult = ReturnType<typeof useThreadLazyQuery>;
export type ThreadSuspenseQueryHookResult = ReturnType<typeof useThreadSuspenseQuery>;
export type ThreadQueryResult = Apollo.QueryResult<ThreadQuery, ThreadQueryVariables>;