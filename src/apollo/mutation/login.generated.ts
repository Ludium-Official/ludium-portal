import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
  userId: Types.Scalars['ID']['input'];
  walletId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  network?: Types.InputMaybe<Types.Scalars['String']['input']>;
  address?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: string | null };


export const LoginDocument = gql`
    mutation login($email: String!, $userId: ID!, $walletId: String, $network: String, $address: String) {
  login(
    email: $email
    userId: $userId
    walletId: $walletId
    network: $network
    address: $address
  )
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      userId: // value for 'userId'
 *      walletId: // value for 'walletId'
 *      network: // value for 'network'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;