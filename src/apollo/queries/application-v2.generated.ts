import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ApplicationV2QueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ApplicationV2Query = { __typename?: 'Query', applicationV2?: { __typename?: 'ApplicationV2', id?: string | null, status?: Types.ApplicationStatusV2 | null, content?: string | null, picked?: boolean | null, rejectedReason?: string | null, createdAt?: any | null, updatedAt?: any | null, applicant?: { __typename?: 'UserV2', id?: string | null, email?: string | null, nickname?: string | null, profileImage?: string | null, skills?: Array<string> | null } | null, program?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null } | null } | null };


export const ApplicationV2Document = gql`
    query applicationV2($id: ID!) {
  applicationV2(id: $id) {
    id
    status
    content
    picked
    rejectedReason
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
}
    `;

/**
 * __useApplicationV2Query__
 *
 * To run a query within a React component, call `useApplicationV2Query` and pass it any options that fit your needs.
 * When your component renders, `useApplicationV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApplicationV2Query({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useApplicationV2Query(baseOptions: Apollo.QueryHookOptions<ApplicationV2Query, ApplicationV2QueryVariables> & ({ variables: ApplicationV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ApplicationV2Query, ApplicationV2QueryVariables>(ApplicationV2Document, options);
      }
export function useApplicationV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ApplicationV2Query, ApplicationV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ApplicationV2Query, ApplicationV2QueryVariables>(ApplicationV2Document, options);
        }
export function useApplicationV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ApplicationV2Query, ApplicationV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ApplicationV2Query, ApplicationV2QueryVariables>(ApplicationV2Document, options);
        }
export type ApplicationV2QueryHookResult = ReturnType<typeof useApplicationV2Query>;
export type ApplicationV2LazyQueryHookResult = ReturnType<typeof useApplicationV2LazyQuery>;
export type ApplicationV2SuspenseQueryHookResult = ReturnType<typeof useApplicationV2SuspenseQuery>;
export type ApplicationV2QueryResult = Apollo.QueryResult<ApplicationV2Query, ApplicationV2QueryVariables>;