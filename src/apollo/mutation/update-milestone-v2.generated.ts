import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateMilestoneV2MutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  input: Types.UpdateMilestoneV2Input;
}>;


export type UpdateMilestoneV2Mutation = { __typename?: 'Mutation', updateMilestoneV2?: { __typename?: 'MilestoneV2', id?: string | null, title?: string | null, description?: string | null, payout?: string | null, deadline?: any | null, status?: Types.MilestoneStatusV2 | null, createdAt?: any | null, updatedAt?: any | null, applicant?: { __typename?: 'UserV2', id?: string | null, walletAddress?: string | null, email?: string | null, nickname?: string | null, profileImage?: string | null } | null, program?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, price?: string | null, deadline?: any | null, status?: Types.ProgramStatusV2 | null } | null } | null };


export const UpdateMilestoneV2Document = gql`
    mutation UpdateMilestoneV2($id: ID!, $input: UpdateMilestoneV2Input!) {
  updateMilestoneV2(id: $id, input: $input) {
    id
    title
    description
    payout
    deadline
    status
    createdAt
    updatedAt
    applicant {
      id
      walletAddress
      email
      nickname
      profileImage
    }
    program {
      id
      title
      description
      price
      deadline
      status
    }
  }
}
    `;
export type UpdateMilestoneV2MutationFn = Apollo.MutationFunction<UpdateMilestoneV2Mutation, UpdateMilestoneV2MutationVariables>;

/**
 * __useUpdateMilestoneV2Mutation__
 *
 * To run a mutation, you first call `useUpdateMilestoneV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMilestoneV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMilestoneV2Mutation, { data, loading, error }] = useUpdateMilestoneV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMilestoneV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateMilestoneV2Mutation, UpdateMilestoneV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMilestoneV2Mutation, UpdateMilestoneV2MutationVariables>(UpdateMilestoneV2Document, options);
      }
export type UpdateMilestoneV2MutationHookResult = ReturnType<typeof useUpdateMilestoneV2Mutation>;
export type UpdateMilestoneV2MutationResult = Apollo.MutationResult<UpdateMilestoneV2Mutation>;
export type UpdateMilestoneV2MutationOptions = Apollo.BaseMutationOptions<UpdateMilestoneV2Mutation, UpdateMilestoneV2MutationVariables>;