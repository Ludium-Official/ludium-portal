import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AcceptApplicationMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  onChainProjectId?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type AcceptApplicationMutation = { __typename?: 'Mutation', acceptApplication?: { __typename?: 'Application', content?: string | null, id?: string | null, metadata?: any | null, name?: string | null, status?: Types.ApplicationStatus | null, onChainProjectId?: number | null, applicant?: { __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null } | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null, milestones?: Array<{ __typename?: 'Milestone', currency?: string | null, description?: string | null, id?: string | null, price?: string | null, status?: Types.MilestoneStatus | null, title?: string | null }> | null } | null };


export const AcceptApplicationDocument = gql`
    mutation acceptApplication($id: ID!, $onChainProjectId: Int) {
  acceptApplication(id: $id, onChainProjectId: $onChainProjectId) {
    applicant {
      about
      email
      firstName
      id
      image
      lastName
      organizationName
    }
    content
    id
    links {
      title
      url
    }
    metadata
    milestones {
      currency
      description
      id
      price
      status
      title
    }
    name
    status
    onChainProjectId
  }
}
    `;
export type AcceptApplicationMutationFn = Apollo.MutationFunction<AcceptApplicationMutation, AcceptApplicationMutationVariables>;

/**
 * __useAcceptApplicationMutation__
 *
 * To run a mutation, you first call `useAcceptApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptApplicationMutation, { data, loading, error }] = useAcceptApplicationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      onChainProjectId: // value for 'onChainProjectId'
 *   },
 * });
 */
export function useAcceptApplicationMutation(baseOptions?: Apollo.MutationHookOptions<AcceptApplicationMutation, AcceptApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptApplicationMutation, AcceptApplicationMutationVariables>(AcceptApplicationDocument, options);
      }
export type AcceptApplicationMutationHookResult = ReturnType<typeof useAcceptApplicationMutation>;
export type AcceptApplicationMutationResult = Apollo.MutationResult<AcceptApplicationMutation>;
export type AcceptApplicationMutationOptions = Apollo.BaseMutationOptions<AcceptApplicationMutation, AcceptApplicationMutationVariables>;