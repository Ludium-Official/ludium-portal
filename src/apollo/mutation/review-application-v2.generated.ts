import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ReviewApplicationV2MutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  input: Types.ReviewApplicationV2Input;
}>;


export type ReviewApplicationV2Mutation = { __typename?: 'Mutation', reviewApplicationV2?: { __typename?: 'ApplicationV2', id?: string | null, status?: Types.ApplicationStatusV2 | null, rejectedReason?: string | null, createdAt?: any | null, updatedAt?: any | null, applicant?: { __typename?: 'UserV2', id?: string | null, email?: string | null, nickname?: string | null, profileImage?: string | null } | null, program?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null } | null } | null };


export const ReviewApplicationV2Document = gql`
    mutation reviewApplicationV2($id: ID!, $input: ReviewApplicationV2Input!) {
  reviewApplicationV2(id: $id, input: $input) {
    id
    status
    rejectedReason
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
export type ReviewApplicationV2MutationFn = Apollo.MutationFunction<ReviewApplicationV2Mutation, ReviewApplicationV2MutationVariables>;

/**
 * __useReviewApplicationV2Mutation__
 *
 * To run a mutation, you first call `useReviewApplicationV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReviewApplicationV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reviewApplicationV2Mutation, { data, loading, error }] = useReviewApplicationV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useReviewApplicationV2Mutation(baseOptions?: Apollo.MutationHookOptions<ReviewApplicationV2Mutation, ReviewApplicationV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReviewApplicationV2Mutation, ReviewApplicationV2MutationVariables>(ReviewApplicationV2Document, options);
      }
export type ReviewApplicationV2MutationHookResult = ReturnType<typeof useReviewApplicationV2Mutation>;
export type ReviewApplicationV2MutationResult = Apollo.MutationResult<ReviewApplicationV2Mutation>;
export type ReviewApplicationV2MutationOptions = Apollo.BaseMutationOptions<ReviewApplicationV2Mutation, ReviewApplicationV2MutationVariables>;