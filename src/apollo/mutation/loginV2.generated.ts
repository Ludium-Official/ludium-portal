import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginV2MutationVariables = Types.Exact<{
  email?: Types.InputMaybe<Types.Scalars['String']['input']>;
  walletAddress: Types.Scalars['String']['input'];
  loginType: Types.LoginTypeEnum;
}>;


export type LoginV2Mutation = { __typename?: 'Mutation', loginV2?: string | null };


export const LoginV2Document = gql`
    mutation loginV2($email: String, $walletAddress: String!, $loginType: LoginTypeEnum!) {
  loginV2(email: $email, walletAddress: $walletAddress, loginType: $loginType)
}
    `;
export type LoginV2MutationFn = Apollo.MutationFunction<LoginV2Mutation, LoginV2MutationVariables>;

/**
 * __useLoginV2Mutation__
 *
 * To run a mutation, you first call `useLoginV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginV2Mutation, { data, loading, error }] = useLoginV2Mutation({
 *   variables: {
 *      email: // value for 'email'
 *      walletAddress: // value for 'walletAddress'
 *      loginType: // value for 'loginType'
 *   },
 * });
 */
export function useLoginV2Mutation(baseOptions?: Apollo.MutationHookOptions<LoginV2Mutation, LoginV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginV2Mutation, LoginV2MutationVariables>(LoginV2Document, options);
      }
export type LoginV2MutationHookResult = ReturnType<typeof useLoginV2Mutation>;
export type LoginV2MutationResult = Apollo.MutationResult<LoginV2Mutation>;
export type LoginV2MutationOptions = Apollo.BaseMutationOptions<LoginV2Mutation, LoginV2MutationVariables>;