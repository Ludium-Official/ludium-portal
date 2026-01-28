import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ApplicationsByProgramV2QueryVariables = Types.Exact<{
  query: Types.ApplicationsByProgramV2QueryInput;
}>;


export type ApplicationsByProgramV2Query = { __typename?: 'Query', applicationsByProgramV2?: { __typename?: 'PaginatedApplicationsV2', count?: number | null, totalPages?: number | null, currentPage?: number | null, hasNextPage?: boolean | null, hasPreviousPage?: boolean | null, data?: Array<{ __typename?: 'ApplicationV2', id?: string | null, status?: Types.ApplicationStatusV2 | null, content?: string | null, picked?: boolean | null, createdAt?: any | null, updatedAt?: any | null, chatroomMessageId?: string | null, applicant?: { __typename?: 'UserV2', id?: string | null, email?: string | null, nickname?: string | null, profileImage?: string | null, skills?: Array<string> | null, walletAddress?: string | null, userRole?: string | null } | null, program?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, networkId?: number | null, sponsor?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, email?: string | null } | null } | null }> | null } | null };


export const ApplicationsByProgramV2Document = gql`
    query applicationsByProgramV2($query: ApplicationsByProgramV2QueryInput!) {
  applicationsByProgramV2(query: $query) {
    data {
      id
      status
      content
      picked
      createdAt
      updatedAt
      chatroomMessageId
      applicant {
        id
        email
        nickname
        profileImage
        skills
        walletAddress
        userRole
      }
      program {
        id
        title
        description
        networkId
        sponsor {
          id
          nickname
          email
        }
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
 * __useApplicationsByProgramV2Query__
 *
 * To run a query within a React component, call `useApplicationsByProgramV2Query` and pass it any options that fit your needs.
 * When your component renders, `useApplicationsByProgramV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApplicationsByProgramV2Query({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useApplicationsByProgramV2Query(baseOptions: Apollo.QueryHookOptions<ApplicationsByProgramV2Query, ApplicationsByProgramV2QueryVariables> & ({ variables: ApplicationsByProgramV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ApplicationsByProgramV2Query, ApplicationsByProgramV2QueryVariables>(ApplicationsByProgramV2Document, options);
      }
export function useApplicationsByProgramV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ApplicationsByProgramV2Query, ApplicationsByProgramV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ApplicationsByProgramV2Query, ApplicationsByProgramV2QueryVariables>(ApplicationsByProgramV2Document, options);
        }
export function useApplicationsByProgramV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ApplicationsByProgramV2Query, ApplicationsByProgramV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ApplicationsByProgramV2Query, ApplicationsByProgramV2QueryVariables>(ApplicationsByProgramV2Document, options);
        }
export type ApplicationsByProgramV2QueryHookResult = ReturnType<typeof useApplicationsByProgramV2Query>;
export type ApplicationsByProgramV2LazyQueryHookResult = ReturnType<typeof useApplicationsByProgramV2LazyQuery>;
export type ApplicationsByProgramV2SuspenseQueryHookResult = ReturnType<typeof useApplicationsByProgramV2SuspenseQuery>;
export type ApplicationsByProgramV2QueryResult = Apollo.QueryResult<ApplicationsByProgramV2Query, ApplicationsByProgramV2QueryVariables>;