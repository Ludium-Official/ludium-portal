import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ProgramOverviewV2QueryVariables = Types.Exact<{
  input: Types.ProgramOverviewV2Input;
}>;


export type ProgramOverviewV2Query = { __typename?: 'Query', programOverviewV2?: { __typename?: 'ProgramOverviewV2', milestoneProgress?: { __typename?: 'MilestoneProgress', completed?: number | null, total?: number | null } | null, hiredBuilders?: { __typename?: 'PaginatedHiredBuildersV2', count?: number | null, data?: Array<{ __typename?: 'HiredBuilderV2', id?: number | null, nickname?: string | null, profileImage?: string | null, role?: string | null, status?: string | null, milestoneCount?: number | null, paidAmount?: string | null, totalAmount?: string | null, tokenId?: number | null }> | null } | null, milestones?: { __typename?: 'PaginatedBuilderMilestonesV2', count?: number | null, data?: Array<{ __typename?: 'BuilderMilestoneV2', id?: string | null, title?: string | null, deadline?: any | null, status?: string | null, tokenId?: number | null, unpaidAmount?: string | null, paidAmount?: string | null }> | null } | null, upcomingPayments?: Array<{ __typename?: 'UpcomingPayment', builder?: { __typename?: 'BuilderInfo', nickname?: string | null, profileImage?: string | null } | null, payment?: Array<{ __typename?: 'PaymentInfo', payout?: string | null, deadline?: any | null, tokenId?: number | null }> | null }> | null } | null };


export const ProgramOverviewV2Document = gql`
    query programOverviewV2($input: ProgramOverviewV2Input!) {
  programOverviewV2(input: $input) {
    milestoneProgress {
      completed
      total
    }
    hiredBuilders {
      data {
        id
        nickname
        profileImage
        role
        status
        milestoneCount
        paidAmount
        totalAmount
        tokenId
      }
      count
    }
    milestones {
      data {
        id
        title
        deadline
        status
        tokenId
        unpaidAmount
        paidAmount
      }
      count
    }
    upcomingPayments {
      builder {
        nickname
        profileImage
      }
      payment {
        payout
        deadline
        tokenId
      }
    }
  }
}
    `;

/**
 * __useProgramOverviewV2Query__
 *
 * To run a query within a React component, call `useProgramOverviewV2Query` and pass it any options that fit your needs.
 * When your component renders, `useProgramOverviewV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgramOverviewV2Query({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProgramOverviewV2Query(baseOptions: Apollo.QueryHookOptions<ProgramOverviewV2Query, ProgramOverviewV2QueryVariables> & ({ variables: ProgramOverviewV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProgramOverviewV2Query, ProgramOverviewV2QueryVariables>(ProgramOverviewV2Document, options);
      }
export function useProgramOverviewV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgramOverviewV2Query, ProgramOverviewV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProgramOverviewV2Query, ProgramOverviewV2QueryVariables>(ProgramOverviewV2Document, options);
        }
export function useProgramOverviewV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProgramOverviewV2Query, ProgramOverviewV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProgramOverviewV2Query, ProgramOverviewV2QueryVariables>(ProgramOverviewV2Document, options);
        }
export type ProgramOverviewV2QueryHookResult = ReturnType<typeof useProgramOverviewV2Query>;
export type ProgramOverviewV2LazyQueryHookResult = ReturnType<typeof useProgramOverviewV2LazyQuery>;
export type ProgramOverviewV2SuspenseQueryHookResult = ReturnType<typeof useProgramOverviewV2SuspenseQuery>;
export type ProgramOverviewV2QueryResult = Apollo.QueryResult<ProgramOverviewV2Query, ProgramOverviewV2QueryVariables>;