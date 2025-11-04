import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateApplicationChatroomV2MutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  input: Types.UpdateApplicationChatroomV2Input;
}>;


export type UpdateApplicationChatroomV2Mutation = { __typename?: 'Mutation', updateApplicationChatroomV2?: { __typename?: 'ApplicationV2', id?: string | null, chatroomMessageId?: string | null, status?: Types.ApplicationStatusV2 | null, createdAt?: any | null, updatedAt?: any | null, applicant?: { __typename?: 'UserV2', id?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, profileImage?: string | null } | null, program?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null } | null } | null };


export const UpdateApplicationChatroomV2Document = gql`
    mutation updateApplicationChatroomV2($id: ID!, $input: UpdateApplicationChatroomV2Input!) {
  updateApplicationChatroomV2(id: $id, input: $input) {
    id
    chatroomMessageId
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
export type UpdateApplicationChatroomV2MutationFn = Apollo.MutationFunction<UpdateApplicationChatroomV2Mutation, UpdateApplicationChatroomV2MutationVariables>;

/**
 * __useUpdateApplicationChatroomV2Mutation__
 *
 * To run a mutation, you first call `useUpdateApplicationChatroomV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateApplicationChatroomV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateApplicationChatroomV2Mutation, { data, loading, error }] = useUpdateApplicationChatroomV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateApplicationChatroomV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateApplicationChatroomV2Mutation, UpdateApplicationChatroomV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateApplicationChatroomV2Mutation, UpdateApplicationChatroomV2MutationVariables>(UpdateApplicationChatroomV2Document, options);
      }
export type UpdateApplicationChatroomV2MutationHookResult = ReturnType<typeof useUpdateApplicationChatroomV2Mutation>;
export type UpdateApplicationChatroomV2MutationResult = Apollo.MutationResult<UpdateApplicationChatroomV2Mutation>;
export type UpdateApplicationChatroomV2MutationOptions = Apollo.BaseMutationOptions<UpdateApplicationChatroomV2Mutation, UpdateApplicationChatroomV2MutationVariables>;