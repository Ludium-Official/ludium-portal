import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateUserV2MutationVariables = Types.Exact<{
  input: Types.UpdateUserV2Input;
}>;


export type UpdateUserV2Mutation = { __typename?: 'Mutation', updateUserV2?: { __typename?: 'UserV2', id?: string | null, role?: Types.UserRoleV2 | null, loginType?: Types.LoginTypeEnum | null, walletAddress?: string | null, email?: string | null, nickname?: string | null, profileImage?: string | null, skills?: Array<string> | null, about?: string | null, location?: string | null, userRole?: string | null, createdAt?: any | null, updatedAt?: any | null } | null };


export const UpdateUserV2Document = gql`
    mutation updateUserV2($input: UpdateUserV2Input!) {
  updateUserV2(input: $input) {
    id
    role
    loginType
    walletAddress
    email
    nickname
    profileImage
    skills
    about
    location
    userRole
    createdAt
    updatedAt
  }
}
    `;
export type UpdateUserV2MutationFn = Apollo.MutationFunction<UpdateUserV2Mutation, UpdateUserV2MutationVariables>;

/**
 * __useUpdateUserV2Mutation__
 *
 * To run a mutation, you first call `useUpdateUserV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserV2Mutation, { data, loading, error }] = useUpdateUserV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserV2Mutation, UpdateUserV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserV2Mutation, UpdateUserV2MutationVariables>(UpdateUserV2Document, options);
      }
export type UpdateUserV2MutationHookResult = ReturnType<typeof useUpdateUserV2Mutation>;
export type UpdateUserV2MutationResult = Apollo.MutationResult<UpdateUserV2Mutation>;
export type UpdateUserV2MutationOptions = Apollo.BaseMutationOptions<UpdateUserV2Mutation, UpdateUserV2MutationVariables>;