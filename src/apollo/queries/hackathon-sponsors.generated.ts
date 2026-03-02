import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HackathonSponsorsQueryVariables = Types.Exact<{
  hackathonId: Types.Scalars['ID']['input'];
}>;


export type HackathonSponsorsQuery = { __typename?: 'Query', hackathonSponsors?: Array<{ __typename?: 'HackathonSponsor', id?: string | null, name?: string | null, sponsorImage?: string | null, about?: string | null, link?: string | null, tracks?: Array<{ __typename?: 'HackathonSponsorTrack', id?: string | null, title?: string | null, description?: string | null, prize?: number | null }> | null }> | null };


export const HackathonSponsorsDocument = gql`
    query hackathonSponsors($hackathonId: ID!) {
  hackathonSponsors(hackathonId: $hackathonId) {
    id
    name
    sponsorImage
    about
    link
    tracks {
      id
      title
      description
      prize
    }
  }
}
    `;

/**
 * __useHackathonSponsorsQuery__
 *
 * To run a query within a React component, call `useHackathonSponsorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHackathonSponsorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHackathonSponsorsQuery({
 *   variables: {
 *      hackathonId: // value for 'hackathonId'
 *   },
 * });
 */
export function useHackathonSponsorsQuery(baseOptions: Apollo.QueryHookOptions<HackathonSponsorsQuery, HackathonSponsorsQueryVariables> & ({ variables: HackathonSponsorsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HackathonSponsorsQuery, HackathonSponsorsQueryVariables>(HackathonSponsorsDocument, options);
      }
export function useHackathonSponsorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HackathonSponsorsQuery, HackathonSponsorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HackathonSponsorsQuery, HackathonSponsorsQueryVariables>(HackathonSponsorsDocument, options);
        }
export function useHackathonSponsorsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HackathonSponsorsQuery, HackathonSponsorsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HackathonSponsorsQuery, HackathonSponsorsQueryVariables>(HackathonSponsorsDocument, options);
        }
export type HackathonSponsorsQueryHookResult = ReturnType<typeof useHackathonSponsorsQuery>;
export type HackathonSponsorsLazyQueryHookResult = ReturnType<typeof useHackathonSponsorsLazyQuery>;
export type HackathonSponsorsSuspenseQueryHookResult = ReturnType<typeof useHackathonSponsorsSuspenseQuery>;
export type HackathonSponsorsQueryResult = Apollo.QueryResult<HackathonSponsorsQuery, HackathonSponsorsQueryVariables>;