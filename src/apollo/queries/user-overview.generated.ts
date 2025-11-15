import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UserOverviewQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID']['input'];
}>;


export type UserOverviewQuery = { __typename?: 'Query', user?: { __typename?: 'User', id?: string | null, programStatistics?: { __typename?: 'UserProgramStatistics', asSponsor?: { __typename?: 'ProgramStatsByStatus', notConfirmed?: number | null, confirmed?: number | null, published?: number | null, paymentRequired?: number | null, completed?: number | null, refund?: number | null } | null, asValidator?: { __typename?: 'ProgramStatsByStatus', notConfirmed?: number | null, confirmed?: number | null, published?: number | null, paymentRequired?: number | null, completed?: number | null, refund?: number | null } | null, asBuilder?: { __typename?: 'ProgramStatsByStatus', notConfirmed?: number | null, confirmed?: number | null, published?: number | null, paymentRequired?: number | null, completed?: number | null, refund?: number | null } | null } | null, investmentStatistics?: { __typename?: 'UserInvestmentStatistics', asHost?: { __typename?: 'InvestmentStatsByStatus', ready?: number | null, applicationOngoing?: number | null, fundingOngoing?: number | null, projectOngoing?: number | null, programCompleted?: number | null, refund?: number | null } | null, asProject?: { __typename?: 'InvestmentStatsByStatus', ready?: number | null, fundingOngoing?: number | null, projectOngoing?: number | null, programCompleted?: number | null, refund?: number | null } | null, asSupporter?: { __typename?: 'InvestmentStatsByStatus', ready?: number | null, fundingOngoing?: number | null, projectOngoing?: number | null, programCompleted?: number | null, refund?: number | null } | null } | null } | null };

export type ProfileOverviewQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ProfileOverviewQuery = { __typename?: 'Query', profile?: { __typename?: 'User', id?: string | null, programStatistics?: { __typename?: 'UserProgramStatistics', asSponsor?: { __typename?: 'ProgramStatsByStatus', notConfirmed?: number | null, confirmed?: number | null, published?: number | null, paymentRequired?: number | null, completed?: number | null, refund?: number | null } | null, asValidator?: { __typename?: 'ProgramStatsByStatus', notConfirmed?: number | null, confirmed?: number | null, published?: number | null, paymentRequired?: number | null, completed?: number | null, refund?: number | null } | null, asBuilder?: { __typename?: 'ProgramStatsByStatus', notConfirmed?: number | null, confirmed?: number | null, published?: number | null, paymentRequired?: number | null, completed?: number | null, refund?: number | null } | null } | null, investmentStatistics?: { __typename?: 'UserInvestmentStatistics', asHost?: { __typename?: 'InvestmentStatsByStatus', ready?: number | null, applicationOngoing?: number | null, fundingOngoing?: number | null, projectOngoing?: number | null, programCompleted?: number | null, refund?: number | null } | null, asProject?: { __typename?: 'InvestmentStatsByStatus', ready?: number | null, fundingOngoing?: number | null, projectOngoing?: number | null, programCompleted?: number | null, refund?: number | null } | null, asSupporter?: { __typename?: 'InvestmentStatsByStatus', ready?: number | null, fundingOngoing?: number | null, projectOngoing?: number | null, programCompleted?: number | null, refund?: number | null } | null } | null } | null };


export const UserOverviewDocument = gql`
    query UserOverview($userId: ID!) {
  user(id: $userId) {
    id
    programStatistics {
      asSponsor {
        notConfirmed
        confirmed
        published
        paymentRequired
        completed
        refund
      }
      asValidator {
        notConfirmed
        confirmed
        published
        paymentRequired
        completed
        refund
      }
      asBuilder {
        notConfirmed
        confirmed
        published
        paymentRequired
        completed
        refund
      }
    }
    investmentStatistics {
      asHost {
        ready
        applicationOngoing
        fundingOngoing
        projectOngoing
        programCompleted
        refund
      }
      asProject {
        ready
        fundingOngoing
        projectOngoing
        programCompleted
        refund
      }
      asSupporter {
        ready
        fundingOngoing
        projectOngoing
        programCompleted
        refund
      }
    }
  }
}
    `;

/**
 * __useUserOverviewQuery__
 *
 * To run a query within a React component, call `useUserOverviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserOverviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserOverviewQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUserOverviewQuery(baseOptions: Apollo.QueryHookOptions<UserOverviewQuery, UserOverviewQueryVariables> & ({ variables: UserOverviewQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserOverviewQuery, UserOverviewQueryVariables>(UserOverviewDocument, options);
      }
export function useUserOverviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserOverviewQuery, UserOverviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserOverviewQuery, UserOverviewQueryVariables>(UserOverviewDocument, options);
        }
export function useUserOverviewSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UserOverviewQuery, UserOverviewQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserOverviewQuery, UserOverviewQueryVariables>(UserOverviewDocument, options);
        }
export type UserOverviewQueryHookResult = ReturnType<typeof useUserOverviewQuery>;
export type UserOverviewLazyQueryHookResult = ReturnType<typeof useUserOverviewLazyQuery>;
export type UserOverviewSuspenseQueryHookResult = ReturnType<typeof useUserOverviewSuspenseQuery>;
export type UserOverviewQueryResult = Apollo.QueryResult<UserOverviewQuery, UserOverviewQueryVariables>;
export const ProfileOverviewDocument = gql`
    query ProfileOverview {
  profile {
    id
    programStatistics {
      asSponsor {
        notConfirmed
        confirmed
        published
        paymentRequired
        completed
        refund
      }
      asValidator {
        notConfirmed
        confirmed
        published
        paymentRequired
        completed
        refund
      }
      asBuilder {
        notConfirmed
        confirmed
        published
        paymentRequired
        completed
        refund
      }
    }
    investmentStatistics {
      asHost {
        ready
        applicationOngoing
        fundingOngoing
        projectOngoing
        programCompleted
        refund
      }
      asProject {
        ready
        fundingOngoing
        projectOngoing
        programCompleted
        refund
      }
      asSupporter {
        ready
        fundingOngoing
        projectOngoing
        programCompleted
        refund
      }
    }
  }
}
    `;

/**
 * __useProfileOverviewQuery__
 *
 * To run a query within a React component, call `useProfileOverviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileOverviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileOverviewQuery({
 *   variables: {
 *   },
 * });
 */
export function useProfileOverviewQuery(baseOptions?: Apollo.QueryHookOptions<ProfileOverviewQuery, ProfileOverviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProfileOverviewQuery, ProfileOverviewQueryVariables>(ProfileOverviewDocument, options);
      }
export function useProfileOverviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfileOverviewQuery, ProfileOverviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProfileOverviewQuery, ProfileOverviewQueryVariables>(ProfileOverviewDocument, options);
        }
export function useProfileOverviewSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProfileOverviewQuery, ProfileOverviewQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProfileOverviewQuery, ProfileOverviewQueryVariables>(ProfileOverviewDocument, options);
        }
export type ProfileOverviewQueryHookResult = ReturnType<typeof useProfileOverviewQuery>;
export type ProfileOverviewLazyQueryHookResult = ReturnType<typeof useProfileOverviewLazyQuery>;
export type ProfileOverviewSuspenseQueryHookResult = ReturnType<typeof useProfileOverviewSuspenseQuery>;
export type ProfileOverviewQueryResult = Apollo.QueryResult<ProfileOverviewQuery, ProfileOverviewQueryVariables>;