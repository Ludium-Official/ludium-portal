import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateWorkExperienceV2MutationVariables = Types.Exact<{
  input: Types.CreateWorkExperienceV2Input;
}>;


export type CreateWorkExperienceV2Mutation = { __typename?: 'Mutation', createWorkExperienceV2?: { __typename?: 'WorkExperienceV2', id?: string | null, company?: string | null, role?: string | null, employmentType?: string | null, currentWork?: boolean | null, startMonth?: string | null, startYear?: number | null, endMonth?: string | null, endYear?: number | null } | null };


export const CreateWorkExperienceV2Document = gql`
    mutation createWorkExperienceV2($input: CreateWorkExperienceV2Input!) {
  createWorkExperienceV2(input: $input) {
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
export type CreateWorkExperienceV2MutationFn = Apollo.MutationFunction<CreateWorkExperienceV2Mutation, CreateWorkExperienceV2MutationVariables>;

/**
 * __useCreateWorkExperienceV2Mutation__
 *
 * To run a mutation, you first call `useCreateWorkExperienceV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWorkExperienceV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWorkExperienceV2Mutation, { data, loading, error }] = useCreateWorkExperienceV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateWorkExperienceV2Mutation(baseOptions?: Apollo.MutationHookOptions<CreateWorkExperienceV2Mutation, CreateWorkExperienceV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWorkExperienceV2Mutation, CreateWorkExperienceV2MutationVariables>(CreateWorkExperienceV2Document, options);
      }
export type CreateWorkExperienceV2MutationHookResult = ReturnType<typeof useCreateWorkExperienceV2Mutation>;
export type CreateWorkExperienceV2MutationResult = Apollo.MutationResult<CreateWorkExperienceV2Mutation>;
export type CreateWorkExperienceV2MutationOptions = Apollo.BaseMutationOptions<CreateWorkExperienceV2Mutation, CreateWorkExperienceV2MutationVariables>;