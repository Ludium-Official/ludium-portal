import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateWorkExperienceV2MutationVariables = Types.Exact<{
  input: Types.UpdateWorkExperienceV2Input;
}>;


export type UpdateWorkExperienceV2Mutation = { __typename?: 'Mutation', updateWorkExperienceV2?: { __typename?: 'WorkExperienceV2', id?: string | null, company?: string | null, role?: string | null, employmentType?: string | null, currentWork?: boolean | null, startMonth?: string | null, startYear?: number | null, endMonth?: string | null, endYear?: number | null } | null };


export const UpdateWorkExperienceV2Document = gql`
    mutation updateWorkExperienceV2($input: UpdateWorkExperienceV2Input!) {
  updateWorkExperienceV2(input: $input) {
    id
    company
    role
    employmentType
    currentWork
    startMonth
    startYear
    endMonth
    endYear
  }
}
    `;
export type UpdateWorkExperienceV2MutationFn = Apollo.MutationFunction<UpdateWorkExperienceV2Mutation, UpdateWorkExperienceV2MutationVariables>;

/**
 * __useUpdateWorkExperienceV2Mutation__
 *
 * To run a mutation, you first call `useUpdateWorkExperienceV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWorkExperienceV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWorkExperienceV2Mutation, { data, loading, error }] = useUpdateWorkExperienceV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateWorkExperienceV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateWorkExperienceV2Mutation, UpdateWorkExperienceV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateWorkExperienceV2Mutation, UpdateWorkExperienceV2MutationVariables>(UpdateWorkExperienceV2Document, options);
      }
export type UpdateWorkExperienceV2MutationHookResult = ReturnType<typeof useUpdateWorkExperienceV2Mutation>;
export type UpdateWorkExperienceV2MutationResult = Apollo.MutationResult<UpdateWorkExperienceV2Mutation>;
export type UpdateWorkExperienceV2MutationOptions = Apollo.BaseMutationOptions<UpdateWorkExperienceV2Mutation, UpdateWorkExperienceV2MutationVariables>;