import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateProfileSectionV2MutationVariables = Types.Exact<{
  input: Types.UpdateProfileSectionV2Input;
}>;


export type UpdateProfileSectionV2Mutation = { __typename?: 'Mutation', updateProfileSectionV2?: { __typename?: 'UserV2', id?: string | null, email?: string | null, nickname?: string | null, role?: Types.UserRoleV2 | null, loginType?: Types.LoginTypeEnum | null, walletAddress?: string | null, profileImage?: string | null, skills?: Array<string> | null, about?: string | null, location?: string | null, userRole?: string | null, createdAt?: any | null, updatedAt?: any | null } | null };


export const UpdateProfileSectionV2Document = gql`
    mutation updateProfileSectionV2($input: UpdateProfileSectionV2Input!) {
  updateProfileSectionV2(input: $input) {
    id
    email
    nickname
    role
    loginType
    walletAddress
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
export type UpdateProfileSectionV2MutationFn = Apollo.MutationFunction<UpdateProfileSectionV2Mutation, UpdateProfileSectionV2MutationVariables>;

/**
 * __useUpdateProfileSectionV2Mutation__
 *
 * To run a mutation, you first call `useUpdateProfileSectionV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileSectionV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileSectionV2Mutation, { data, loading, error }] = useUpdateProfileSectionV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProfileSectionV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileSectionV2Mutation, UpdateProfileSectionV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfileSectionV2Mutation, UpdateProfileSectionV2MutationVariables>(UpdateProfileSectionV2Document, options);
      }
export type UpdateProfileSectionV2MutationHookResult = ReturnType<typeof useUpdateProfileSectionV2Mutation>;
export type UpdateProfileSectionV2MutationResult = Apollo.MutationResult<UpdateProfileSectionV2Mutation>;
export type UpdateProfileSectionV2MutationOptions = Apollo.BaseMutationOptions<UpdateProfileSectionV2Mutation, UpdateProfileSectionV2MutationVariables>;