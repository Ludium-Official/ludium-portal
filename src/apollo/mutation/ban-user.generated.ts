import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type BanUserMutationVariables = Types.Exact<{
  reason?: Types.InputMaybe<Types.Scalars['String']['input']>;
  userId: Types.Scalars['ID']['input'];
}>;


export type BanUserMutation = { __typename?: 'Mutation', banUser?: { __typename?: 'User', banned?: boolean | null, bannedAt?: any | null, bannedReason?: string | null, email?: string | null, firstName?: string | null, id?: string | null, organizationName?: string | null } | null };


export const BanUserDocument = gql`
    mutation banUser($reason: String, $userId: ID!) {
  banUser(reason: $reason, userId: $userId) {
    banned
    bannedAt
    bannedReason
    email
    firstName
    id
    organizationName
  }
}
    `;
export type BanUserMutationFn = Apollo.MutationFunction<BanUserMutation, BanUserMutationVariables>;

/**
 * __useBanUserMutation__
 *
 * To run a mutation, you first call `useBanUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBanUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [banUserMutation, { data, loading, error }] = useBanUserMutation({
 *   variables: {
 *      reason: // value for 'reason'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useBanUserMutation(baseOptions?: Apollo.MutationHookOptions<BanUserMutation, BanUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BanUserMutation, BanUserMutationVariables>(BanUserDocument, options);
      }
export type BanUserMutationHookResult = ReturnType<typeof useBanUserMutation>;
export type BanUserMutationResult = Apollo.MutationResult<BanUserMutation>;
export type BanUserMutationOptions = Apollo.BaseMutationOptions<BanUserMutation, BanUserMutationVariables>;