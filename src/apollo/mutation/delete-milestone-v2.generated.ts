import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeleteMilestoneV2MutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteMilestoneV2Mutation = { __typename?: 'Mutation', deleteMilestoneV2?: { __typename?: 'MilestoneV2', id?: string | null, title?: string | null, description?: string | null, payout?: string | null, deadline?: any | null, createdAt?: any | null, updatedAt?: any | null } | null };


export const DeleteMilestoneV2Document = gql`
    mutation DeleteMilestoneV2($id: ID!) {
  deleteMilestoneV2(id: $id) {
    id
    title
    description
    payout
    deadline
    createdAt
    updatedAt
  }
}
    `;
export type DeleteMilestoneV2MutationFn = Apollo.MutationFunction<DeleteMilestoneV2Mutation, DeleteMilestoneV2MutationVariables>;

/**
 * __useDeleteMilestoneV2Mutation__
 *
 * To run a mutation, you first call `useDeleteMilestoneV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMilestoneV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMilestoneV2Mutation, { data, loading, error }] = useDeleteMilestoneV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMilestoneV2Mutation(baseOptions?: Apollo.MutationHookOptions<DeleteMilestoneV2Mutation, DeleteMilestoneV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMilestoneV2Mutation, DeleteMilestoneV2MutationVariables>(DeleteMilestoneV2Document, options);
      }
export type DeleteMilestoneV2MutationHookResult = ReturnType<typeof useDeleteMilestoneV2Mutation>;
export type DeleteMilestoneV2MutationResult = Apollo.MutationResult<DeleteMilestoneV2Mutation>;
export type DeleteMilestoneV2MutationOptions = Apollo.BaseMutationOptions<DeleteMilestoneV2Mutation, DeleteMilestoneV2MutationVariables>;