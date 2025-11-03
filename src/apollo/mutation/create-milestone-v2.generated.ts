import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateMilestoneV2MutationVariables = Types.Exact<{
  input: Types.CreateMilestoneV2Input;
}>;


export type CreateMilestoneV2Mutation = { __typename?: 'Mutation', createMilestoneV2?: { __typename?: 'MilestoneV2', id?: string | null, title?: string | null, description?: string | null, payout?: string | null, deadline?: any | null, createdAt?: any | null, updatedAt?: any | null, applicant?: { __typename?: 'UserV2', id?: string | null, walletAddress?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, profileImage?: string | null, organizationName?: string | null } | null, program?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, price?: string | null, deadline?: any | null, status?: Types.ProgramStatusV2 | null } | null } | null };


export const CreateMilestoneV2Document = gql`
    mutation CreateMilestoneV2($input: CreateMilestoneV2Input!) {
  createMilestoneV2(input: $input) {
    id
    title
    description
    payout
    deadline
    createdAt
    updatedAt
    applicant {
      id
      walletAddress
      email
      firstName
      lastName
      profileImage
      organizationName
    }
    program {
      id
      title
      description
      price
      deadline
      status
    }
  }
}
    `;
export type CreateMilestoneV2MutationFn = Apollo.MutationFunction<CreateMilestoneV2Mutation, CreateMilestoneV2MutationVariables>;

/**
 * __useCreateMilestoneV2Mutation__
 *
 * To run a mutation, you first call `useCreateMilestoneV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMilestoneV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMilestoneV2Mutation, { data, loading, error }] = useCreateMilestoneV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMilestoneV2Mutation(baseOptions?: Apollo.MutationHookOptions<CreateMilestoneV2Mutation, CreateMilestoneV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMilestoneV2Mutation, CreateMilestoneV2MutationVariables>(CreateMilestoneV2Document, options);
      }
export type CreateMilestoneV2MutationHookResult = ReturnType<typeof useCreateMilestoneV2Mutation>;
export type CreateMilestoneV2MutationResult = Apollo.MutationResult<CreateMilestoneV2Mutation>;
export type CreateMilestoneV2MutationOptions = Apollo.BaseMutationOptions<CreateMilestoneV2Mutation, CreateMilestoneV2MutationVariables>;