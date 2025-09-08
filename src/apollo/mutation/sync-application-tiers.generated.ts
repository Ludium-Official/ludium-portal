import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SyncApplicationTiersMutationVariables = Types.Exact<{
  applicationId: Types.Scalars['ID']['input'];
}>;


export type SyncApplicationTiersMutation = { __typename?: 'Mutation', syncApplicationTiers?: { __typename?: 'TierSyncResult', success?: boolean | null, message?: string | null, projectId?: number | null, contractAddress?: string | null, tierAssignments?: Array<{ __typename?: 'TierAssignmentData', userId?: string | null, walletAddress?: string | null, tier?: string | null, maxInvestmentAmount?: string | null }> | null } | null };


export const SyncApplicationTiersDocument = gql`
    mutation syncApplicationTiers($applicationId: ID!) {
  syncApplicationTiers(applicationId: $applicationId) {
    success
    message
    projectId
    contractAddress
    tierAssignments {
      userId
      walletAddress
      tier
      maxInvestmentAmount
    }
  }
}
    `;
export type SyncApplicationTiersMutationFn = Apollo.MutationFunction<SyncApplicationTiersMutation, SyncApplicationTiersMutationVariables>;

/**
 * __useSyncApplicationTiersMutation__
 *
 * To run a mutation, you first call `useSyncApplicationTiersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSyncApplicationTiersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [syncApplicationTiersMutation, { data, loading, error }] = useSyncApplicationTiersMutation({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useSyncApplicationTiersMutation(baseOptions?: Apollo.MutationHookOptions<SyncApplicationTiersMutation, SyncApplicationTiersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SyncApplicationTiersMutation, SyncApplicationTiersMutationVariables>(SyncApplicationTiersDocument, options);
      }
export type SyncApplicationTiersMutationHookResult = ReturnType<typeof useSyncApplicationTiersMutation>;
export type SyncApplicationTiersMutationResult = Apollo.MutationResult<SyncApplicationTiersMutation>;
export type SyncApplicationTiersMutationOptions = Apollo.BaseMutationOptions<SyncApplicationTiersMutation, SyncApplicationTiersMutationVariables>;