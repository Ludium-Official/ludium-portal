import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type SubmitProgramMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  educhainProgramId: Types.Scalars['Int']['input'];
  txHash: Types.Scalars['String']['input'];
}>;


export type SubmitProgramMutation = { __typename?: 'Mutation', submitProgram?: { __typename?: 'Program', currency?: string | null, deadline?: any | null, description?: string | null, id?: string | null, name?: string | null, price?: string | null, status?: Types.ProgramStatus | null, summary?: string | null, creator?: { __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null } | null, validator?: { __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null } | null } | null };


export const SubmitProgramDocument = gql`
    mutation submitProgram($id: ID!, $educhainProgramId: Int!, $txHash: String!) {
  submitProgram(id: $id, educhainProgramId: $educhainProgramId, txHash: $txHash) {
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
export type SubmitProgramMutationFn = Apollo.MutationFunction<SubmitProgramMutation, SubmitProgramMutationVariables>;

/**
 * __useSubmitProgramMutation__
 *
 * To run a mutation, you first call `useSubmitProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitProgramMutation, { data, loading, error }] = useSubmitProgramMutation({
 *   variables: {
 *      id: // value for 'id'
 *      educhainProgramId: // value for 'educhainProgramId'
 *      txHash: // value for 'txHash'
 *   },
 * });
 */
export function useSubmitProgramMutation(baseOptions?: Apollo.MutationHookOptions<SubmitProgramMutation, SubmitProgramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitProgramMutation, SubmitProgramMutationVariables>(SubmitProgramDocument, options);
      }
export type SubmitProgramMutationHookResult = ReturnType<typeof useSubmitProgramMutation>;
export type SubmitProgramMutationResult = Apollo.MutationResult<SubmitProgramMutation>;
export type SubmitProgramMutationOptions = Apollo.BaseMutationOptions<SubmitProgramMutation, SubmitProgramMutationVariables>;