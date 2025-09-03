import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ReclaimProgramWithTxMutationVariables = Types.Exact<{
  programId: Types.Scalars['ID']['input'];
  txHash: Types.Scalars['String']['input'];
}>;


export type ReclaimProgramWithTxMutation = { __typename?: 'Mutation', reclaimProgram?: { __typename?: 'Program', id?: string | null, name?: string | null, reclaimed?: boolean | null, reclaimTxHash?: string | null, reclaimedAt?: any | null, canReclaim?: boolean | null } | null };


export const ReclaimProgramWithTxDocument = gql`
    mutation reclaimProgramWithTx($programId: ID!, $txHash: String!) {
  reclaimProgram(programId: $programId, txHash: $txHash) {
    id
    name
    reclaimed
    reclaimTxHash
    reclaimedAt
    canReclaim
  }
}
    `;
export type ReclaimProgramWithTxMutationFn = Apollo.MutationFunction<ReclaimProgramWithTxMutation, ReclaimProgramWithTxMutationVariables>;

/**
 * __useReclaimProgramWithTxMutation__
 *
 * To run a mutation, you first call `useReclaimProgramWithTxMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReclaimProgramWithTxMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reclaimProgramWithTxMutation, { data, loading, error }] = useReclaimProgramWithTxMutation({
 *   variables: {
 *      programId: // value for 'programId'
 *      txHash: // value for 'txHash'
 *   },
 * });
 */
export function useReclaimProgramWithTxMutation(baseOptions?: Apollo.MutationHookOptions<ReclaimProgramWithTxMutation, ReclaimProgramWithTxMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReclaimProgramWithTxMutation, ReclaimProgramWithTxMutationVariables>(ReclaimProgramWithTxDocument, options);
      }
export type ReclaimProgramWithTxMutationHookResult = ReturnType<typeof useReclaimProgramWithTxMutation>;
export type ReclaimProgramWithTxMutationResult = Apollo.MutationResult<ReclaimProgramWithTxMutation>;
export type ReclaimProgramWithTxMutationOptions = Apollo.BaseMutationOptions<ReclaimProgramWithTxMutation, ReclaimProgramWithTxMutationVariables>;