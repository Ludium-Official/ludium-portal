import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ReclaimProgramMutationVariables = Types.Exact<{
  programId: Types.Scalars['ID']['input'];
}>;


export type ReclaimProgramMutation = { __typename?: 'Mutation', reclaimProgram?: { __typename?: 'Program', id?: string | null, name?: string | null, reclaimed?: boolean | null, reclaimTxHash?: string | null, reclaimedAt?: any | null, canReclaim?: boolean | null } | null };


export const ReclaimProgramDocument = gql`
    mutation reclaimProgram($programId: ID!) {
  reclaimProgram(programId: $programId) {
    id
    name
    reclaimed
    reclaimTxHash
    reclaimedAt
    canReclaim
  }
}
    `;
export type ReclaimProgramMutationFn = Apollo.MutationFunction<ReclaimProgramMutation, ReclaimProgramMutationVariables>;

/**
 * __useReclaimProgramMutation__
 *
 * To run a mutation, you first call `useReclaimProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReclaimProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reclaimProgramMutation, { data, loading, error }] = useReclaimProgramMutation({
 *   variables: {
 *      programId: // value for 'programId'
 *   },
 * });
 */
export function useReclaimProgramMutation(baseOptions?: Apollo.MutationHookOptions<ReclaimProgramMutation, ReclaimProgramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReclaimProgramMutation, ReclaimProgramMutationVariables>(ReclaimProgramDocument, options);
      }
export type ReclaimProgramMutationHookResult = ReturnType<typeof useReclaimProgramMutation>;
export type ReclaimProgramMutationResult = Apollo.MutationResult<ReclaimProgramMutation>;
export type ReclaimProgramMutationOptions = Apollo.BaseMutationOptions<ReclaimProgramMutation, ReclaimProgramMutationVariables>;