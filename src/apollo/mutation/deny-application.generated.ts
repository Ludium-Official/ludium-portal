import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DenyApplicationMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DenyApplicationMutation = { __typename?: 'Mutation', denyApplication?: { __typename?: 'Application', content?: string | null, id?: string | null, metadata?: any | null, name?: string | null, price?: string | null, status?: Types.ApplicationStatus | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null } | null };


export const DenyApplicationDocument = gql`
    mutation denyApplication($id: ID!) {
  denyApplication(id: $id) {
    content
    id
    links {
      title
      url
    }
    metadata
    name
    price
    status
  }
}
    `;
export type DenyApplicationMutationFn = Apollo.MutationFunction<DenyApplicationMutation, DenyApplicationMutationVariables>;

/**
 * __useDenyApplicationMutation__
 *
 * To run a mutation, you first call `useDenyApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDenyApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [denyApplicationMutation, { data, loading, error }] = useDenyApplicationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDenyApplicationMutation(baseOptions?: Apollo.MutationHookOptions<DenyApplicationMutation, DenyApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DenyApplicationMutation, DenyApplicationMutationVariables>(DenyApplicationDocument, options);
      }
export type DenyApplicationMutationHookResult = ReturnType<typeof useDenyApplicationMutation>;
export type DenyApplicationMutationResult = Apollo.MutationResult<DenyApplicationMutation>;
export type DenyApplicationMutationOptions = Apollo.BaseMutationOptions<DenyApplicationMutation, DenyApplicationMutationVariables>;