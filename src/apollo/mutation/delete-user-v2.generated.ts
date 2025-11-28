import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeleteUserV2MutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteUserV2Mutation = { __typename?: 'Mutation', deleteUserV2?: boolean | null };


export const DeleteUserV2Document = gql`
    mutation deleteUserV2($id: ID!) {
  deleteUserV2(id: $id)
}
    `;
export type DeleteUserV2MutationFn = Apollo.MutationFunction<DeleteUserV2Mutation, DeleteUserV2MutationVariables>;

/**
 * __useDeleteUserV2Mutation__
 *
 * To run a mutation, you first call `useDeleteUserV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserV2Mutation, { data, loading, error }] = useDeleteUserV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserV2Mutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserV2Mutation, DeleteUserV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserV2Mutation, DeleteUserV2MutationVariables>(DeleteUserV2Document, options);
      }
export type DeleteUserV2MutationHookResult = ReturnType<typeof useDeleteUserV2Mutation>;
export type DeleteUserV2MutationResult = Apollo.MutationResult<DeleteUserV2Mutation>;
export type DeleteUserV2MutationOptions = Apollo.BaseMutationOptions<DeleteUserV2Mutation, DeleteUserV2MutationVariables>;