import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeleteEducationV2MutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteEducationV2Mutation = { __typename?: 'Mutation', deleteEducationV2?: boolean | null };


export const DeleteEducationV2Document = gql`
    mutation deleteEducationV2($id: ID!) {
  deleteEducationV2(id: $id)
}
    `;
export type DeleteEducationV2MutationFn = Apollo.MutationFunction<DeleteEducationV2Mutation, DeleteEducationV2MutationVariables>;

/**
 * __useDeleteEducationV2Mutation__
 *
 * To run a mutation, you first call `useDeleteEducationV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEducationV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEducationV2Mutation, { data, loading, error }] = useDeleteEducationV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEducationV2Mutation(baseOptions?: Apollo.MutationHookOptions<DeleteEducationV2Mutation, DeleteEducationV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEducationV2Mutation, DeleteEducationV2MutationVariables>(DeleteEducationV2Document, options);
      }
export type DeleteEducationV2MutationHookResult = ReturnType<typeof useDeleteEducationV2Mutation>;
export type DeleteEducationV2MutationResult = Apollo.MutationResult<DeleteEducationV2Mutation>;
export type DeleteEducationV2MutationOptions = Apollo.BaseMutationOptions<DeleteEducationV2Mutation, DeleteEducationV2MutationVariables>;