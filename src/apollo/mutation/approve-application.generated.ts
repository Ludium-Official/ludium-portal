import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ApproveApplicationMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ApproveApplicationMutation = { __typename?: 'Mutation', approveApplication?: { __typename?: 'Application', content?: string | null, id?: string | null, metadata?: any | null, name?: string | null, status?: Types.ApplicationStatus | null, applicant?: { __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null } | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null, milestones?: Array<{ __typename?: 'Milestone', currency?: string | null, description?: string | null, id?: string | null, price?: string | null, status?: Types.MilestoneStatus | null, title?: string | null }> | null } | null };


export const ApproveApplicationDocument = gql`
    mutation approveApplication($id: ID!) {
  approveApplication(id: $id) {
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
  }
}
    `;
export type ApproveApplicationMutationFn = Apollo.MutationFunction<ApproveApplicationMutation, ApproveApplicationMutationVariables>;

/**
 * __useApproveApplicationMutation__
 *
 * To run a mutation, you first call `useApproveApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveApplicationMutation, { data, loading, error }] = useApproveApplicationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useApproveApplicationMutation(baseOptions?: Apollo.MutationHookOptions<ApproveApplicationMutation, ApproveApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApproveApplicationMutation, ApproveApplicationMutationVariables>(ApproveApplicationDocument, options);
      }
export type ApproveApplicationMutationHookResult = ReturnType<typeof useApproveApplicationMutation>;
export type ApproveApplicationMutationResult = Apollo.MutationResult<ApproveApplicationMutation>;
export type ApproveApplicationMutationOptions = Apollo.BaseMutationOptions<ApproveApplicationMutation, ApproveApplicationMutationVariables>;