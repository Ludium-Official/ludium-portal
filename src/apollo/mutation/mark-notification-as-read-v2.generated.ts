import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MarkNotificationAsReadV2MutationVariables = Types.Exact<{
  notificationId: Types.Scalars['ID']['input'];
}>;


export type MarkNotificationAsReadV2Mutation = { __typename?: 'Mutation', markNotificationAsReadV2?: boolean | null };


export const MarkNotificationAsReadV2Document = gql`
    mutation markNotificationAsReadV2($notificationId: ID!) {
  markNotificationAsReadV2(notificationId: $notificationId)
}
    `;
export type MarkNotificationAsReadV2MutationFn = Apollo.MutationFunction<MarkNotificationAsReadV2Mutation, MarkNotificationAsReadV2MutationVariables>;

/**
 * __useMarkNotificationAsReadV2Mutation__
 *
 * To run a mutation, you first call `useMarkNotificationAsReadV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkNotificationAsReadV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markNotificationAsReadV2Mutation, { data, loading, error }] = useMarkNotificationAsReadV2Mutation({
 *   variables: {
 *      notificationId: // value for 'notificationId'
 *   },
 * });
 */
export function useMarkNotificationAsReadV2Mutation(baseOptions?: Apollo.MutationHookOptions<MarkNotificationAsReadV2Mutation, MarkNotificationAsReadV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkNotificationAsReadV2Mutation, MarkNotificationAsReadV2MutationVariables>(MarkNotificationAsReadV2Document, options);
      }
export type MarkNotificationAsReadV2MutationHookResult = ReturnType<typeof useMarkNotificationAsReadV2Mutation>;
export type MarkNotificationAsReadV2MutationResult = Apollo.MutationResult<MarkNotificationAsReadV2Mutation>;
export type MarkNotificationAsReadV2MutationOptions = Apollo.BaseMutationOptions<MarkNotificationAsReadV2Mutation, MarkNotificationAsReadV2MutationVariables>;