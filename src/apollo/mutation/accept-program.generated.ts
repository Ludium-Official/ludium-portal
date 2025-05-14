import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AcceptProgramMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type AcceptProgramMutation = { __typename?: 'Mutation', acceptProgram?: { __typename?: 'Program', id?: string | null, name?: string | null, price?: string | null, status?: string | null, summary?: string | null, keywords?: Array<{ __typename?: 'Keyword', id?: string | null, name?: string | null }> | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null } | null };


export const AcceptProgramDocument = gql`
    mutation acceptProgram($id: ID!) {
  acceptProgram(id: $id) {
    id
    keywords {
      id
      name
    }
    links {
      title
      url
    }
    name
    price
    status
    summary
  }
}
    `;
export type AcceptProgramMutationFn = Apollo.MutationFunction<AcceptProgramMutation, AcceptProgramMutationVariables>;

/**
 * __useAcceptProgramMutation__
 *
 * To run a mutation, you first call `useAcceptProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptProgramMutation, { data, loading, error }] = useAcceptProgramMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAcceptProgramMutation(baseOptions?: Apollo.MutationHookOptions<AcceptProgramMutation, AcceptProgramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptProgramMutation, AcceptProgramMutationVariables>(AcceptProgramDocument, options);
      }
export type AcceptProgramMutationHookResult = ReturnType<typeof useAcceptProgramMutation>;
export type AcceptProgramMutationResult = Apollo.MutationResult<AcceptProgramMutation>;
export type AcceptProgramMutationOptions = Apollo.BaseMutationOptions<AcceptProgramMutation, AcceptProgramMutationVariables>;