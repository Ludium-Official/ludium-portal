import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ShowPostMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ShowPostMutation = { __typename?: 'Mutation', showPost?: { __typename?: 'Post', id?: string | null } | null };


export const ShowPostDocument = gql`
    mutation showPost($id: ID!) {
  showPost(id: $id) {
    id
  }
}
    `;
export type ShowPostMutationFn = Apollo.MutationFunction<ShowPostMutation, ShowPostMutationVariables>;

/**
 * __useShowPostMutation__
 *
 * To run a mutation, you first call `useShowPostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShowPostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [showPostMutation, { data, loading, error }] = useShowPostMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useShowPostMutation(baseOptions?: Apollo.MutationHookOptions<ShowPostMutation, ShowPostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ShowPostMutation, ShowPostMutationVariables>(ShowPostDocument, options);
      }
export type ShowPostMutationHookResult = ReturnType<typeof useShowPostMutation>;
export type ShowPostMutationResult = Apollo.MutationResult<ShowPostMutation>;
export type ShowPostMutationOptions = Apollo.BaseMutationOptions<ShowPostMutation, ShowPostMutationVariables>;