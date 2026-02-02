import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetNotificationsV2QueryVariables = Types.Exact<{
  input?: Types.InputMaybe<Types.GetNotificationsV2Input>;
}>;


export type GetNotificationsV2Query = { __typename?: 'Query', notificationsV2?: { __typename?: 'NotificationV2Result', total?: number | null, data?: Array<{ __typename?: 'NotificationV2', id?: string | null, title?: string | null, content?: string | null, type?: Types.NotificationV2Type | null, action?: Types.NotificationV2Action | null, entityId?: string | null, metadata?: any | null, readAt?: any | null, recipientId?: number | null, createdAt?: any | null }> | null } | null };


export const GetNotificationsV2Document = gql`
    query getNotificationsV2($input: GetNotificationsV2Input) {
  notificationsV2(input: $input) {
    total
    data {
      id
      title
      content
      type
      action
      entityId
      metadata
      readAt
      recipientId
      createdAt
    }
  }
}
    `;

/**
 * __useGetNotificationsV2Query__
 *
 * To run a query within a React component, call `useGetNotificationsV2Query` and pass it any options that fit your needs.
 * When your component renders, `useGetNotificationsV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotificationsV2Query({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetNotificationsV2Query(baseOptions?: Apollo.QueryHookOptions<GetNotificationsV2Query, GetNotificationsV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNotificationsV2Query, GetNotificationsV2QueryVariables>(GetNotificationsV2Document, options);
      }
export function useGetNotificationsV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNotificationsV2Query, GetNotificationsV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNotificationsV2Query, GetNotificationsV2QueryVariables>(GetNotificationsV2Document, options);
        }
export function useGetNotificationsV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNotificationsV2Query, GetNotificationsV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNotificationsV2Query, GetNotificationsV2QueryVariables>(GetNotificationsV2Document, options);
        }
export type GetNotificationsV2QueryHookResult = ReturnType<typeof useGetNotificationsV2Query>;
export type GetNotificationsV2LazyQueryHookResult = ReturnType<typeof useGetNotificationsV2LazyQuery>;
export type GetNotificationsV2SuspenseQueryHookResult = ReturnType<typeof useGetNotificationsV2SuspenseQuery>;
export type GetNotificationsV2QueryResult = Apollo.QueryResult<GetNotificationsV2Query, GetNotificationsV2QueryVariables>;