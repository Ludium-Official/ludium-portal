import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ProfileV2QueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ProfileV2Query = { __typename?: 'Query', profileV2?: { __typename?: 'UserV2', id?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, role?: Types.UserRoleV2 | null, loginType?: Types.LoginTypeEnum | null, walletAddress?: string | null, organizationName?: string | null, profileImage?: string | null, bio?: string | null, skills?: Array<string> | null, links?: Array<string> | null, createdAt?: any | null, updatedAt?: any | null } | null };


export const ProfileV2Document = gql`
    query profileV2 {
  profileV2 {
    id
    email
    firstName
    lastName
    role
    loginType
    walletAddress
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
 * __useProfileV2Query__
 *
 * To run a query within a React component, call `useProfileV2Query` and pass it any options that fit your needs.
 * When your component renders, `useProfileV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileV2Query({
 *   variables: {
 *   },
 * });
 */
export function useProfileV2Query(baseOptions?: Apollo.QueryHookOptions<ProfileV2Query, ProfileV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProfileV2Query, ProfileV2QueryVariables>(ProfileV2Document, options);
      }
export function useProfileV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfileV2Query, ProfileV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProfileV2Query, ProfileV2QueryVariables>(ProfileV2Document, options);
        }
export function useProfileV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProfileV2Query, ProfileV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProfileV2Query, ProfileV2QueryVariables>(ProfileV2Document, options);
        }
export type ProfileV2QueryHookResult = ReturnType<typeof useProfileV2Query>;
export type ProfileV2LazyQueryHookResult = ReturnType<typeof useProfileV2LazyQuery>;
export type ProfileV2SuspenseQueryHookResult = ReturnType<typeof useProfileV2SuspenseQuery>;
export type ProfileV2QueryResult = Apollo.QueryResult<ProfileV2Query, ProfileV2QueryVariables>;