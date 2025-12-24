import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreatePortfolioV2MutationVariables = Types.Exact<{
  input: Types.CreatePortfolioV2Input;
}>;


export type CreatePortfolioV2Mutation = { __typename?: 'Mutation', createPortfolioV2?: { __typename?: 'PortfolioV2', id?: string | null, title?: string | null, description?: string | null, role?: string | null, isLudiumProject?: boolean | null, images?: Array<string> | null, createdAt?: string | null, updatedAt?: string | null } | null };


export const CreatePortfolioV2Document = gql`
    mutation createPortfolioV2($input: CreatePortfolioV2Input!) {
  createPortfolioV2(input: $input) {
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
export type CreatePortfolioV2MutationFn = Apollo.MutationFunction<CreatePortfolioV2Mutation, CreatePortfolioV2MutationVariables>;

/**
 * __useCreatePortfolioV2Mutation__
 *
 * To run a mutation, you first call `useCreatePortfolioV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePortfolioV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPortfolioV2Mutation, { data, loading, error }] = useCreatePortfolioV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePortfolioV2Mutation(baseOptions?: Apollo.MutationHookOptions<CreatePortfolioV2Mutation, CreatePortfolioV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePortfolioV2Mutation, CreatePortfolioV2MutationVariables>(CreatePortfolioV2Document, options);
      }
export type CreatePortfolioV2MutationHookResult = ReturnType<typeof useCreatePortfolioV2Mutation>;
export type CreatePortfolioV2MutationResult = Apollo.MutationResult<CreatePortfolioV2Mutation>;
export type CreatePortfolioV2MutationOptions = Apollo.BaseMutationOptions<CreatePortfolioV2Mutation, CreatePortfolioV2MutationVariables>;