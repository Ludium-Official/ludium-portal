import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateInvestmentMutationVariables = Types.Exact<{
  input: Types.CreateInvestmentInput;
}>;


export type CreateInvestmentMutation = { __typename?: 'Mutation', createInvestment?: { __typename?: 'Investment', amount?: string | null, id?: string | null, reclaimTxHash?: string | null, reclaimed?: boolean | null, reclaimedAt?: any | null, status?: Types.InvestmentStatus | null, tier?: string | null, txHash?: string | null, project?: { __typename?: 'Application', content?: string | null, fundingSuccessful?: boolean | null, fundingTarget?: string | null, id?: string | null, name?: string | null, price?: string | null, rejectionReason?: string | null, status?: Types.ApplicationStatus | null, summary?: string | null, walletAddress?: string | null } | null, supporter?: { __typename?: 'User', about?: string | null, avatar?: any | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, role?: Types.UserRole | null, summary?: string | null, walletAddress?: string | null } | null } | null };


export const CreateInvestmentDocument = gql`
    mutation createInvestment($input: CreateInvestmentInput!) {
  createInvestment(input: $input) {
    amount
    id
    project {
      content
      fundingSuccessful
      fundingTarget
      id
      name
      price
      rejectionReason
      status
      summary
      walletAddress
    }
    reclaimTxHash
    reclaimed
    reclaimedAt
    status
    supporter {
      about
      avatar
      email
      firstName
      id
      image
      role
      summary
      walletAddress
    }
    tier
    txHash
  }
}
    `;
export type CreateInvestmentMutationFn = Apollo.MutationFunction<CreateInvestmentMutation, CreateInvestmentMutationVariables>;

/**
 * __useCreateInvestmentMutation__
 *
 * To run a mutation, you first call `useCreateInvestmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInvestmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInvestmentMutation, { data, loading, error }] = useCreateInvestmentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateInvestmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateInvestmentMutation, CreateInvestmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInvestmentMutation, CreateInvestmentMutationVariables>(CreateInvestmentDocument, options);
      }
export type CreateInvestmentMutationHookResult = ReturnType<typeof useCreateInvestmentMutation>;
export type CreateInvestmentMutationResult = Apollo.MutationResult<CreateInvestmentMutation>;
export type CreateInvestmentMutationOptions = Apollo.BaseMutationOptions<CreateInvestmentMutation, CreateInvestmentMutationVariables>;