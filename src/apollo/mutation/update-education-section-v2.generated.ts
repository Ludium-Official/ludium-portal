import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateEducationSectionV2MutationVariables = Types.Exact<{
  input: Types.UpdateEducationSectionV2Input;
}>;


export type UpdateEducationSectionV2Mutation = { __typename?: 'Mutation', updateEducationSectionV2?: { __typename?: 'UserV2', id?: string | null, email?: string | null, nickname?: string | null, role?: Types.UserRoleV2 | null, loginType?: Types.LoginTypeEnum | null, walletAddress?: string | null, profileImage?: string | null, skills?: Array<string> | null, about?: string | null, location?: string | null, userRole?: string | null, createdAt?: any | null, updatedAt?: any | null, educations?: Array<{ __typename?: 'EducationV2', id?: string | null, school?: string | null, degree?: string | null, study?: string | null, attendedStartDate?: number | null, attendedEndDate?: number | null, userId?: number | null }> | null } | null };


export const UpdateEducationSectionV2Document = gql`
    mutation updateEducationSectionV2($input: UpdateEducationSectionV2Input!) {
  updateEducationSectionV2(input: $input) {
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
    educations {
      id
      school
      degree
      study
      attendedStartDate
      attendedEndDate
      userId
    }
    createdAt
    updatedAt
  }
}
    `;
export type UpdateEducationSectionV2MutationFn = Apollo.MutationFunction<UpdateEducationSectionV2Mutation, UpdateEducationSectionV2MutationVariables>;

/**
 * __useUpdateEducationSectionV2Mutation__
 *
 * To run a mutation, you first call `useUpdateEducationSectionV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEducationSectionV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEducationSectionV2Mutation, { data, loading, error }] = useUpdateEducationSectionV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEducationSectionV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateEducationSectionV2Mutation, UpdateEducationSectionV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEducationSectionV2Mutation, UpdateEducationSectionV2MutationVariables>(UpdateEducationSectionV2Document, options);
      }
export type UpdateEducationSectionV2MutationHookResult = ReturnType<typeof useUpdateEducationSectionV2Mutation>;
export type UpdateEducationSectionV2MutationResult = Apollo.MutationResult<UpdateEducationSectionV2Mutation>;
export type UpdateEducationSectionV2MutationOptions = Apollo.BaseMutationOptions<UpdateEducationSectionV2Mutation, UpdateEducationSectionV2MutationVariables>;