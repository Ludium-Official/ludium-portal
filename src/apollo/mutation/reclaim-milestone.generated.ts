import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ReclaimMilestoneMutationVariables = Types.Exact<{
  milestoneId: Types.Scalars['ID']['input'];
}>;


export type ReclaimMilestoneMutation = { __typename?: 'Mutation', reclaimMilestone?: { __typename?: 'Milestone', id?: string | null, title?: string | null, reclaimed?: boolean | null, reclaimTxHash?: string | null, reclaimedAt?: any | null, canReclaim?: boolean | null } | null };


export const ReclaimMilestoneDocument = gql`
    mutation reclaimMilestone($milestoneId: ID!) {
  reclaimMilestone(milestoneId: $milestoneId) {
    id
    title
    reclaimed
    reclaimTxHash
    reclaimedAt
    canReclaim
  }
}
    `;
export type ReclaimMilestoneMutationFn = Apollo.MutationFunction<ReclaimMilestoneMutation, ReclaimMilestoneMutationVariables>;

/**
 * __useReclaimMilestoneMutation__
 *
 * To run a mutation, you first call `useReclaimMilestoneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReclaimMilestoneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reclaimMilestoneMutation, { data, loading, error }] = useReclaimMilestoneMutation({
 *   variables: {
 *      milestoneId: // value for 'milestoneId'
 *   },
 * });
 */
export function useReclaimMilestoneMutation(baseOptions?: Apollo.MutationHookOptions<ReclaimMilestoneMutation, ReclaimMilestoneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReclaimMilestoneMutation, ReclaimMilestoneMutationVariables>(ReclaimMilestoneDocument, options);
      }
export type ReclaimMilestoneMutationHookResult = ReturnType<typeof useReclaimMilestoneMutation>;
export type ReclaimMilestoneMutationResult = Apollo.MutationResult<ReclaimMilestoneMutation>;
export type ReclaimMilestoneMutationOptions = Apollo.BaseMutationOptions<ReclaimMilestoneMutation, ReclaimMilestoneMutationVariables>;