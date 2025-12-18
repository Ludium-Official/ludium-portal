import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PickApplicationV2MutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  input: Types.PickApplicationV2Input;
}>;


export type PickApplicationV2Mutation = { __typename?: 'Mutation', pickApplicationV2?: { __typename?: 'ApplicationV2', id?: string | null, status?: Types.ApplicationStatusV2 | null, picked?: boolean | null, createdAt?: any | null, updatedAt?: any | null, applicant?: { __typename?: 'UserV2', id?: string | null, email?: string | null, nickname?: string | null, profileImage?: string | null } | null, program?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null } | null } | null };


export const PickApplicationV2Document = gql`
    mutation pickApplicationV2($id: ID!, $input: PickApplicationV2Input!) {
  pickApplicationV2(id: $id, input: $input) {
    id
    status
    picked
    createdAt
    updatedAt
    applicant {
      id
      email
      nickname
      profileImage
    }
    program {
      id
      title
    }
  }
}
    `;
export type PickApplicationV2MutationFn = Apollo.MutationFunction<PickApplicationV2Mutation, PickApplicationV2MutationVariables>;

/**
 * __usePickApplicationV2Mutation__
 *
 * To run a mutation, you first call `usePickApplicationV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePickApplicationV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pickApplicationV2Mutation, { data, loading, error }] = usePickApplicationV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePickApplicationV2Mutation(baseOptions?: Apollo.MutationHookOptions<PickApplicationV2Mutation, PickApplicationV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PickApplicationV2Mutation, PickApplicationV2MutationVariables>(PickApplicationV2Document, options);
      }
export type PickApplicationV2MutationHookResult = ReturnType<typeof usePickApplicationV2Mutation>;
export type PickApplicationV2MutationResult = Apollo.MutationResult<PickApplicationV2Mutation>;
export type PickApplicationV2MutationOptions = Apollo.BaseMutationOptions<PickApplicationV2Mutation, PickApplicationV2MutationVariables>;