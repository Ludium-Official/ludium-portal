import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NotificationsV2SubscriptionVariables = Types.Exact<{
  input?: Types.InputMaybe<Types.GetNotificationsV2Input>;
}>;


export type NotificationsV2Subscription = { __typename?: 'Subscription', notificationsV2?: { __typename?: 'NotificationV2Result', total?: number | null, data?: Array<{ __typename?: 'NotificationV2', id?: string | null, title?: string | null, content?: string | null, type?: Types.NotificationV2Type | null, action?: Types.NotificationV2Action | null, entityId?: string | null, metadata?: any | null, readAt?: any | null, recipientId?: number | null, createdAt?: any | null }> | null } | null };


export const NotificationsV2Document = gql`
    subscription notificationsV2($input: GetNotificationsV2Input) {
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
 * __useNotificationsV2Subscription__
 *
 * To run a query within a React component, call `useNotificationsV2Subscription` and pass it any options that fit your needs.
 * When your component renders, `useNotificationsV2Subscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationsV2Subscription({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useNotificationsV2Subscription(baseOptions?: Apollo.SubscriptionHookOptions<NotificationsV2Subscription, NotificationsV2SubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NotificationsV2Subscription, NotificationsV2SubscriptionVariables>(NotificationsV2Document, options);
      }
export type NotificationsV2SubscriptionHookResult = ReturnType<typeof useNotificationsV2Subscription>;
export type NotificationsV2SubscriptionResult = Apollo.SubscriptionResult<NotificationsV2Subscription>;