import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ProgramQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ProgramQuery = { __typename?: 'Query', program?: { __typename?: 'Program', currency?: string | null, deadline?: any | null, description?: string | null, educhainProgramId?: number | null, id?: string | null, name?: string | null, image?: string | null, price?: string | null, status?: Types.ProgramStatus | null, summary?: string | null, rejectionReason?: string | null, visibility?: Types.ProgramVisibility | null, network?: string | null, applications?: Array<{ __typename?: 'Application', content?: string | null, id?: string | null, metadata?: any | null, name?: string | null, status?: Types.ApplicationStatus | null, applicant?: { __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null } | null, milestones?: Array<{ __typename?: 'Milestone', currency?: string | null, description?: string | null, id?: string | null, price?: string | null, status?: Types.MilestoneStatus | null, title?: string | null }> | null }> | null, creator?: { __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null, summary?: string | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null, keywords?: Array<{ __typename?: 'Keyword', id?: string | null, name?: string | null }> | null } | null, keywords?: Array<{ __typename?: 'Keyword', id?: string | null, name?: string | null }> | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null, invitedBuilders?: Array<{ __typename?: 'User', about?: string | null, avatar?: any | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, loginType?: string | null, organizationName?: string | null, role?: Types.UserRole | null, summary?: string | null, walletAddress?: string | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null }> | null, validators?: Array<{ __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, summary?: string | null, lastName?: string | null, organizationName?: string | null, walletAddress?: string | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null, keywords?: Array<{ __typename?: 'Keyword', id?: string | null, name?: string | null }> | null }> | null } | null };


export const ProgramDocument = gql`
    query program($id: ID!) {
  program(id: $id) {
    applications {
      applicant {
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
      content
      id
      metadata
      name
      milestones {
        currency
        description
        id
        price
        status
        title
      }
      status
    }
    creator {
      about
      email
      firstName
      id
      image
      lastName
      organizationName
      summary
      links {
        title
        url
      }
      keywords {
        id
        name
      }
    }
    currency
    deadline
    description
    educhainProgramId
    keywords {
      id
      name
    }
    links {
      title
      url
    }
    id
    name
    image
    price
    status
    summary
    rejectionReason
    visibility
    invitedBuilders {
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
      loginType
      organizationName
      role
      summary
      walletAddress
    }
    validators {
      about
      email
      firstName
      id
      image
      summary
      lastName
      organizationName
      links {
        title
        url
      }
      keywords {
        id
        name
      }
      walletAddress
    }
    network
  }
}
    `;

/**
 * __useProgramQuery__
 *
 * To run a query within a React component, call `useProgramQuery` and pass it any options that fit your needs.
 * When your component renders, `useProgramQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgramQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProgramQuery(baseOptions: Apollo.QueryHookOptions<ProgramQuery, ProgramQueryVariables> & ({ variables: ProgramQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProgramQuery, ProgramQueryVariables>(ProgramDocument, options);
      }
export function useProgramLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgramQuery, ProgramQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProgramQuery, ProgramQueryVariables>(ProgramDocument, options);
        }
export function useProgramSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProgramQuery, ProgramQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProgramQuery, ProgramQueryVariables>(ProgramDocument, options);
        }
export type ProgramQueryHookResult = ReturnType<typeof useProgramQuery>;
export type ProgramLazyQueryHookResult = ReturnType<typeof useProgramLazyQuery>;
export type ProgramSuspenseQueryHookResult = ReturnType<typeof useProgramSuspenseQuery>;
export type ProgramQueryResult = Apollo.QueryResult<ProgramQuery, ProgramQueryVariables>;