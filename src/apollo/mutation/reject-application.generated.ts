import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RejectApplicationMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  rejectionReason?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type RejectApplicationMutation = { __typename?: 'Mutation', rejectApplication?: { __typename?: 'Application', content?: string | null, id?: string | null, metadata?: any | null, name?: string | null, price?: string | null, status?: Types.ApplicationStatus | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null } | null };


export const RejectApplicationDocument = gql`
    mutation rejectApplication($id: ID!, $rejectionReason: String) {
  rejectApplication(id: $id, rejectionReason: $rejectionReason) {
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
export type RejectApplicationMutationFn = Apollo.MutationFunction<RejectApplicationMutation, RejectApplicationMutationVariables>;

/**
 * __useRejectApplicationMutation__
 *
 * To run a mutation, you first call `useRejectApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectApplicationMutation, { data, loading, error }] = useRejectApplicationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      rejectionReason: // value for 'rejectionReason'
 *   },
 * });
 */
export function useRejectApplicationMutation(baseOptions?: Apollo.MutationHookOptions<RejectApplicationMutation, RejectApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectApplicationMutation, RejectApplicationMutationVariables>(RejectApplicationDocument, options);
      }
export type RejectApplicationMutationHookResult = ReturnType<typeof useRejectApplicationMutation>;
export type RejectApplicationMutationResult = Apollo.MutationResult<RejectApplicationMutation>;
export type RejectApplicationMutationOptions = Apollo.BaseMutationOptions<RejectApplicationMutation, RejectApplicationMutationVariables>;