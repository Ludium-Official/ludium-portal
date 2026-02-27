import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MyBuidlsInHackathonQueryVariables = Types.Exact<{
  hackathonId: Types.Scalars['ID']['input'];
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
  trackId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type MyBuidlsInHackathonQuery = { __typename?: 'Query', myBuidlsInHackathon?: { __typename?: 'PaginatedHackathonBuidls', count?: number | null, totalPages?: number | null, currentPage?: number | null, hasNextPage?: boolean | null, hasPreviousPage?: boolean | null, data?: Array<{ __typename?: 'HackathonBuidl', id?: string | null, hackathonId?: string | null, title?: string | null, description?: string | null, coverImage?: string | null, buidlDescription?: string | null, githubLink?: string | null, websiteLink?: string | null, demoVideoLink?: string | null, socialLinks?: Array<string> | null, sponsorIds?: Array<string> | null, status?: Types.HackathonBuidlStatus | null, owner?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null } | null, sponsors?: Array<{ __typename?: 'HackathonSponsor', id?: string | null, name?: string | null, sponsorImage?: string | null, tracks?: Array<{ __typename?: 'HackathonSponsorTrack', id?: string | null, title?: string | null, description?: string | null, prize?: number | null }> | null }> | null, builders?: Array<{ __typename?: 'HackathonBuidlBuilder', id?: string | null, userId?: number | null, isAccepted?: boolean | null, user?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null } | null }> | null }> | null } | null };


export const MyBuidlsInHackathonDocument = gql`
    query myBuidlsInHackathon($hackathonId: ID!, $page: Int, $limit: Int, $search: String, $trackId: ID) {
  myBuidlsInHackathon(
    hackathonId: $hackathonId
    page: $page
    limit: $limit
    search: $search
    trackId: $trackId
  ) {
    count
    totalPages
    currentPage
    hasNextPage
    hasPreviousPage
    data {
      id
      hackathonId
      title
      description
      coverImage
      buidlDescription
      githubLink
      websiteLink
      demoVideoLink
      socialLinks
      sponsorIds
      status
      owner {
        id
        nickname
        profileImage
      }
      sponsors {
        id
        name
        sponsorImage
        tracks {
          id
          title
          description
          prize
        }
      }
      builders {
        id
        userId
        isAccepted
        user {
          id
          nickname
          profileImage
        }
      }
    }
  }
}
    `;

/**
 * __useMyBuidlsInHackathonQuery__
 *
 * To run a query within a React component, call `useMyBuidlsInHackathonQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyBuidlsInHackathonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyBuidlsInHackathonQuery({
 *   variables: {
 *      hackathonId: // value for 'hackathonId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      search: // value for 'search'
 *      trackId: // value for 'trackId'
 *   },
 * });
 */
export function useMyBuidlsInHackathonQuery(baseOptions: Apollo.QueryHookOptions<MyBuidlsInHackathonQuery, MyBuidlsInHackathonQueryVariables> & ({ variables: MyBuidlsInHackathonQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyBuidlsInHackathonQuery, MyBuidlsInHackathonQueryVariables>(MyBuidlsInHackathonDocument, options);
      }
export function useMyBuidlsInHackathonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyBuidlsInHackathonQuery, MyBuidlsInHackathonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyBuidlsInHackathonQuery, MyBuidlsInHackathonQueryVariables>(MyBuidlsInHackathonDocument, options);
        }
export function useMyBuidlsInHackathonSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyBuidlsInHackathonQuery, MyBuidlsInHackathonQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyBuidlsInHackathonQuery, MyBuidlsInHackathonQueryVariables>(MyBuidlsInHackathonDocument, options);
        }
export type MyBuidlsInHackathonQueryHookResult = ReturnType<typeof useMyBuidlsInHackathonQuery>;
export type MyBuidlsInHackathonLazyQueryHookResult = ReturnType<typeof useMyBuidlsInHackathonLazyQuery>;
export type MyBuidlsInHackathonSuspenseQueryHookResult = ReturnType<typeof useMyBuidlsInHackathonSuspenseQuery>;
export type MyBuidlsInHackathonQueryResult = Apollo.QueryResult<MyBuidlsInHackathonQuery, MyBuidlsInHackathonQueryVariables>;