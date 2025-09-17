import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GenerateSwappedUrlMutationVariables = Types.Exact<{
  currencyCode: Types.Scalars['String']['input'];
  walletAddress: Types.Scalars['String']['input'];
  amount: Types.Scalars['String']['input'];
  userId: Types.Scalars['String']['input'];
}>;


export type GenerateSwappedUrlMutation = { __typename?: 'Mutation', generateSwappedUrl?: { __typename?: 'SwappedUrlResponse', signedUrl?: string | null, originalUrl?: string | null, signature?: string | null } | null };


export const GenerateSwappedUrlDocument = gql`
    mutation GenerateSwappedUrl($currencyCode: String!, $walletAddress: String!, $amount: String!, $userId: String!) {
  generateSwappedUrl(
    currencyCode: $currencyCode
    walletAddress: $walletAddress
    amount: $amount
    userId: $userId
  ) {
    signedUrl
    originalUrl
    signature
  }
}
    `;
export type GenerateSwappedUrlMutationFn = Apollo.MutationFunction<GenerateSwappedUrlMutation, GenerateSwappedUrlMutationVariables>;

/**
 * __useGenerateSwappedUrlMutation__
 *
 * To run a mutation, you first call `useGenerateSwappedUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateSwappedUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateSwappedUrlMutation, { data, loading, error }] = useGenerateSwappedUrlMutation({
 *   variables: {
 *      currencyCode: // value for 'currencyCode'
 *      walletAddress: // value for 'walletAddress'
 *      amount: // value for 'amount'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGenerateSwappedUrlMutation(baseOptions?: Apollo.MutationHookOptions<GenerateSwappedUrlMutation, GenerateSwappedUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateSwappedUrlMutation, GenerateSwappedUrlMutationVariables>(GenerateSwappedUrlDocument, options);
      }
export type GenerateSwappedUrlMutationHookResult = ReturnType<typeof useGenerateSwappedUrlMutation>;
export type GenerateSwappedUrlMutationResult = Apollo.MutationResult<GenerateSwappedUrlMutation>;
export type GenerateSwappedUrlMutationOptions = Apollo.BaseMutationOptions<GenerateSwappedUrlMutation, GenerateSwappedUrlMutationVariables>;