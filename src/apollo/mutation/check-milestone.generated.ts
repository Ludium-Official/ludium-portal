import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CheckMilestoneMutationVariables = Types.Exact<{
  input: Types.CheckMilestoneInput;
}>;


export type CheckMilestoneMutation = { __typename?: 'Mutation', checkMilestone?: { __typename?: 'Milestone', currency?: string | null, description?: string | null, id?: string | null, price?: string | null, status?: Types.MilestoneStatus | null, title?: string | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null } | null };


export const CheckMilestoneDocument = gql`
    mutation checkMilestone($input: CheckMilestoneInput!) {
  checkMilestone(input: $input) {
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
export type CheckMilestoneMutationFn = Apollo.MutationFunction<CheckMilestoneMutation, CheckMilestoneMutationVariables>;

/**
 * __useCheckMilestoneMutation__
 *
 * To run a mutation, you first call `useCheckMilestoneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckMilestoneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkMilestoneMutation, { data, loading, error }] = useCheckMilestoneMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCheckMilestoneMutation(baseOptions?: Apollo.MutationHookOptions<CheckMilestoneMutation, CheckMilestoneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckMilestoneMutation, CheckMilestoneMutationVariables>(CheckMilestoneDocument, options);
      }
export type CheckMilestoneMutationHookResult = ReturnType<typeof useCheckMilestoneMutation>;
export type CheckMilestoneMutationResult = Apollo.MutationResult<CheckMilestoneMutation>;
export type CheckMilestoneMutationOptions = Apollo.BaseMutationOptions<CheckMilestoneMutation, CheckMilestoneMutationVariables>;