import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ProgramQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ProgramQuery = { __typename?: 'Query', program?: { __typename?: 'Program', currency?: string | null, deadline?: any | null, description?: string | null, id?: string | null, name?: string | null, price?: string | null, status?: string | null, summary?: string | null, creator?: { __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null } | null, keywords?: Array<{ __typename?: 'ProgramKeyword', id?: string | null, name?: string | null }> | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null, validator?: { __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null } | null } | null };


export const ProgramDocument = gql`
    query program($id: ID!) {
  program(id: $id) {
    creator {
      about
      email
      firstName
      id
      image
      lastName
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
      organizationName
    }
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