import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeleteNotificationV2MutationVariables = Types.Exact<{
  notificationId: Types.Scalars['ID']['input'];
}>;


export type DeleteNotificationV2Mutation = { __typename?: 'Mutation', deleteNotificationV2?: boolean | null };


export const DeleteNotificationV2Document = gql`
    mutation deleteNotificationV2($notificationId: ID!) {
  deleteNotificationV2(notificationId: $notificationId)
}
    `;
export type DeleteNotificationV2MutationFn = Apollo.MutationFunction<DeleteNotificationV2Mutation, DeleteNotificationV2MutationVariables>;

/**
 * __useDeleteNotificationV2Mutation__
 *
 * To run a mutation, you first call `useDeleteNotificationV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNotificationV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNotificationV2Mutation, { data, loading, error }] = useDeleteNotificationV2Mutation({
 *   variables: {
 *      notificationId: // value for 'notificationId'
 *   },
 * });
 */
export function useDeleteNotificationV2Mutation(baseOptions?: Apollo.MutationHookOptions<DeleteNotificationV2Mutation, DeleteNotificationV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNotificationV2Mutation, DeleteNotificationV2MutationVariables>(DeleteNotificationV2Document, options);
      }
export type DeleteNotificationV2MutationHookResult = ReturnType<typeof useDeleteNotificationV2Mutation>;
export type DeleteNotificationV2MutationResult = Apollo.MutationResult<DeleteNotificationV2Mutation>;
export type DeleteNotificationV2MutationOptions = Apollo.BaseMutationOptions<DeleteNotificationV2Mutation, DeleteNotificationV2MutationVariables>;