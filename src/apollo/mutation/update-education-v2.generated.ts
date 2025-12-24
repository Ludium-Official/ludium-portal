import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateEducationV2MutationVariables = Types.Exact<{
  input: Types.UpdateEducationV2Input;
}>;


export type UpdateEducationV2Mutation = { __typename?: 'Mutation', updateEducationV2?: { __typename?: 'EducationV2', id?: string | null, school?: string | null, degree?: string | null, study?: string | null, attendedStartDate?: number | null, attendedEndDate?: number | null } | null };


export const UpdateEducationV2Document = gql`
    mutation updateEducationV2($input: UpdateEducationV2Input!) {
  updateEducationV2(input: $input) {
    id
    school
    degree
    study
    attendedStartDate
    attendedEndDate
  }
}
    `;
export type UpdateEducationV2MutationFn = Apollo.MutationFunction<UpdateEducationV2Mutation, UpdateEducationV2MutationVariables>;

/**
 * __useUpdateEducationV2Mutation__
 *
 * To run a mutation, you first call `useUpdateEducationV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEducationV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEducationV2Mutation, { data, loading, error }] = useUpdateEducationV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEducationV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateEducationV2Mutation, UpdateEducationV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEducationV2Mutation, UpdateEducationV2MutationVariables>(UpdateEducationV2Document, options);
      }
export type UpdateEducationV2MutationHookResult = ReturnType<typeof useUpdateEducationV2Mutation>;
export type UpdateEducationV2MutationResult = Apollo.MutationResult<UpdateEducationV2Mutation>;
export type UpdateEducationV2MutationOptions = Apollo.BaseMutationOptions<UpdateEducationV2Mutation, UpdateEducationV2MutationVariables>;