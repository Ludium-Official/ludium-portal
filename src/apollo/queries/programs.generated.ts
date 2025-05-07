import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ProgramsQueryVariables = Types.Exact<{
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type ProgramsQuery = { __typename?: 'Query', programs?: { __typename?: 'PaginatedPrograms', count?: number | null, data?: Array<{ __typename?: 'Program', currency?: string | null, deadline?: any | null, description?: string | null, id?: string | null, name?: string | null, price?: string | null, status?: string | null, summary?: string | null, applications?: Array<{ __typename?: 'Application', content?: string | null, id?: string | null, metadata?: any | null, name?: string | null, price?: string | null, status?: Types.ApplicationStatus | null, applicant?: { __typename?: 'User', about?: string | null, avatar?: any | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null } | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null, milestones?: Array<{ __typename?: 'Milestone', currency?: string | null, description?: string | null, id?: string | null, price?: string | null, status?: Types.MilestoneStatus | null, title?: string | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null }> | null }> | null, creator?: { __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null } | null, keywords?: Array<{ __typename?: 'Keyword', id?: string | null, name?: string | null }> | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null, validator?: { __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null } | null }> | null } | null };


export const ProgramsDocument = gql`
    query programs($pagination: PaginationInput) {
  programs(pagination: $pagination) {
    count
    data {
      applications {
        applicant {
          about
          avatar
          email
          firstName
          id
          image
          lastName
          links {
            title
            url
          }
          organizationName
        }
        content
        id
        links {
          title
          url
        }
        metadata
        milestones {
          currency
          description
          id
          links {
            title
            url
          }
          price
          status
          title
        }
        name
        price
        status
      }
      creator {
        about
        email
        firstName
        id
        image
        lastName
        links {
          title
          url
        }
        organizationName
      }
      currency
      deadline
      description
      id
      keywords {
        id
        name
      }
      links {
        title
        url
      }
      name
      price
      status
      summary
      validator {
        about
        email
        firstName
        id
        image
        lastName
        links {
          title
          url
        }
        organizationName
      }
    }
  }
}
    `;

/**
 * __useProgramsQuery__
 *
 * To run a query within a React component, call `useProgramsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProgramsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgramsQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useProgramsQuery(baseOptions?: Apollo.QueryHookOptions<ProgramsQuery, ProgramsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProgramsQuery, ProgramsQueryVariables>(ProgramsDocument, options);
      }
export function useProgramsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgramsQuery, ProgramsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProgramsQuery, ProgramsQueryVariables>(ProgramsDocument, options);
        }
export function useProgramsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProgramsQuery, ProgramsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProgramsQuery, ProgramsQueryVariables>(ProgramsDocument, options);
        }
export type ProgramsQueryHookResult = ReturnType<typeof useProgramsQuery>;
export type ProgramsLazyQueryHookResult = ReturnType<typeof useProgramsLazyQuery>;
export type ProgramsSuspenseQueryHookResult = ReturnType<typeof useProgramsSuspenseQuery>;
export type ProgramsQueryResult = Apollo.QueryResult<ProgramsQuery, ProgramsQueryVariables>;