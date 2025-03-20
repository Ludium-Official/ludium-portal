import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateProgramMutationVariables = Types.Exact<{
  input: Types.CreateProgramInput;
}>;


export type CreateProgramMutation = { __typename?: 'Mutation', createProgram?: { __typename?: 'Program', currency?: string | null, deadline?: any | null, description?: string | null, id?: string | null, name?: string | null, price?: string | null, status?: string | null, summary?: string | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null } | null };


export const CreateProgramDocument = gql`
    mutation createProgram($input: CreateProgramInput!) {
  createProgram(input: $input) {
    currency
    deadline
    description
    id
    links {
      title
      url
    }
    name
    price
    status
    summary
  }
}
    `;
export type CreateProgramMutationFn = Apollo.MutationFunction<CreateProgramMutation, CreateProgramMutationVariables>;

/**
 * __useCreateProgramMutation__
 *
 * To run a mutation, you first call `useCreateProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProgramMutation, { data, loading, error }] = useCreateProgramMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProgramMutation(baseOptions?: Apollo.MutationHookOptions<CreateProgramMutation, CreateProgramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProgramMutation, CreateProgramMutationVariables>(CreateProgramDocument, options);
      }
export type CreateProgramMutationHookResult = ReturnType<typeof useCreateProgramMutation>;
export type CreateProgramMutationResult = Apollo.MutationResult<CreateProgramMutation>;
export type CreateProgramMutationOptions = Apollo.BaseMutationOptions<CreateProgramMutation, CreateProgramMutationVariables>;