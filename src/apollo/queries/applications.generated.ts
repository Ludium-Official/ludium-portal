import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ApplicationsQueryVariables = Types.Exact<{
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type ApplicationsQuery = { __typename?: 'Query', applications?: { __typename?: 'PaginatedApplications', count?: number | null, data?: Array<{ __typename?: 'Application', content?: string | null, currentFundingAmount?: string | null, fundingProgress?: number | null, fundingSuccessful?: boolean | null, fundingTarget?: string | null, id?: string | null, investmentCount?: number | null, metadata?: any | null, name?: string | null, onChainProjectId?: number | null, price?: string | null, rejectionReason?: string | null, status?: Types.ApplicationStatus | null, summary?: string | null, walletAddress?: string | null, applicant?: { __typename?: 'User', firstName?: string | null, lastName?: string | null, organizationName?: string | null } | null, program?: { __typename?: 'Program', id?: string | null, price?: string | null, currency?: string | null, network?: string | null, status?: Types.ProgramStatus | null, image?: string | null, name?: string | null, keywords?: Array<{ __typename?: 'Keyword', name?: string | null, id?: string | null }> | null } | null, milestones?: Array<{ __typename?: 'Milestone', price?: string | null }> | null }> | null } | null };


export const ApplicationsDocument = gql`
    query applications($pagination: PaginationInput) {
  applications(pagination: $pagination) {
    count
    data {
      applicant {
        firstName
        lastName
        organizationName
      }
      content
      currentFundingAmount
      fundingProgress
      fundingSuccessful
      fundingTarget
      id
      investmentCount
      metadata
      name
      onChainProjectId
      price
      program {
        id
        price
        currency
        network
        status
        image
        keywords {
          name
          id
        }
        name
      }
      rejectionReason
      status
      summary
      walletAddress
      milestones {
        price
      }
    }
  }
}
    `;

/**
 * __useApplicationsQuery__
 *
 * To run a query within a React component, call `useApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApplicationsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useApplicationsQuery(baseOptions?: Apollo.QueryHookOptions<ApplicationsQuery, ApplicationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ApplicationsQuery, ApplicationsQueryVariables>(ApplicationsDocument, options);
      }
export function useApplicationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ApplicationsQuery, ApplicationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ApplicationsQuery, ApplicationsQueryVariables>(ApplicationsDocument, options);
        }
export function useApplicationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ApplicationsQuery, ApplicationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ApplicationsQuery, ApplicationsQueryVariables>(ApplicationsDocument, options);
        }
export type ApplicationsQueryHookResult = ReturnType<typeof useApplicationsQuery>;
export type ApplicationsLazyQueryHookResult = ReturnType<typeof useApplicationsLazyQuery>;
export type ApplicationsSuspenseQueryHookResult = ReturnType<typeof useApplicationsSuspenseQuery>;
export type ApplicationsQueryResult = Apollo.QueryResult<ApplicationsQuery, ApplicationsQueryVariables>;