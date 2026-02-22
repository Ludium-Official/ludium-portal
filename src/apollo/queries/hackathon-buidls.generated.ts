import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HackathonBuidlsQueryVariables = Types.Exact<{
  hackathonId: Types.Scalars['ID']['input'];
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type HackathonBuidlsQuery = { __typename?: 'Query', hackathonBuidls?: { __typename?: 'PaginatedHackathonBuidls', count?: number | null, totalPages?: number | null, currentPage?: number | null, hasNextPage?: boolean | null, hasPreviousPage?: boolean | null, data?: Array<{ __typename?: 'HackathonBuidl', id?: string | null, hackathonId?: string | null, title?: string | null, description?: string | null, coverImage?: string | null, buidlDescription?: string | null, githubLink?: string | null, websiteLink?: string | null, demoVideoLink?: string | null, socialLinks?: Array<string> | null, owner?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null } | null, sponsors?: Array<{ __typename?: 'HackathonSponsor', id?: string | null, name?: string | null, sponsorImage?: string | null, tracks?: Array<{ __typename?: 'HackathonSponsorTrack', id?: string | null, title?: string | null, description?: string | null, prize?: number | null }> | null }> | null, builders?: Array<{ __typename?: 'HackathonBuidlBuilder', id?: string | null, userId?: number | null, isAccepted?: boolean | null, user?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null } | null }> | null }> | null } | null };


export const HackathonBuidlsDocument = gql`
    query hackathonBuidls($hackathonId: ID!, $page: Int, $limit: Int) {
  hackathonBuidls(hackathonId: $hackathonId, page: $page, limit: $limit) {
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
 * __useHackathonBuidlsQuery__
 *
 * To run a query within a React component, call `useHackathonBuidlsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHackathonBuidlsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHackathonBuidlsQuery({
 *   variables: {
 *      hackathonId: // value for 'hackathonId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useHackathonBuidlsQuery(baseOptions: Apollo.QueryHookOptions<HackathonBuidlsQuery, HackathonBuidlsQueryVariables> & ({ variables: HackathonBuidlsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HackathonBuidlsQuery, HackathonBuidlsQueryVariables>(HackathonBuidlsDocument, options);
      }
export function useHackathonBuidlsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HackathonBuidlsQuery, HackathonBuidlsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HackathonBuidlsQuery, HackathonBuidlsQueryVariables>(HackathonBuidlsDocument, options);
        }
export function useHackathonBuidlsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HackathonBuidlsQuery, HackathonBuidlsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HackathonBuidlsQuery, HackathonBuidlsQueryVariables>(HackathonBuidlsDocument, options);
        }
export type HackathonBuidlsQueryHookResult = ReturnType<typeof useHackathonBuidlsQuery>;
export type HackathonBuidlsLazyQueryHookResult = ReturnType<typeof useHackathonBuidlsLazyQuery>;
export type HackathonBuidlsSuspenseQueryHookResult = ReturnType<typeof useHackathonBuidlsSuspenseQuery>;
export type HackathonBuidlsQueryResult = Apollo.QueryResult<HackathonBuidlsQuery, HackathonBuidlsQueryVariables>;