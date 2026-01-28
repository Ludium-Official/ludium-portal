import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MarkAllNotificationsAsReadV2MutationVariables = Types.Exact<{ [key: string]: never; }>;


export type MarkAllNotificationsAsReadV2Mutation = { __typename?: 'Mutation', markAllNotificationsAsReadV2?: boolean | null };


export const MarkAllNotificationsAsReadV2Document = gql`
    mutation markAllNotificationsAsReadV2 {
  markAllNotificationsAsReadV2
}
    `;
export type MarkAllNotificationsAsReadV2MutationFn = Apollo.MutationFunction<MarkAllNotificationsAsReadV2Mutation, MarkAllNotificationsAsReadV2MutationVariables>;

/**
 * __useMarkAllNotificationsAsReadV2Mutation__
 *
 * To run a mutation, you first call `useMarkAllNotificationsAsReadV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkAllNotificationsAsReadV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markAllNotificationsAsReadV2Mutation, { data, loading, error }] = useMarkAllNotificationsAsReadV2Mutation({
 *   variables: {
 *   },
 * });
 */
export function useMarkAllNotificationsAsReadV2Mutation(baseOptions?: Apollo.MutationHookOptions<MarkAllNotificationsAsReadV2Mutation, MarkAllNotificationsAsReadV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkAllNotificationsAsReadV2Mutation, MarkAllNotificationsAsReadV2MutationVariables>(MarkAllNotificationsAsReadV2Document, options);
      }
export type MarkAllNotificationsAsReadV2MutationHookResult = ReturnType<typeof useMarkAllNotificationsAsReadV2Mutation>;
export type MarkAllNotificationsAsReadV2MutationResult = Apollo.MutationResult<MarkAllNotificationsAsReadV2Mutation>;
export type MarkAllNotificationsAsReadV2MutationOptions = Apollo.BaseMutationOptions<MarkAllNotificationsAsReadV2Mutation, MarkAllNotificationsAsReadV2MutationVariables>;