import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ReclaimMilestoneWithTxMutationVariables = Types.Exact<{
  milestoneId: Types.Scalars['ID']['input'];
  txHash: Types.Scalars['String']['input'];
}>;


export type ReclaimMilestoneWithTxMutation = { __typename?: 'Mutation', reclaimMilestone?: { __typename?: 'Milestone', id?: string | null, title?: string | null, reclaimed?: boolean | null, reclaimTxHash?: string | null, reclaimedAt?: any | null, canReclaim?: boolean | null } | null };


export const ReclaimMilestoneWithTxDocument = gql`
    mutation reclaimMilestoneWithTx($milestoneId: ID!, $txHash: String!) {
  reclaimMilestone(milestoneId: $milestoneId, txHash: $txHash) {
    id
    title
    reclaimed
    reclaimTxHash
    reclaimedAt
    canReclaim
  }
}
    `;
export type ReclaimMilestoneWithTxMutationFn = Apollo.MutationFunction<ReclaimMilestoneWithTxMutation, ReclaimMilestoneWithTxMutationVariables>;

/**
 * __useReclaimMilestoneWithTxMutation__
 *
 * To run a mutation, you first call `useReclaimMilestoneWithTxMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReclaimMilestoneWithTxMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reclaimMilestoneWithTxMutation, { data, loading, error }] = useReclaimMilestoneWithTxMutation({
 *   variables: {
 *      milestoneId: // value for 'milestoneId'
 *      txHash: // value for 'txHash'
 *   },
 * });
 */
export function useReclaimMilestoneWithTxMutation(baseOptions?: Apollo.MutationHookOptions<ReclaimMilestoneWithTxMutation, ReclaimMilestoneWithTxMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReclaimMilestoneWithTxMutation, ReclaimMilestoneWithTxMutationVariables>(ReclaimMilestoneWithTxDocument, options);
      }
export type ReclaimMilestoneWithTxMutationHookResult = ReturnType<typeof useReclaimMilestoneWithTxMutation>;
export type ReclaimMilestoneWithTxMutationResult = Apollo.MutationResult<ReclaimMilestoneWithTxMutation>;
export type ReclaimMilestoneWithTxMutationOptions = Apollo.BaseMutationOptions<ReclaimMilestoneWithTxMutation, ReclaimMilestoneWithTxMutationVariables>;