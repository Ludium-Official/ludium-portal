import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateProfileV2MutationVariables = Types.Exact<{
  input: Types.UpdateProfileV2Input;
}>;


export type UpdateProfileV2Mutation = { __typename?: 'Mutation', updateProfileV2?: { __typename?: 'UserV2', id?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, walletAddress?: string | null, organizationName?: string | null, profileImage?: string | null, bio?: string | null, skills?: Array<string> | null, links?: Array<string> | null, createdAt?: any | null, updatedAt?: any | null } | null };


export const UpdateProfileV2Document = gql`
    mutation updateProfileV2($input: UpdateProfileV2Input!) {
  updateProfileV2(input: $input) {
    id
    email
    firstName
    lastName
    walletAddress
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
export type UpdateProfileV2MutationFn = Apollo.MutationFunction<UpdateProfileV2Mutation, UpdateProfileV2MutationVariables>;

/**
 * __useUpdateProfileV2Mutation__
 *
 * To run a mutation, you first call `useUpdateProfileV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileV2Mutation, { data, loading, error }] = useUpdateProfileV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProfileV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileV2Mutation, UpdateProfileV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfileV2Mutation, UpdateProfileV2MutationVariables>(UpdateProfileV2Document, options);
      }
export type UpdateProfileV2MutationHookResult = ReturnType<typeof useUpdateProfileV2Mutation>;
export type UpdateProfileV2MutationResult = Apollo.MutationResult<UpdateProfileV2Mutation>;
export type UpdateProfileV2MutationOptions = Apollo.BaseMutationOptions<UpdateProfileV2Mutation, UpdateProfileV2MutationVariables>;