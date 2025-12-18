import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateAboutSectionV2MutationVariables = Types.Exact<{
  input: Types.UpdateAboutSectionV2Input;
}>;


export type UpdateAboutSectionV2Mutation = { __typename?: 'Mutation', updateAboutSectionV2?: { __typename?: 'UserV2', id?: string | null, email?: string | null, nickname?: string | null, role?: Types.UserRoleV2 | null, loginType?: Types.LoginTypeEnum | null, walletAddress?: string | null, profileImage?: string | null, skills?: Array<string> | null, about?: string | null, location?: string | null, userRole?: string | null, createdAt?: any | null, updatedAt?: any | null } | null };


export const UpdateAboutSectionV2Document = gql`
    mutation updateAboutSectionV2($input: UpdateAboutSectionV2Input!) {
  updateAboutSectionV2(input: $input) {
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
export type UpdateAboutSectionV2MutationFn = Apollo.MutationFunction<UpdateAboutSectionV2Mutation, UpdateAboutSectionV2MutationVariables>;

/**
 * __useUpdateAboutSectionV2Mutation__
 *
 * To run a mutation, you first call `useUpdateAboutSectionV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAboutSectionV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAboutSectionV2Mutation, { data, loading, error }] = useUpdateAboutSectionV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAboutSectionV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateAboutSectionV2Mutation, UpdateAboutSectionV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAboutSectionV2Mutation, UpdateAboutSectionV2MutationVariables>(UpdateAboutSectionV2Document, options);
      }
export type UpdateAboutSectionV2MutationHookResult = ReturnType<typeof useUpdateAboutSectionV2Mutation>;
export type UpdateAboutSectionV2MutationResult = Apollo.MutationResult<UpdateAboutSectionV2Mutation>;
export type UpdateAboutSectionV2MutationOptions = Apollo.BaseMutationOptions<UpdateAboutSectionV2Mutation, UpdateAboutSectionV2MutationVariables>;