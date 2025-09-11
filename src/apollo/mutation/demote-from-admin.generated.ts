import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DemoteFromAdminMutationVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type DemoteFromAdminMutation = { __typename?: 'Mutation', demoteFromAdmin?: { __typename?: 'User', id?: string | null } | null };


export const DemoteFromAdminDocument = gql`
    mutation demoteFromAdmin($userId: ID!) {
  demoteFromAdmin(userId: $userId) {
    id
  }
}
    `;
export type DemoteFromAdminMutationFn = Apollo.MutationFunction<DemoteFromAdminMutation, DemoteFromAdminMutationVariables>;

/**
 * __useDemoteFromAdminMutation__
 *
 * To run a mutation, you first call `useDemoteFromAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDemoteFromAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [demoteFromAdminMutation, { data, loading, error }] = useDemoteFromAdminMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useDemoteFromAdminMutation(baseOptions?: Apollo.MutationHookOptions<DemoteFromAdminMutation, DemoteFromAdminMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DemoteFromAdminMutation, DemoteFromAdminMutationVariables>(DemoteFromAdminDocument, options);
      }
export type DemoteFromAdminMutationHookResult = ReturnType<typeof useDemoteFromAdminMutation>;
export type DemoteFromAdminMutationResult = Apollo.MutationResult<DemoteFromAdminMutation>;
export type DemoteFromAdminMutationOptions = Apollo.BaseMutationOptions<DemoteFromAdminMutation, DemoteFromAdminMutationVariables>;