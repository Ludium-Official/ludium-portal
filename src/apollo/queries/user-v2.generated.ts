import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UserV2QueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type UserV2Query = { __typename?: 'Query', userV2?: { __typename?: 'UserV2', id?: string | null, role?: Types.UserRoleV2 | null, loginType?: Types.LoginTypeEnum | null, walletAddress?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, organizationName?: string | null, profileImage?: string | null, bio?: string | null, skills?: Array<string> | null, links?: Array<string> | null, createdAt?: any | null, updatedAt?: any | null } | null };


export const UserV2Document = gql`
    query userV2($id: ID!) {
  userV2(id: $id) {
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
}
    `;

/**
 * __useUserV2Query__
 *
 * To run a query within a React component, call `useUserV2Query` and pass it any options that fit your needs.
 * When your component renders, `useUserV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserV2Query({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserV2Query(baseOptions: Apollo.QueryHookOptions<UserV2Query, UserV2QueryVariables> & ({ variables: UserV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserV2Query, UserV2QueryVariables>(UserV2Document, options);
      }
export function useUserV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserV2Query, UserV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserV2Query, UserV2QueryVariables>(UserV2Document, options);
        }
export function useUserV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UserV2Query, UserV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserV2Query, UserV2QueryVariables>(UserV2Document, options);
        }
export type UserV2QueryHookResult = ReturnType<typeof useUserV2Query>;
export type UserV2LazyQueryHookResult = ReturnType<typeof useUserV2LazyQuery>;
export type UserV2SuspenseQueryHookResult = ReturnType<typeof useUserV2SuspenseQuery>;
export type UserV2QueryResult = Apollo.QueryResult<UserV2Query, UserV2QueryVariables>;