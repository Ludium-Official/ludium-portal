import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PublishProgramMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  educhainProgramId: Types.Scalars['Int']['input'];
  txHash: Types.Scalars['String']['input'];
}>;


export type PublishProgramMutation = { __typename?: 'Mutation', publishProgram?: { __typename?: 'Program', currency?: string | null, deadline?: any | null, description?: string | null, id?: string | null, name?: string | null, price?: string | null, status?: string | null, summary?: string | null, creator?: { __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null } | null, validator?: { __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null } | null } | null };


export const PublishProgramDocument = gql`
    mutation publishProgram($id: ID!, $educhainProgramId: Int!, $txHash: String!) {
  publishProgram(id: $id, educhainProgramId: $educhainProgramId, txHash: $txHash) {
    creator {
      about
      email
      firstName
      id
      image
      lastName
      organizationName
    }
    currency
    deadline
    description
    id
    name
    price
    status
    summary
    validator {
      about
      email
      firstName
      id
      image
      lastName
      organizationName
    }
  }
}
    `;
export type PublishProgramMutationFn = Apollo.MutationFunction<PublishProgramMutation, PublishProgramMutationVariables>;

/**
 * __usePublishProgramMutation__
 *
 * To run a mutation, you first call `usePublishProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishProgramMutation, { data, loading, error }] = usePublishProgramMutation({
 *   variables: {
 *      id: // value for 'id'
 *      educhainProgramId: // value for 'educhainProgramId'
 *      txHash: // value for 'txHash'
 *   },
 * });
 */
export function usePublishProgramMutation(baseOptions?: Apollo.MutationHookOptions<PublishProgramMutation, PublishProgramMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishProgramMutation, PublishProgramMutationVariables>(PublishProgramDocument, options);
      }
export type PublishProgramMutationHookResult = ReturnType<typeof usePublishProgramMutation>;
export type PublishProgramMutationResult = Apollo.MutationResult<PublishProgramMutation>;
export type PublishProgramMutationOptions = Apollo.BaseMutationOptions<PublishProgramMutation, PublishProgramMutationVariables>;