import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdatePortfolioV2MutationVariables = Types.Exact<{
  input: Types.UpdatePortfolioV2Input;
}>;


export type UpdatePortfolioV2Mutation = { __typename?: 'Mutation', updatePortfolioV2?: { __typename?: 'PortfolioV2', id?: string | null, title?: string | null, description?: string | null, role?: string | null, isLudiumProject?: boolean | null, images?: Array<string> | null, createdAt?: string | null, updatedAt?: string | null } | null };


export const UpdatePortfolioV2Document = gql`
    mutation updatePortfolioV2($input: UpdatePortfolioV2Input!) {
  updatePortfolioV2(input: $input) {
    id
    title
    description
    role
    isLudiumProject
    images
    createdAt
    updatedAt
  }
}
    `;
export type UpdatePortfolioV2MutationFn = Apollo.MutationFunction<UpdatePortfolioV2Mutation, UpdatePortfolioV2MutationVariables>;

/**
 * __useUpdatePortfolioV2Mutation__
 *
 * To run a mutation, you first call `useUpdatePortfolioV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePortfolioV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePortfolioV2Mutation, { data, loading, error }] = useUpdatePortfolioV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePortfolioV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdatePortfolioV2Mutation, UpdatePortfolioV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePortfolioV2Mutation, UpdatePortfolioV2MutationVariables>(UpdatePortfolioV2Document, options);
      }
export type UpdatePortfolioV2MutationHookResult = ReturnType<typeof useUpdatePortfolioV2Mutation>;
export type UpdatePortfolioV2MutationResult = Apollo.MutationResult<UpdatePortfolioV2Mutation>;
export type UpdatePortfolioV2MutationOptions = Apollo.BaseMutationOptions<UpdatePortfolioV2Mutation, UpdatePortfolioV2MutationVariables>;