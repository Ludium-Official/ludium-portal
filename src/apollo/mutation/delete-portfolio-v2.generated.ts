import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeletePortfolioV2MutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeletePortfolioV2Mutation = { __typename?: 'Mutation', deletePortfolioV2?: boolean | null };


export const DeletePortfolioV2Document = gql`
    mutation deletePortfolioV2($id: ID!) {
  deletePortfolioV2(id: $id)
}
    `;
export type DeletePortfolioV2MutationFn = Apollo.MutationFunction<DeletePortfolioV2Mutation, DeletePortfolioV2MutationVariables>;

/**
 * __useDeletePortfolioV2Mutation__
 *
 * To run a mutation, you first call `useDeletePortfolioV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePortfolioV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePortfolioV2Mutation, { data, loading, error }] = useDeletePortfolioV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePortfolioV2Mutation(baseOptions?: Apollo.MutationHookOptions<DeletePortfolioV2Mutation, DeletePortfolioV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePortfolioV2Mutation, DeletePortfolioV2MutationVariables>(DeletePortfolioV2Document, options);
      }
export type DeletePortfolioV2MutationHookResult = ReturnType<typeof useDeletePortfolioV2Mutation>;
export type DeletePortfolioV2MutationResult = Apollo.MutationResult<DeletePortfolioV2Mutation>;
export type DeletePortfolioV2MutationOptions = Apollo.BaseMutationOptions<DeletePortfolioV2Mutation, DeletePortfolioV2MutationVariables>;