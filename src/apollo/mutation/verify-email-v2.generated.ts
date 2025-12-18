import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type VerifyEmailV2MutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
  verificationCode: Types.Scalars['String']['input'];
}>;


export type VerifyEmailV2Mutation = { __typename?: 'Mutation', verifyEmailV2?: boolean | null };


export const VerifyEmailV2Document = gql`
    mutation verifyEmailV2($email: String!, $verificationCode: String!) {
  verifyEmailV2(email: $email, verificationCode: $verificationCode)
}
    `;
export type VerifyEmailV2MutationFn = Apollo.MutationFunction<VerifyEmailV2Mutation, VerifyEmailV2MutationVariables>;

/**
 * __useVerifyEmailV2Mutation__
 *
 * To run a mutation, you first call `useVerifyEmailV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailV2Mutation, { data, loading, error }] = useVerifyEmailV2Mutation({
 *   variables: {
 *      email: // value for 'email'
 *      verificationCode: // value for 'verificationCode'
 *   },
 * });
 */
export function useVerifyEmailV2Mutation(baseOptions?: Apollo.MutationHookOptions<VerifyEmailV2Mutation, VerifyEmailV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyEmailV2Mutation, VerifyEmailV2MutationVariables>(VerifyEmailV2Document, options);
      }
export type VerifyEmailV2MutationHookResult = ReturnType<typeof useVerifyEmailV2Mutation>;
export type VerifyEmailV2MutationResult = Apollo.MutationResult<VerifyEmailV2Mutation>;
export type VerifyEmailV2MutationOptions = Apollo.BaseMutationOptions<VerifyEmailV2Mutation, VerifyEmailV2MutationVariables>;