import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AdminUsersQueryVariables = Types.Exact<{
  includesBanned?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  onlyBanned?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  pagination?: Types.InputMaybe<Types.PaginationInput>;
  role?: Types.InputMaybe<Types.UserRole>;
}>;


export type AdminUsersQuery = { __typename?: 'Query', adminUsers?: { __typename?: 'PaginatedUsers', count?: number | null, data?: Array<{ __typename?: 'User', about?: string | null, avatar?: any | null, banned?: boolean | null, bannedAt?: any | null, bannedReason?: string | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, loginType?: string | null, organizationName?: string | null, summary?: string | null, walletAddress?: string | null }> | null } | null };


export const AdminUsersDocument = gql`
    query adminUsers($includesBanned: Boolean, $onlyBanned: Boolean, $pagination: PaginationInput, $role: UserRole) {
  adminUsers(
    includesBanned: $includesBanned
    onlyBanned: $onlyBanned
    pagination: $pagination
    role: $role
  ) {
    count
    data {
      about
      avatar
      banned
      bannedAt
      bannedReason
      email
      firstName
      id
      image
      lastName
      loginType
      organizationName
      summary
      walletAddress
    }
  }
}
    `;

/**
 * __useAdminUsersQuery__
 *
 * To run a query within a React component, call `useAdminUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminUsersQuery({
 *   variables: {
 *      includesBanned: // value for 'includesBanned'
 *      onlyBanned: // value for 'onlyBanned'
 *      pagination: // value for 'pagination'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useAdminUsersQuery(baseOptions?: Apollo.QueryHookOptions<AdminUsersQuery, AdminUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminUsersQuery, AdminUsersQueryVariables>(AdminUsersDocument, options);
      }
export function useAdminUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminUsersQuery, AdminUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminUsersQuery, AdminUsersQueryVariables>(AdminUsersDocument, options);
        }
export function useAdminUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminUsersQuery, AdminUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminUsersQuery, AdminUsersQueryVariables>(AdminUsersDocument, options);
        }
export type AdminUsersQueryHookResult = ReturnType<typeof useAdminUsersQuery>;
export type AdminUsersLazyQueryHookResult = ReturnType<typeof useAdminUsersLazyQuery>;
export type AdminUsersSuspenseQueryHookResult = ReturnType<typeof useAdminUsersSuspenseQuery>;
export type AdminUsersQueryResult = Apollo.QueryResult<AdminUsersQuery, AdminUsersQueryVariables>;