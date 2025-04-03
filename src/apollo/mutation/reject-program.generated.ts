import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RejectProgramMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type RejectProgramMutation = { __typename?: 'Mutation', rejectProgram?: { __typename?: 'Program', currency?: string | null, deadline?: any | null, description?: string | null, id?: string | null, name?: string | null, price?: string | null, status?: string | null, summary?: string | null, creator?: { __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null } | null, validator?: { __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null } | null } | null };


export const RejectProgramDocument = gql`
    mutation rejectProgram($id: ID!) {
  rejectProgram(id: $id) {
    creator {
      about
      email
      firstName
      id
      image
      lastName
      organizationName
    }
    currency
    deadline
    description
    id
    name
    price
    status
    summary
    validator {
      about
      email
      firstName
      id
      image
      lastName
      organizationName
    }
  }
}
    `;
export type RejectProgramMutationFn = Apollo.MutationFunction<RejectProgramMutation, RejectProgramMutationVariables>;

/**
 * __useRejectProgramMutation__
 *
 * To run a mutation, you first call `useRejectProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectProgramMutation, { data, loading, error }] = useRejectProgramMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRejectProgramMutation(baseOptions?: Apollo.MutationHookOptions<RejectProgramMutation, RejectProgramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectProgramMutation, RejectProgramMutationVariables>(RejectProgramDocument, options);
      }
export type RejectProgramMutationHookResult = ReturnType<typeof useRejectProgramMutation>;
export type RejectProgramMutationResult = Apollo.MutationResult<RejectProgramMutation>;
export type RejectProgramMutationOptions = Apollo.BaseMutationOptions<RejectProgramMutation, RejectProgramMutationVariables>;