import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AssignValidatorToProgramMutationVariables = Types.Exact<{
  programId: Types.Scalars['ID']['input'];
  validatorId: Types.Scalars['ID']['input'];
}>;


export type AssignValidatorToProgramMutation = { __typename?: 'Mutation', assignValidatorToProgram?: { __typename?: 'Program', validators?: Array<{ __typename?: 'User', about?: string | null, firstName?: string | null, lastName?: string | null, organizationName?: string | null, walletAddress?: string | null }> | null } | null };


export const AssignValidatorToProgramDocument = gql`
    mutation assignValidatorToProgram($programId: ID!, $validatorId: ID!) {
  assignValidatorToProgram(programId: $programId, validatorId: $validatorId) {
    validators {
      about
      firstName
      lastName
      organizationName
      walletAddress
    }
  }
}
    `;
export type AssignValidatorToProgramMutationFn = Apollo.MutationFunction<AssignValidatorToProgramMutation, AssignValidatorToProgramMutationVariables>;

/**
 * __useAssignValidatorToProgramMutation__
 *
 * To run a mutation, you first call `useAssignValidatorToProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignValidatorToProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignValidatorToProgramMutation, { data, loading, error }] = useAssignValidatorToProgramMutation({
 *   variables: {
 *      programId: // value for 'programId'
 *      validatorId: // value for 'validatorId'
 *   },
 * });
 */
export function useAssignValidatorToProgramMutation(baseOptions?: Apollo.MutationHookOptions<AssignValidatorToProgramMutation, AssignValidatorToProgramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignValidatorToProgramMutation, AssignValidatorToProgramMutationVariables>(AssignValidatorToProgramDocument, options);
      }
export type AssignValidatorToProgramMutationHookResult = ReturnType<typeof useAssignValidatorToProgramMutation>;
export type AssignValidatorToProgramMutationResult = Apollo.MutationResult<AssignValidatorToProgramMutation>;
export type AssignValidatorToProgramMutationOptions = Apollo.BaseMutationOptions<AssignValidatorToProgramMutation, AssignValidatorToProgramMutationVariables>;