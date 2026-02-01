import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateChatNotificationV2MutationVariables = Types.Exact<{
  entityId: Types.Scalars['String']['input'];
  recipientId: Types.Scalars['Int']['input'];
  metadata?: Types.InputMaybe<Types.Scalars['JSON']['input']>;
}>;


export type CreateChatNotificationV2Mutation = { __typename?: 'Mutation', createChatNotificationV2?: boolean | null };


export const CreateChatNotificationV2Document = gql`
    mutation createChatNotificationV2($entityId: String!, $recipientId: Int!, $metadata: JSON) {
  createChatNotificationV2(
    entityId: $entityId
    recipientId: $recipientId
    metadata: $metadata
  )
}
    `;
export type CreateChatNotificationV2MutationFn = Apollo.MutationFunction<CreateChatNotificationV2Mutation, CreateChatNotificationV2MutationVariables>;

/**
 * __useCreateChatNotificationV2Mutation__
 *
 * To run a mutation, you first call `useCreateChatNotificationV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChatNotificationV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChatNotificationV2Mutation, { data, loading, error }] = useCreateChatNotificationV2Mutation({
 *   variables: {
 *      entityId: // value for 'entityId'
 *      recipientId: // value for 'recipientId'
 *      metadata: // value for 'metadata'
 *   },
 * });
 */
export function useCreateChatNotificationV2Mutation(baseOptions?: Apollo.MutationHookOptions<CreateChatNotificationV2Mutation, CreateChatNotificationV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateChatNotificationV2Mutation, CreateChatNotificationV2MutationVariables>(CreateChatNotificationV2Document, options);
      }
export type CreateChatNotificationV2MutationHookResult = ReturnType<typeof useCreateChatNotificationV2Mutation>;
export type CreateChatNotificationV2MutationResult = Apollo.MutationResult<CreateChatNotificationV2Mutation>;
export type CreateChatNotificationV2MutationOptions = Apollo.BaseMutationOptions<CreateChatNotificationV2Mutation, CreateChatNotificationV2MutationVariables>;