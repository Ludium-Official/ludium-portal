import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateMilestonesMutationVariables = Types.Exact<{
  input: Array<Types.CreateMilestoneInput> | Types.CreateMilestoneInput;
}>;


export type CreateMilestonesMutation = { __typename?: 'Mutation', createMilestones?: Array<{ __typename?: 'Milestone', currency?: string | null, description?: string | null, id?: string | null, price?: string | null, status?: Types.MilestoneStatus | null, title?: string | null }> | null };


export const CreateMilestonesDocument = gql`
    mutation createMilestones($input: [CreateMilestoneInput!]!) {
  createMilestones(input: $input) {
    currency
    description
    id
    price
    status
    title
  }
}
    `;
export type CreateMilestonesMutationFn = Apollo.MutationFunction<CreateMilestonesMutation, CreateMilestonesMutationVariables>;

/**
 * __useCreateMilestonesMutation__
 *
 * To run a mutation, you first call `useCreateMilestonesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMilestonesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMilestonesMutation, { data, loading, error }] = useCreateMilestonesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMilestonesMutation(baseOptions?: Apollo.MutationHookOptions<CreateMilestonesMutation, CreateMilestonesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMilestonesMutation, CreateMilestonesMutationVariables>(CreateMilestonesDocument, options);
      }
export type CreateMilestonesMutationHookResult = ReturnType<typeof useCreateMilestonesMutation>;
export type CreateMilestonesMutationResult = Apollo.MutationResult<CreateMilestonesMutation>;
export type CreateMilestonesMutationOptions = Apollo.BaseMutationOptions<CreateMilestonesMutation, CreateMilestonesMutationVariables>;