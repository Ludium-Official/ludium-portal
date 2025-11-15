import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ReclaimInvestmentMutationVariables = Types.Exact<{
  input: Types.ReclaimInvestmentInput;
}>;


export type ReclaimInvestmentMutation = { __typename?: 'Mutation', reclaimInvestment?: { __typename?: 'Investment', id?: string | null, amount?: string | null, status?: Types.InvestmentStatus | null, reclaimed?: boolean | null, reclaimTxHash?: string | null, reclaimedAt?: any | null } | null };


export const ReclaimInvestmentDocument = gql`
    mutation reclaimInvestment($input: ReclaimInvestmentInput!) {
  reclaimInvestment(input: $input) {
    id
    amount
    status
    reclaimed
    reclaimTxHash
    reclaimedAt
  }
}
    `;
export type ReclaimInvestmentMutationFn = Apollo.MutationFunction<ReclaimInvestmentMutation, ReclaimInvestmentMutationVariables>;

/**
 * __useReclaimInvestmentMutation__
 *
 * To run a mutation, you first call `useReclaimInvestmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReclaimInvestmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reclaimInvestmentMutation, { data, loading, error }] = useReclaimInvestmentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useReclaimInvestmentMutation(baseOptions?: Apollo.MutationHookOptions<ReclaimInvestmentMutation, ReclaimInvestmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReclaimInvestmentMutation, ReclaimInvestmentMutationVariables>(ReclaimInvestmentDocument, options);
      }
export type ReclaimInvestmentMutationHookResult = ReturnType<typeof useReclaimInvestmentMutation>;
export type ReclaimInvestmentMutationResult = Apollo.MutationResult<ReclaimInvestmentMutation>;
export type ReclaimInvestmentMutationOptions = Apollo.BaseMutationOptions<ReclaimInvestmentMutation, ReclaimInvestmentMutationVariables>;