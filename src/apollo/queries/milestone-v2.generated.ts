import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetMilestoneV2QueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GetMilestoneV2Query = { __typename?: 'Query', milestoneV2?: { __typename?: 'MilestoneV2', id?: string | null, title?: string | null, description?: string | null, payout?: string | null, deadline?: any | null, createdAt?: any | null, updatedAt?: any | null, applicant?: { __typename?: 'UserV2', id?: string | null, walletAddress?: string | null, email?: string | null, nickname?: string | null, profileImage?: string | null } | null, program?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, price?: string | null, deadline?: any | null, status?: Types.ProgramStatusV2 | null } | null } | null };


export const GetMilestoneV2Document = gql`
    query GetMilestoneV2($id: ID!) {
  milestoneV2(id: $id) {
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
      nickname
      profileImage
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

/**
 * __useGetMilestoneV2Query__
 *
 * To run a query within a React component, call `useGetMilestoneV2Query` and pass it any options that fit your needs.
 * When your component renders, `useGetMilestoneV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMilestoneV2Query({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMilestoneV2Query(baseOptions: Apollo.QueryHookOptions<GetMilestoneV2Query, GetMilestoneV2QueryVariables> & ({ variables: GetMilestoneV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMilestoneV2Query, GetMilestoneV2QueryVariables>(GetMilestoneV2Document, options);
      }
export function useGetMilestoneV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMilestoneV2Query, GetMilestoneV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMilestoneV2Query, GetMilestoneV2QueryVariables>(GetMilestoneV2Document, options);
        }
export function useGetMilestoneV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMilestoneV2Query, GetMilestoneV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMilestoneV2Query, GetMilestoneV2QueryVariables>(GetMilestoneV2Document, options);
        }
export type GetMilestoneV2QueryHookResult = ReturnType<typeof useGetMilestoneV2Query>;
export type GetMilestoneV2LazyQueryHookResult = ReturnType<typeof useGetMilestoneV2LazyQuery>;
export type GetMilestoneV2SuspenseQueryHookResult = ReturnType<typeof useGetMilestoneV2SuspenseQuery>;
export type GetMilestoneV2QueryResult = Apollo.QueryResult<GetMilestoneV2Query, GetMilestoneV2QueryVariables>;