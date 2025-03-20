import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UsersByRoleQueryVariables = Types.Exact<{
  role: Types.Scalars['String']['input'];
}>;


export type UsersByRoleQuery = { __typename?: 'Query', usersByRole?: Array<{ __typename?: 'User', about?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, organizationName?: string | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null }> | null };


export const UsersByRoleDocument = gql`
    query usersByRole($role: String!) {
  usersByRole(role: $role) {
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
    `;

/**
 * __useUsersByRoleQuery__
 *
 * To run a query within a React component, call `useUsersByRoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersByRoleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersByRoleQuery({
 *   variables: {
 *      role: // value for 'role'
 *   },
 * });
 */
export function useUsersByRoleQuery(baseOptions: Apollo.QueryHookOptions<UsersByRoleQuery, UsersByRoleQueryVariables> & ({ variables: UsersByRoleQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersByRoleQuery, UsersByRoleQueryVariables>(UsersByRoleDocument, options);
      }
export function useUsersByRoleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersByRoleQuery, UsersByRoleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersByRoleQuery, UsersByRoleQueryVariables>(UsersByRoleDocument, options);
        }
export function useUsersByRoleSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UsersByRoleQuery, UsersByRoleQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UsersByRoleQuery, UsersByRoleQueryVariables>(UsersByRoleDocument, options);
        }
export type UsersByRoleQueryHookResult = ReturnType<typeof useUsersByRoleQuery>;
export type UsersByRoleLazyQueryHookResult = ReturnType<typeof useUsersByRoleLazyQuery>;
export type UsersByRoleSuspenseQueryHookResult = ReturnType<typeof useUsersByRoleSuspenseQuery>;
export type UsersByRoleQueryResult = Apollo.QueryResult<UsersByRoleQuery, UsersByRoleQueryVariables>;