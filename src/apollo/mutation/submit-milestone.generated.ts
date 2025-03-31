import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SubmitMilestoneMutationVariables = Types.Exact<{
  input: Types.SubmitMilestoneInput;
}>;


export type SubmitMilestoneMutation = { __typename?: 'Mutation', submitMilestone?: { __typename?: 'Milestone', currency?: string | null, description?: string | null, id?: string | null, price?: string | null, status?: Types.MilestoneStatus | null, title?: string | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null } | null };


export const SubmitMilestoneDocument = gql`
    mutation submitMilestone($input: SubmitMilestoneInput!) {
  submitMilestone(input: $input) {
    currency
    description
    id
    links {
      title
      url
    }
    price
    status
    title
  }
}
    `;
export type SubmitMilestoneMutationFn = Apollo.MutationFunction<SubmitMilestoneMutation, SubmitMilestoneMutationVariables>;

/**
 * __useSubmitMilestoneMutation__
 *
 * To run a mutation, you first call `useSubmitMilestoneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitMilestoneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitMilestoneMutation, { data, loading, error }] = useSubmitMilestoneMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSubmitMilestoneMutation(baseOptions?: Apollo.MutationHookOptions<SubmitMilestoneMutation, SubmitMilestoneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitMilestoneMutation, SubmitMilestoneMutationVariables>(SubmitMilestoneDocument, options);
      }
export type SubmitMilestoneMutationHookResult = ReturnType<typeof useSubmitMilestoneMutation>;
export type SubmitMilestoneMutationResult = Apollo.MutationResult<SubmitMilestoneMutation>;
export type SubmitMilestoneMutationOptions = Apollo.BaseMutationOptions<SubmitMilestoneMutation, SubmitMilestoneMutationVariables>;