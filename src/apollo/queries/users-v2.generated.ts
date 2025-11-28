import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UsersV2QueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.UsersV2QueryInput>;
}>;


export type UsersV2Query = { __typename?: 'Query', usersV2?: { __typename?: 'PaginatedUsersV2', totalCount?: number | null, totalPages?: number | null, currentPage?: number | null, hasNextPage?: boolean | null, hasPreviousPage?: boolean | null, users?: Array<{ __typename?: 'UserV2', id?: string | null, role?: Types.UserRoleV2 | null, loginType?: Types.LoginTypeEnum | null, walletAddress?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, organizationName?: string | null, profileImage?: string | null, bio?: string | null, skills?: Array<string> | null, links?: Array<string> | null, createdAt?: any | null, updatedAt?: any | null }> | null } | null };


export const UsersV2Document = gql`
    query usersV2($query: UsersV2QueryInput) {
  usersV2(query: $query) {
    users {
      id
      role
      loginType
      walletAddress
      email
      firstName
      lastName
      organizationName
      profileImage
      bio
      skills
      links
      createdAt
      updatedAt
    }
    totalCount
    totalPages
    currentPage
    hasNextPage
    hasPreviousPage
  }
}
    `;

/**
 * __useUsersV2Query__
 *
 * To run a query within a React component, call `useUsersV2Query` and pass it any options that fit your needs.
 * When your component renders, `useUsersV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersV2Query({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useUsersV2Query(baseOptions?: Apollo.QueryHookOptions<UsersV2Query, UsersV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersV2Query, UsersV2QueryVariables>(UsersV2Document, options);
      }
export function useUsersV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersV2Query, UsersV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersV2Query, UsersV2QueryVariables>(UsersV2Document, options);
        }
export function useUsersV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UsersV2Query, UsersV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UsersV2Query, UsersV2QueryVariables>(UsersV2Document, options);
        }
export type UsersV2QueryHookResult = ReturnType<typeof useUsersV2Query>;
export type UsersV2LazyQueryHookResult = ReturnType<typeof useUsersV2LazyQuery>;
export type UsersV2SuspenseQueryHookResult = ReturnType<typeof useUsersV2SuspenseQuery>;
export type UsersV2QueryResult = Apollo.QueryResult<UsersV2Query, UsersV2QueryVariables>;