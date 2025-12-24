import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RequestEmailVerificationV2MutationVariables = Types.Exact<{
  input: Types.RequestEmailVerificationV2Input;
}>;


export type RequestEmailVerificationV2Mutation = { __typename?: 'Mutation', requestEmailVerificationV2?: boolean | null };


export const RequestEmailVerificationV2Document = gql`
    mutation requestEmailVerificationV2($input: RequestEmailVerificationV2Input!) {
  requestEmailVerificationV2(input: $input)
}
    `;
export type RequestEmailVerificationV2MutationFn = Apollo.MutationFunction<RequestEmailVerificationV2Mutation, RequestEmailVerificationV2MutationVariables>;

/**
 * __useRequestEmailVerificationV2Mutation__
 *
 * To run a mutation, you first call `useRequestEmailVerificationV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestEmailVerificationV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestEmailVerificationV2Mutation, { data, loading, error }] = useRequestEmailVerificationV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRequestEmailVerificationV2Mutation(baseOptions?: Apollo.MutationHookOptions<RequestEmailVerificationV2Mutation, RequestEmailVerificationV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestEmailVerificationV2Mutation, RequestEmailVerificationV2MutationVariables>(RequestEmailVerificationV2Document, options);
      }
export type RequestEmailVerificationV2MutationHookResult = ReturnType<typeof useRequestEmailVerificationV2Mutation>;
export type RequestEmailVerificationV2MutationResult = Apollo.MutationResult<RequestEmailVerificationV2Mutation>;
export type RequestEmailVerificationV2MutationOptions = Apollo.BaseMutationOptions<RequestEmailVerificationV2Mutation, RequestEmailVerificationV2MutationVariables>;