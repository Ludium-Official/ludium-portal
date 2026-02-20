import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HackathonTracksQueryVariables = Types.Exact<{
  hackathonId: Types.Scalars['ID']['input'];
}>;


export type HackathonTracksQuery = { __typename?: 'Query', hackathonTracks?: Array<{ __typename?: 'HackathonTrack', id?: string | null, hackathonId?: string | null, title?: string | null, key?: string | null, description?: string | null, isActive?: boolean | null, sortOrder?: number | null, createdAt?: any | null, updatedAt?: any | null }> | null };


export const HackathonTracksDocument = gql`
    query hackathonTracks($hackathonId: ID!) {
  hackathonTracks(hackathonId: $hackathonId) {
    id
    hackathonId
    title
    key
    description
    isActive
    sortOrder
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useHackathonTracksQuery__
 *
 * To run a query within a React component, call `useHackathonTracksQuery` and pass it any options that fit your needs.
 * When your component renders, `useHackathonTracksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHackathonTracksQuery({
 *   variables: {
 *      hackathonId: // value for 'hackathonId'
 *   },
 * });
 */
export function useHackathonTracksQuery(baseOptions: Apollo.QueryHookOptions<HackathonTracksQuery, HackathonTracksQueryVariables> & ({ variables: HackathonTracksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HackathonTracksQuery, HackathonTracksQueryVariables>(HackathonTracksDocument, options);
      }
export function useHackathonTracksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HackathonTracksQuery, HackathonTracksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HackathonTracksQuery, HackathonTracksQueryVariables>(HackathonTracksDocument, options);
        }
export function useHackathonTracksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HackathonTracksQuery, HackathonTracksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HackathonTracksQuery, HackathonTracksQueryVariables>(HackathonTracksDocument, options);
        }
export type HackathonTracksQueryHookResult = ReturnType<typeof useHackathonTracksQuery>;
export type HackathonTracksLazyQueryHookResult = ReturnType<typeof useHackathonTracksLazyQuery>;
export type HackathonTracksSuspenseQueryHookResult = ReturnType<typeof useHackathonTracksSuspenseQuery>;
export type HackathonTracksQueryResult = Apollo.QueryResult<HackathonTracksQuery, HackathonTracksQueryVariables>;