import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateMilestoneMutationVariables = Types.Exact<{
  input: Types.UpdateMilestoneInput;
}>;


export type UpdateMilestoneMutation = { __typename?: 'Mutation', updateMilestone?: { __typename?: 'Milestone', currency?: string | null, description?: string | null, id?: string | null, price?: string | null, status?: Types.MilestoneStatus | null, title?: string | null } | null };


export const UpdateMilestoneDocument = gql`
    mutation updateMilestone($input: UpdateMilestoneInput!) {
  updateMilestone(input: $input) {
    currency
    description
    id
    price
    status
    title
  }
}
    `;
export type UpdateMilestoneMutationFn = Apollo.MutationFunction<UpdateMilestoneMutation, UpdateMilestoneMutationVariables>;

/**
 * __useUpdateMilestoneMutation__
 *
 * To run a mutation, you first call `useUpdateMilestoneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMilestoneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMilestoneMutation, { data, loading, error }] = useUpdateMilestoneMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMilestoneMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMilestoneMutation, UpdateMilestoneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMilestoneMutation, UpdateMilestoneMutationVariables>(UpdateMilestoneDocument, options);
      }
export type UpdateMilestoneMutationHookResult = ReturnType<typeof useUpdateMilestoneMutation>;
export type UpdateMilestoneMutationResult = Apollo.MutationResult<UpdateMilestoneMutation>;
export type UpdateMilestoneMutationOptions = Apollo.BaseMutationOptions<UpdateMilestoneMutation, UpdateMilestoneMutationVariables>;