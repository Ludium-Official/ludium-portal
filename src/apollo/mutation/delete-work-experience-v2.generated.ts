import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeleteWorkExperienceV2MutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteWorkExperienceV2Mutation = { __typename?: 'Mutation', deleteWorkExperienceV2?: boolean | null };


export const DeleteWorkExperienceV2Document = gql`
    mutation deleteWorkExperienceV2($id: ID!) {
  deleteWorkExperienceV2(id: $id)
}
    `;
export type DeleteWorkExperienceV2MutationFn = Apollo.MutationFunction<DeleteWorkExperienceV2Mutation, DeleteWorkExperienceV2MutationVariables>;

/**
 * __useDeleteWorkExperienceV2Mutation__
 *
 * To run a mutation, you first call `useDeleteWorkExperienceV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteWorkExperienceV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteWorkExperienceV2Mutation, { data, loading, error }] = useDeleteWorkExperienceV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteWorkExperienceV2Mutation(baseOptions?: Apollo.MutationHookOptions<DeleteWorkExperienceV2Mutation, DeleteWorkExperienceV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteWorkExperienceV2Mutation, DeleteWorkExperienceV2MutationVariables>(DeleteWorkExperienceV2Document, options);
      }
export type DeleteWorkExperienceV2MutationHookResult = ReturnType<typeof useDeleteWorkExperienceV2Mutation>;
export type DeleteWorkExperienceV2MutationResult = Apollo.MutationResult<DeleteWorkExperienceV2Mutation>;
export type DeleteWorkExperienceV2MutationOptions = Apollo.BaseMutationOptions<DeleteWorkExperienceV2Mutation, DeleteWorkExperienceV2MutationVariables>;