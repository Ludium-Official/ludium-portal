import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PromoteToAdminMutationVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type PromoteToAdminMutation = { __typename?: 'Mutation', promoteToAdmin?: { __typename?: 'User', id?: string | null } | null };


export const PromoteToAdminDocument = gql`
    mutation promoteToAdmin($userId: ID!) {
  promoteToAdmin(userId: $userId) {
    id
  }
}
    `;
export type PromoteToAdminMutationFn = Apollo.MutationFunction<PromoteToAdminMutation, PromoteToAdminMutationVariables>;

/**
 * __usePromoteToAdminMutation__
 *
 * To run a mutation, you first call `usePromoteToAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePromoteToAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [promoteToAdminMutation, { data, loading, error }] = usePromoteToAdminMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function usePromoteToAdminMutation(baseOptions?: Apollo.MutationHookOptions<PromoteToAdminMutation, PromoteToAdminMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PromoteToAdminMutation, PromoteToAdminMutationVariables>(PromoteToAdminDocument, options);
      }
export type PromoteToAdminMutationHookResult = ReturnType<typeof usePromoteToAdminMutation>;
export type PromoteToAdminMutationResult = Apollo.MutationResult<PromoteToAdminMutation>;
export type PromoteToAdminMutationOptions = Apollo.BaseMutationOptions<PromoteToAdminMutation, PromoteToAdminMutationVariables>;