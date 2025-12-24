import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateApplicationV2MutationVariables = Types.Exact<{
  input: Types.CreateApplicationV2Input;
}>;


export type CreateApplicationV2Mutation = { __typename?: 'Mutation', createApplicationV2?: { __typename?: 'ApplicationV2', id?: string | null, status?: Types.ApplicationStatusV2 | null, createdAt?: any | null, updatedAt?: any | null, applicant?: { __typename?: 'UserV2', id?: string | null, email?: string | null, nickname?: string | null, profileImage?: string | null } | null, program?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null } | null } | null };


export const CreateApplicationV2Document = gql`
    mutation createApplicationV2($input: CreateApplicationV2Input!) {
  createApplicationV2(input: $input) {
    id
    status
    createdAt
    updatedAt
    applicant {
      id
      email
      nickname
      profileImage
    }
    program {
      id
      title
    }
  }
}
    `;
export type CreateApplicationV2MutationFn = Apollo.MutationFunction<CreateApplicationV2Mutation, CreateApplicationV2MutationVariables>;

/**
 * __useCreateApplicationV2Mutation__
 *
 * To run a mutation, you first call `useCreateApplicationV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateApplicationV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createApplicationV2Mutation, { data, loading, error }] = useCreateApplicationV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateApplicationV2Mutation(baseOptions?: Apollo.MutationHookOptions<CreateApplicationV2Mutation, CreateApplicationV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateApplicationV2Mutation, CreateApplicationV2MutationVariables>(CreateApplicationV2Document, options);
      }
export type CreateApplicationV2MutationHookResult = ReturnType<typeof useCreateApplicationV2Mutation>;
export type CreateApplicationV2MutationResult = Apollo.MutationResult<CreateApplicationV2Mutation>;
export type CreateApplicationV2MutationOptions = Apollo.BaseMutationOptions<CreateApplicationV2Mutation, CreateApplicationV2MutationVariables>;