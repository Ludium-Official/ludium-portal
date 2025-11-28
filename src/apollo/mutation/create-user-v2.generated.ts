import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateUserV2MutationVariables = Types.Exact<{
  input: Types.CreateUserV2Input;
}>;


export type CreateUserV2Mutation = { __typename?: 'Mutation', createUserV2?: { __typename?: 'UserV2', id?: string | null, role?: Types.UserRoleV2 | null, loginType?: Types.LoginTypeEnum | null, walletAddress?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, organizationName?: string | null, profileImage?: string | null, bio?: string | null, skills?: Array<string> | null, links?: Array<string> | null, createdAt?: any | null, updatedAt?: any | null } | null };


export const CreateUserV2Document = gql`
    mutation createUserV2($input: CreateUserV2Input!) {
  createUserV2(input: $input) {
    id
    role
    loginType
    walletAddress
    email
    firstName
    lastName
    organizationName
    profileImage
    bio
    skills
    links
    createdAt
    updatedAt
  }
}
    `;
export type CreateUserV2MutationFn = Apollo.MutationFunction<CreateUserV2Mutation, CreateUserV2MutationVariables>;

/**
 * __useCreateUserV2Mutation__
 *
 * To run a mutation, you first call `useCreateUserV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserV2Mutation, { data, loading, error }] = useCreateUserV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserV2Mutation(baseOptions?: Apollo.MutationHookOptions<CreateUserV2Mutation, CreateUserV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserV2Mutation, CreateUserV2MutationVariables>(CreateUserV2Document, options);
      }
export type CreateUserV2MutationHookResult = ReturnType<typeof useCreateUserV2Mutation>;
export type CreateUserV2MutationResult = Apollo.MutationResult<CreateUserV2Mutation>;
export type CreateUserV2MutationOptions = Apollo.BaseMutationOptions<CreateUserV2Mutation, CreateUserV2MutationVariables>;