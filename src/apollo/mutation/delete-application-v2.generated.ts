import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeleteApplicationV2MutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteApplicationV2Mutation = { __typename?: 'Mutation', deleteApplicationV2?: { __typename?: 'ApplicationV2', id?: string | null, status?: Types.ApplicationStatusV2 | null, createdAt?: any | null, updatedAt?: any | null, applicant?: { __typename?: 'UserV2', id?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null } | null, program?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null } | null } | null };


export const DeleteApplicationV2Document = gql`
    mutation deleteApplicationV2($id: ID!) {
  deleteApplicationV2(id: $id) {
    id
    status
    createdAt
    updatedAt
    applicant {
      id
      email
      firstName
      lastName
    }
    program {
      id
      title
    }
  }
}
    `;
export type DeleteApplicationV2MutationFn = Apollo.MutationFunction<DeleteApplicationV2Mutation, DeleteApplicationV2MutationVariables>;

/**
 * __useDeleteApplicationV2Mutation__
 *
 * To run a mutation, you first call `useDeleteApplicationV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteApplicationV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteApplicationV2Mutation, { data, loading, error }] = useDeleteApplicationV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteApplicationV2Mutation(baseOptions?: Apollo.MutationHookOptions<DeleteApplicationV2Mutation, DeleteApplicationV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteApplicationV2Mutation, DeleteApplicationV2MutationVariables>(DeleteApplicationV2Document, options);
      }
export type DeleteApplicationV2MutationHookResult = ReturnType<typeof useDeleteApplicationV2Mutation>;
export type DeleteApplicationV2MutationResult = Apollo.MutationResult<DeleteApplicationV2Mutation>;
export type DeleteApplicationV2MutationOptions = Apollo.BaseMutationOptions<DeleteApplicationV2Mutation, DeleteApplicationV2MutationVariables>;