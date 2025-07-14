import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type InviteUserToProgramMutationVariables = Types.Exact<{
  programId: Types.Scalars['ID']['input'];
  userId: Types.Scalars['ID']['input'];
}>;


export type InviteUserToProgramMutation = { __typename?: 'Mutation', inviteUserToProgram?: { __typename?: 'Program', invitedBuilders?: Array<{ __typename?: 'User', email?: string | null, firstName?: string | null, lastName?: string | null, organizationName?: string | null, walletAddress?: string | null }> | null } | null };


export const InviteUserToProgramDocument = gql`
    mutation inviteUserToProgram($programId: ID!, $userId: ID!) {
  inviteUserToProgram(programId: $programId, userId: $userId) {
    invitedBuilders {
      email
      firstName
      lastName
      organizationName
      walletAddress
    }
  }
}
    `;
export type InviteUserToProgramMutationFn = Apollo.MutationFunction<InviteUserToProgramMutation, InviteUserToProgramMutationVariables>;

/**
 * __useInviteUserToProgramMutation__
 *
 * To run a mutation, you first call `useInviteUserToProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteUserToProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteUserToProgramMutation, { data, loading, error }] = useInviteUserToProgramMutation({
 *   variables: {
 *      programId: // value for 'programId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useInviteUserToProgramMutation(baseOptions?: Apollo.MutationHookOptions<InviteUserToProgramMutation, InviteUserToProgramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InviteUserToProgramMutation, InviteUserToProgramMutationVariables>(InviteUserToProgramDocument, options);
      }
export type InviteUserToProgramMutationHookResult = ReturnType<typeof useInviteUserToProgramMutation>;
export type InviteUserToProgramMutationResult = Apollo.MutationResult<InviteUserToProgramMutation>;
export type InviteUserToProgramMutationOptions = Apollo.BaseMutationOptions<InviteUserToProgramMutation, InviteUserToProgramMutationVariables>;