import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CountNotificationsSubscriptionVariables = Types.Exact<{ [key: string]: never; }>;


export type CountNotificationsSubscription = { __typename?: 'Subscription', countNotifications?: number | null };


export const CountNotificationsDocument = gql`
    subscription countNotifications {
  countNotifications
}
    `;

/**
 * __useCountNotificationsSubscription__
 *
 * To run a query within a React component, call `useCountNotificationsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCountNotificationsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCountNotificationsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useCountNotificationsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CountNotificationsSubscription, CountNotificationsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CountNotificationsSubscription, CountNotificationsSubscriptionVariables>(CountNotificationsDocument, options);
      }
export type CountNotificationsSubscriptionHookResult = ReturnType<typeof useCountNotificationsSubscription>;
export type CountNotificationsSubscriptionResult = Apollo.SubscriptionResult<CountNotificationsSubscription>;