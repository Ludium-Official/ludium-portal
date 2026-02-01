import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetUnreadNotificationsCountV2QueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetUnreadNotificationsCountV2Query = { __typename?: 'Query', unreadNotificationsCountV2?: number | null };


export const GetUnreadNotificationsCountV2Document = gql`
    query getUnreadNotificationsCountV2 {
  unreadNotificationsCountV2
}
    `;

/**
 * __useGetUnreadNotificationsCountV2Query__
 *
 * To run a query within a React component, call `useGetUnreadNotificationsCountV2Query` and pass it any options that fit your needs.
 * When your component renders, `useGetUnreadNotificationsCountV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUnreadNotificationsCountV2Query({
 *   variables: {
 *   },
 * });
 */
export function useGetUnreadNotificationsCountV2Query(baseOptions?: Apollo.QueryHookOptions<GetUnreadNotificationsCountV2Query, GetUnreadNotificationsCountV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUnreadNotificationsCountV2Query, GetUnreadNotificationsCountV2QueryVariables>(GetUnreadNotificationsCountV2Document, options);
      }
export function useGetUnreadNotificationsCountV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUnreadNotificationsCountV2Query, GetUnreadNotificationsCountV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUnreadNotificationsCountV2Query, GetUnreadNotificationsCountV2QueryVariables>(GetUnreadNotificationsCountV2Document, options);
        }
export function useGetUnreadNotificationsCountV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUnreadNotificationsCountV2Query, GetUnreadNotificationsCountV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUnreadNotificationsCountV2Query, GetUnreadNotificationsCountV2QueryVariables>(GetUnreadNotificationsCountV2Document, options);
        }
export type GetUnreadNotificationsCountV2QueryHookResult = ReturnType<typeof useGetUnreadNotificationsCountV2Query>;
export type GetUnreadNotificationsCountV2LazyQueryHookResult = ReturnType<typeof useGetUnreadNotificationsCountV2LazyQuery>;
export type GetUnreadNotificationsCountV2SuspenseQueryHookResult = ReturnType<typeof useGetUnreadNotificationsCountV2SuspenseQuery>;
export type GetUnreadNotificationsCountV2QueryResult = Apollo.QueryResult<GetUnreadNotificationsCountV2Query, GetUnreadNotificationsCountV2QueryVariables>;