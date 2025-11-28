import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeleteProgramV2MutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteProgramV2Mutation = { __typename?: 'Mutation', deleteProgramV2?: string | null };


export const DeleteProgramV2Document = gql`
    mutation deleteProgramV2($id: ID!) {
  deleteProgramV2(id: $id)
}
    `;
export type DeleteProgramV2MutationFn = Apollo.MutationFunction<DeleteProgramV2Mutation, DeleteProgramV2MutationVariables>;

/**
 * __useDeleteProgramV2Mutation__
 *
 * To run a mutation, you first call `useDeleteProgramV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProgramV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProgramV2Mutation, { data, loading, error }] = useDeleteProgramV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProgramV2Mutation(baseOptions?: Apollo.MutationHookOptions<DeleteProgramV2Mutation, DeleteProgramV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProgramV2Mutation, DeleteProgramV2MutationVariables>(DeleteProgramV2Document, options);
      }
export type DeleteProgramV2MutationHookResult = ReturnType<typeof useDeleteProgramV2Mutation>;
export type DeleteProgramV2MutationResult = Apollo.MutationResult<DeleteProgramV2Mutation>;
export type DeleteProgramV2MutationOptions = Apollo.BaseMutationOptions<DeleteProgramV2Mutation, DeleteProgramV2MutationVariables>;