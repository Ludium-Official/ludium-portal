import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ToggleArticleLikeMutationVariables = Types.Exact<{
  articleId: Types.Scalars['ID']['input'];
}>;


export type ToggleArticleLikeMutation = { __typename?: 'Mutation', toggleArticleLike?: boolean | null };


export const ToggleArticleLikeDocument = gql`
    mutation toggleArticleLike($articleId: ID!) {
  toggleArticleLike(articleId: $articleId)
}
    `;
export type ToggleArticleLikeMutationFn = Apollo.MutationFunction<ToggleArticleLikeMutation, ToggleArticleLikeMutationVariables>;

/**
 * __useToggleArticleLikeMutation__
 *
 * To run a mutation, you first call `useToggleArticleLikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleArticleLikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleArticleLikeMutation, { data, loading, error }] = useToggleArticleLikeMutation({
 *   variables: {
 *      articleId: // value for 'articleId'
 *   },
 * });
 */
export function useToggleArticleLikeMutation(baseOptions?: Apollo.MutationHookOptions<ToggleArticleLikeMutation, ToggleArticleLikeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleArticleLikeMutation, ToggleArticleLikeMutationVariables>(ToggleArticleLikeDocument, options);
      }
export type ToggleArticleLikeMutationHookResult = ReturnType<typeof useToggleArticleLikeMutation>;
export type ToggleArticleLikeMutationResult = Apollo.MutationResult<ToggleArticleLikeMutation>;
export type ToggleArticleLikeMutationOptions = Apollo.BaseMutationOptions<ToggleArticleLikeMutation, ToggleArticleLikeMutationVariables>;