import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HideProgramMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type HideProgramMutation = { __typename?: 'Mutation', hideProgram?: { __typename?: 'Program', id?: string | null } | null };


export const HideProgramDocument = gql`
    mutation hideProgram($id: ID!) {
  hideProgram(id: $id) {
    id
  }
}
    `;
export type HideProgramMutationFn = Apollo.MutationFunction<HideProgramMutation, HideProgramMutationVariables>;

/**
 * __useHideProgramMutation__
 *
 * To run a mutation, you first call `useHideProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHideProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [hideProgramMutation, { data, loading, error }] = useHideProgramMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useHideProgramMutation(baseOptions?: Apollo.MutationHookOptions<HideProgramMutation, HideProgramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HideProgramMutation, HideProgramMutationVariables>(HideProgramDocument, options);
      }
export type HideProgramMutationHookResult = ReturnType<typeof useHideProgramMutation>;
export type HideProgramMutationResult = Apollo.MutationResult<HideProgramMutation>;
export type HideProgramMutationOptions = Apollo.BaseMutationOptions<HideProgramMutation, HideProgramMutationVariables>;