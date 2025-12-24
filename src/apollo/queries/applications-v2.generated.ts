import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ApplicationsV2QueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.ApplicationsV2QueryInput>;
}>;


export type ApplicationsV2Query = { __typename?: 'Query', applicationsV2?: { __typename?: 'PaginatedApplicationsV2', count?: number | null, totalPages?: number | null, currentPage?: number | null, hasNextPage?: boolean | null, hasPreviousPage?: boolean | null, data?: Array<{ __typename?: 'ApplicationV2', id?: string | null, status?: Types.ApplicationStatusV2 | null, createdAt?: any | null, updatedAt?: any | null, applicant?: { __typename?: 'UserV2', id?: string | null, email?: string | null, nickname?: string | null, profileImage?: string | null, skills?: Array<string> | null } | null, program?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null } | null }> | null } | null };


export const ApplicationsV2Document = gql`
    query applicationsV2($query: ApplicationsV2QueryInput) {
  applicationsV2(query: $query) {
    data {
      id
      status
      createdAt
      updatedAt
      applicant {
        id
        email
        nickname
        profileImage
        skills
      }
      program {
        id
        title
        description
      }
    }
    count
    totalPages
    currentPage
    hasNextPage
    hasPreviousPage
  }
}
    `;

/**
 * __useApplicationsV2Query__
 *
 * To run a query within a React component, call `useApplicationsV2Query` and pass it any options that fit your needs.
 * When your component renders, `useApplicationsV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApplicationsV2Query({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useApplicationsV2Query(baseOptions?: Apollo.QueryHookOptions<ApplicationsV2Query, ApplicationsV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ApplicationsV2Query, ApplicationsV2QueryVariables>(ApplicationsV2Document, options);
      }
export function useApplicationsV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ApplicationsV2Query, ApplicationsV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ApplicationsV2Query, ApplicationsV2QueryVariables>(ApplicationsV2Document, options);
        }
export function useApplicationsV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ApplicationsV2Query, ApplicationsV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ApplicationsV2Query, ApplicationsV2QueryVariables>(ApplicationsV2Document, options);
        }
export type ApplicationsV2QueryHookResult = ReturnType<typeof useApplicationsV2Query>;
export type ApplicationsV2LazyQueryHookResult = ReturnType<typeof useApplicationsV2LazyQuery>;
export type ApplicationsV2SuspenseQueryHookResult = ReturnType<typeof useApplicationsV2SuspenseQuery>;
export type ApplicationsV2QueryResult = Apollo.QueryResult<ApplicationsV2Query, ApplicationsV2QueryVariables>;