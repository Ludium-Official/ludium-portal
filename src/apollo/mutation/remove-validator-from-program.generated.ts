import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RemoveValidatorFromProgramMutationVariables = Types.Exact<{
  programId: Types.Scalars['ID']['input'];
  validatorId: Types.Scalars['ID']['input'];
}>;


export type RemoveValidatorFromProgramMutation = { __typename?: 'Mutation', removeValidatorFromProgram?: { __typename?: 'Program', validators?: Array<{ __typename?: 'User', about?: string | null, firstName?: string | null, lastName?: string | null, organizationName?: string | null, walletAddress?: string | null }> | null } | null };


export const RemoveValidatorFromProgramDocument = gql`
    mutation removeValidatorFromProgram($programId: ID!, $validatorId: ID!) {
  removeValidatorFromProgram(programId: $programId, validatorId: $validatorId) {
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
export type RemoveValidatorFromProgramMutationFn = Apollo.MutationFunction<RemoveValidatorFromProgramMutation, RemoveValidatorFromProgramMutationVariables>;

/**
 * __useRemoveValidatorFromProgramMutation__
 *
 * To run a mutation, you first call `useRemoveValidatorFromProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveValidatorFromProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeValidatorFromProgramMutation, { data, loading, error }] = useRemoveValidatorFromProgramMutation({
 *   variables: {
 *      programId: // value for 'programId'
 *      validatorId: // value for 'validatorId'
 *   },
 * });
 */
export function useRemoveValidatorFromProgramMutation(baseOptions?: Apollo.MutationHookOptions<RemoveValidatorFromProgramMutation, RemoveValidatorFromProgramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveValidatorFromProgramMutation, RemoveValidatorFromProgramMutationVariables>(RemoveValidatorFromProgramDocument, options);
      }
export type RemoveValidatorFromProgramMutationHookResult = ReturnType<typeof useRemoveValidatorFromProgramMutation>;
export type RemoveValidatorFromProgramMutationResult = Apollo.MutationResult<RemoveValidatorFromProgramMutation>;
export type RemoveValidatorFromProgramMutationOptions = Apollo.BaseMutationOptions<RemoveValidatorFromProgramMutation, RemoveValidatorFromProgramMutationVariables>;