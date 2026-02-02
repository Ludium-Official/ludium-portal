import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UnreadNotificationsCountV2SubscriptionVariables = Types.Exact<{ [key: string]: never; }>;


export type UnreadNotificationsCountV2Subscription = { __typename?: 'Subscription', unreadNotificationsCountV2?: number | null };


export const UnreadNotificationsCountV2Document = gql`
    subscription unreadNotificationsCountV2 {
  unreadNotificationsCountV2
}
    `;

/**
 * __useUnreadNotificationsCountV2Subscription__
 *
 * To run a query within a React component, call `useUnreadNotificationsCountV2Subscription` and pass it any options that fit your needs.
 * When your component renders, `useUnreadNotificationsCountV2Subscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnreadNotificationsCountV2Subscription({
 *   variables: {
 *   },
 * });
 */
export function useUnreadNotificationsCountV2Subscription(baseOptions?: Apollo.SubscriptionHookOptions<UnreadNotificationsCountV2Subscription, UnreadNotificationsCountV2SubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UnreadNotificationsCountV2Subscription, UnreadNotificationsCountV2SubscriptionVariables>(UnreadNotificationsCountV2Document, options);
      }
export type UnreadNotificationsCountV2SubscriptionHookResult = ReturnType<typeof useUnreadNotificationsCountV2Subscription>;
export type UnreadNotificationsCountV2SubscriptionResult = Apollo.SubscriptionResult<UnreadNotificationsCountV2Subscription>;