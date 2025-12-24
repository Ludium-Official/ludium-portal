import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateEducationV2MutationVariables = Types.Exact<{
  input: Types.CreateEducationV2Input;
}>;


export type CreateEducationV2Mutation = { __typename?: 'Mutation', createEducationV2?: { __typename?: 'EducationV2', id?: string | null, school?: string | null, degree?: string | null, study?: string | null, attendedStartDate?: number | null, attendedEndDate?: number | null } | null };


export const CreateEducationV2Document = gql`
    mutation createEducationV2($input: CreateEducationV2Input!) {
  createEducationV2(input: $input) {
    id
    school
    degree
    study
    attendedStartDate
    attendedEndDate
  }
}
    `;
export type CreateEducationV2MutationFn = Apollo.MutationFunction<CreateEducationV2Mutation, CreateEducationV2MutationVariables>;

/**
 * __useCreateEducationV2Mutation__
 *
 * To run a mutation, you first call `useCreateEducationV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEducationV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEducationV2Mutation, { data, loading, error }] = useCreateEducationV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEducationV2Mutation(baseOptions?: Apollo.MutationHookOptions<CreateEducationV2Mutation, CreateEducationV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEducationV2Mutation, CreateEducationV2MutationVariables>(CreateEducationV2Document, options);
      }
export type CreateEducationV2MutationHookResult = ReturnType<typeof useCreateEducationV2Mutation>;
export type CreateEducationV2MutationResult = Apollo.MutationResult<CreateEducationV2Mutation>;
export type CreateEducationV2MutationOptions = Apollo.BaseMutationOptions<CreateEducationV2Mutation, CreateEducationV2MutationVariables>;