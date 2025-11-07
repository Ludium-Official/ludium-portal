import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateApplicationV2MutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  input: Types.UpdateApplicationV2Input;
}>;


export type UpdateApplicationV2Mutation = { __typename?: 'Mutation', updateApplicationV2?: { __typename?: 'ApplicationV2', id?: string | null, status?: Types.ApplicationStatusV2 | null, createdAt?: any | null, updatedAt?: any | null, applicant?: { __typename?: 'UserV2', id?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, profileImage?: string | null } | null, program?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null } | null } | null };


export const UpdateApplicationV2Document = gql`
    mutation updateApplicationV2($id: ID!, $input: UpdateApplicationV2Input!) {
  updateApplicationV2(id: $id, input: $input) {
    id
    status
    createdAt
    updatedAt
    applicant {
      id
      email
      firstName
      lastName
      profileImage
    }
    program {
      id
      title
    }
  }
}
    `;
export type UpdateApplicationV2MutationFn = Apollo.MutationFunction<UpdateApplicationV2Mutation, UpdateApplicationV2MutationVariables>;

/**
 * __useUpdateApplicationV2Mutation__
 *
 * To run a mutation, you first call `useUpdateApplicationV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateApplicationV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateApplicationV2Mutation, { data, loading, error }] = useUpdateApplicationV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateApplicationV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateApplicationV2Mutation, UpdateApplicationV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateApplicationV2Mutation, UpdateApplicationV2MutationVariables>(UpdateApplicationV2Document, options);
      }
export type UpdateApplicationV2MutationHookResult = ReturnType<typeof useUpdateApplicationV2Mutation>;
export type UpdateApplicationV2MutationResult = Apollo.MutationResult<UpdateApplicationV2Mutation>;
export type UpdateApplicationV2MutationOptions = Apollo.BaseMutationOptions<UpdateApplicationV2Mutation, UpdateApplicationV2MutationVariables>;