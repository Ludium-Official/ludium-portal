import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateWorkExperienceSectionV2MutationVariables = Types.Exact<{
  input: Types.UpdateWorkExperienceSectionV2Input;
}>;


export type UpdateWorkExperienceSectionV2Mutation = { __typename?: 'Mutation', updateWorkExperienceSectionV2?: { __typename?: 'UserV2', id?: string | null, email?: string | null, nickname?: string | null, role?: Types.UserRoleV2 | null, loginType?: Types.LoginTypeEnum | null, walletAddress?: string | null, profileImage?: string | null, skills?: Array<string> | null, about?: string | null, location?: string | null, userRole?: string | null, createdAt?: any | null, updatedAt?: any | null, workExperiences?: Array<{ __typename?: 'WorkExperienceV2', id?: string | null, company?: string | null, role?: string | null, employmentType?: string | null, startMonth?: string | null, startYear?: number | null, endMonth?: string | null, endYear?: number | null, currentWork?: boolean | null, userId?: number | null }> | null } | null };


export const UpdateWorkExperienceSectionV2Document = gql`
    mutation updateWorkExperienceSectionV2($input: UpdateWorkExperienceSectionV2Input!) {
  updateWorkExperienceSectionV2(input: $input) {
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
    workExperiences {
      id
      company
      role
      employmentType
      startMonth
      startYear
      endMonth
      endYear
      currentWork
      userId
    }
    createdAt
    updatedAt
  }
}
    `;
export type UpdateWorkExperienceSectionV2MutationFn = Apollo.MutationFunction<UpdateWorkExperienceSectionV2Mutation, UpdateWorkExperienceSectionV2MutationVariables>;

/**
 * __useUpdateWorkExperienceSectionV2Mutation__
 *
 * To run a mutation, you first call `useUpdateWorkExperienceSectionV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWorkExperienceSectionV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWorkExperienceSectionV2Mutation, { data, loading, error }] = useUpdateWorkExperienceSectionV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateWorkExperienceSectionV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateWorkExperienceSectionV2Mutation, UpdateWorkExperienceSectionV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateWorkExperienceSectionV2Mutation, UpdateWorkExperienceSectionV2MutationVariables>(UpdateWorkExperienceSectionV2Document, options);
      }
export type UpdateWorkExperienceSectionV2MutationHookResult = ReturnType<typeof useUpdateWorkExperienceSectionV2Mutation>;
export type UpdateWorkExperienceSectionV2MutationResult = Apollo.MutationResult<UpdateWorkExperienceSectionV2Mutation>;
export type UpdateWorkExperienceSectionV2MutationOptions = Apollo.BaseMutationOptions<UpdateWorkExperienceSectionV2Mutation, UpdateWorkExperienceSectionV2MutationVariables>;