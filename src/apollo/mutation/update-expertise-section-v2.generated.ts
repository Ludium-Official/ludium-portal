import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateExpertiseSectionV2MutationVariables = Types.Exact<{
  input: Types.UpdateExpertiseSectionV2Input;
}>;


export type UpdateExpertiseSectionV2Mutation = { __typename?: 'Mutation', updateExpertiseSectionV2?: { __typename?: 'UserV2', id?: string | null, email?: string | null, nickname?: string | null, role?: Types.UserRoleV2 | null, loginType?: Types.LoginTypeEnum | null, walletAddress?: string | null, profileImage?: string | null, skills?: Array<string> | null, about?: string | null, location?: string | null, userRole?: string | null, createdAt?: any | null, updatedAt?: any | null, languages?: Array<{ __typename?: 'LanguageV2', id?: string | null, language?: string | null, proficiency?: string | null, userId?: number | null }> | null } | null };


export const UpdateExpertiseSectionV2Document = gql`
    mutation updateExpertiseSectionV2($input: UpdateExpertiseSectionV2Input!) {
  updateExpertiseSectionV2(input: $input) {
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
    languages {
      id
      language
      proficiency
      userId
    }
    createdAt
    updatedAt
  }
}
    `;
export type UpdateExpertiseSectionV2MutationFn = Apollo.MutationFunction<UpdateExpertiseSectionV2Mutation, UpdateExpertiseSectionV2MutationVariables>;

/**
 * __useUpdateExpertiseSectionV2Mutation__
 *
 * To run a mutation, you first call `useUpdateExpertiseSectionV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExpertiseSectionV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExpertiseSectionV2Mutation, { data, loading, error }] = useUpdateExpertiseSectionV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateExpertiseSectionV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateExpertiseSectionV2Mutation, UpdateExpertiseSectionV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateExpertiseSectionV2Mutation, UpdateExpertiseSectionV2MutationVariables>(UpdateExpertiseSectionV2Document, options);
      }
export type UpdateExpertiseSectionV2MutationHookResult = ReturnType<typeof useUpdateExpertiseSectionV2Mutation>;
export type UpdateExpertiseSectionV2MutationResult = Apollo.MutationResult<UpdateExpertiseSectionV2Mutation>;
export type UpdateExpertiseSectionV2MutationOptions = Apollo.BaseMutationOptions<UpdateExpertiseSectionV2Mutation, UpdateExpertiseSectionV2MutationVariables>;