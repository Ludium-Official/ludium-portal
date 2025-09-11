import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ShowProgramMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ShowProgramMutation = { __typename?: 'Mutation', showProgram?: { __typename?: 'Program', id?: string | null } | null };


export const ShowProgramDocument = gql`
    mutation showProgram($id: ID!) {
  showProgram(id: $id) {
    id
  }
}
    `;
export type ShowProgramMutationFn = Apollo.MutationFunction<ShowProgramMutation, ShowProgramMutationVariables>;

/**
 * __useShowProgramMutation__
 *
 * To run a mutation, you first call `useShowProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShowProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [showProgramMutation, { data, loading, error }] = useShowProgramMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useShowProgramMutation(baseOptions?: Apollo.MutationHookOptions<ShowProgramMutation, ShowProgramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ShowProgramMutation, ShowProgramMutationVariables>(ShowProgramDocument, options);
      }
export type ShowProgramMutationHookResult = ReturnType<typeof useShowProgramMutation>;
export type ShowProgramMutationResult = Apollo.MutationResult<ShowProgramMutation>;
export type ShowProgramMutationOptions = Apollo.BaseMutationOptions<ShowProgramMutation, ShowProgramMutationVariables>;