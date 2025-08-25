import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type InvestmentsQueryVariables = Types.Exact<{
  supporterId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  projectId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type InvestmentsQuery = { __typename?: 'Query', investments?: { __typename?: 'PaginatedInvestments', count?: number | null, data?: Array<{ __typename?: 'Investment', id?: string | null, amount?: string | null, tier?: string | null, txHash?: string | null, status?: Types.InvestmentStatus | null, reclaimed?: boolean | null, reclaimTxHash?: string | null, reclaimedAt?: any | null, project?: { __typename?: 'Application', id?: string | null, name?: string | null, onChainProjectId?: number | null, program?: { __typename?: 'Program', id?: string | null, name?: string | null, network?: string | null, currency?: string | null, educhainProgramId?: number | null } | null } | null, supporter?: { __typename?: 'User', id?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null } | null }> | null } | null };


export const InvestmentsDocument = gql`
    query investments($supporterId: ID, $projectId: ID, $pagination: PaginationInput) {
  investments(
    supporterId: $supporterId
    projectId: $projectId
    pagination: $pagination
  ) {
    data {
      id
      amount
      tier
      txHash
      status
      reclaimed
      reclaimTxHash
      reclaimedAt
      project {
        id
        name
        onChainProjectId
        program {
          id
          name
          network
          currency
          educhainProgramId
        }
      }
      supporter {
        id
        email
        firstName
        lastName
      }
    }
    count
  }
}
    `;

/**
 * __useInvestmentsQuery__
 *
 * To run a query within a React component, call `useInvestmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useInvestmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInvestmentsQuery({
 *   variables: {
 *      supporterId: // value for 'supporterId'
 *      projectId: // value for 'projectId'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useInvestmentsQuery(baseOptions?: Apollo.QueryHookOptions<InvestmentsQuery, InvestmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InvestmentsQuery, InvestmentsQueryVariables>(InvestmentsDocument, options);
      }
export function useInvestmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InvestmentsQuery, InvestmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InvestmentsQuery, InvestmentsQueryVariables>(InvestmentsDocument, options);
        }
export function useInvestmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<InvestmentsQuery, InvestmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<InvestmentsQuery, InvestmentsQueryVariables>(InvestmentsDocument, options);
        }
export type InvestmentsQueryHookResult = ReturnType<typeof useInvestmentsQuery>;
export type InvestmentsLazyQueryHookResult = ReturnType<typeof useInvestmentsLazyQuery>;
export type InvestmentsSuspenseQueryHookResult = ReturnType<typeof useInvestmentsSuspenseQuery>;
export type InvestmentsQueryResult = Apollo.QueryResult<InvestmentsQuery, InvestmentsQueryVariables>;