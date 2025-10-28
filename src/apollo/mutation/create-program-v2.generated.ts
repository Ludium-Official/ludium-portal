import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateProgramV2MutationVariables = Types.Exact<{
  input: Types.CreateProgramV2Input;
}>;


export type CreateProgramV2Mutation = { __typename?: 'Mutation', createProgramV2?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, skills?: Array<string> | null, deadline?: any | null, invitedMembers?: Array<string> | null, status?: Types.ProgramStatusV2 | null, visibility?: Types.ProgramVisibilityV2 | null, network?: string | null, price?: string | null, currency?: string | null, createdAt?: any | null, updatedAt?: any | null } | null };


export const CreateProgramV2Document = gql`
    mutation createProgramV2($input: CreateProgramV2Input!) {
  createProgramV2(input: $input) {
    id
    title
    description
    skills
    deadline
    invitedMembers
    status
    visibility
    network
    price
    currency
    createdAt
    updatedAt
  }
}
    `;
export type CreateProgramV2MutationFn = Apollo.MutationFunction<CreateProgramV2Mutation, CreateProgramV2MutationVariables>;

/**
 * __useCreateProgramV2Mutation__
 *
 * To run a mutation, you first call `useCreateProgramV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProgramV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProgramV2Mutation, { data, loading, error }] = useCreateProgramV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProgramV2Mutation(baseOptions?: Apollo.MutationHookOptions<CreateProgramV2Mutation, CreateProgramV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProgramV2Mutation, CreateProgramV2MutationVariables>(CreateProgramV2Document, options);
      }
export type CreateProgramV2MutationHookResult = ReturnType<typeof useCreateProgramV2Mutation>;
export type CreateProgramV2MutationResult = Apollo.MutationResult<CreateProgramV2Mutation>;
export type CreateProgramV2MutationOptions = Apollo.BaseMutationOptions<CreateProgramV2Mutation, CreateProgramV2MutationVariables>;