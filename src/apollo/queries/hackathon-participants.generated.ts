import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HackathonParticipantsQueryVariables = Types.Exact<{
  hackathonId: Types.Scalars['ID']['input'];
}>;


export type HackathonParticipantsQuery = { __typename?: 'Query', hackathonParticipants?: Array<{ __typename?: 'HackathonParticipant', hackathonId?: string | null, registeredAt?: any | null, user?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null } | null, buidlsInfo?: { __typename?: 'HackathonParticipantBuidlInfo', buidlId?: string | null, title?: string | null } | null }> | null };


export const HackathonParticipantsDocument = gql`
    query hackathonParticipants($hackathonId: ID!) {
  hackathonParticipants(hackathonId: $hackathonId) {
    hackathonId
    registeredAt
    user {
      id
      nickname
      profileImage
    }
    buidlsInfo {
      buidlId
      title
    }
  }
}
    `;

/**
 * __useHackathonParticipantsQuery__
 *
 * To run a query within a React component, call `useHackathonParticipantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHackathonParticipantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHackathonParticipantsQuery({
 *   variables: {
 *      hackathonId: // value for 'hackathonId'
 *   },
 * });
 */
export function useHackathonParticipantsQuery(baseOptions: Apollo.QueryHookOptions<HackathonParticipantsQuery, HackathonParticipantsQueryVariables> & ({ variables: HackathonParticipantsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HackathonParticipantsQuery, HackathonParticipantsQueryVariables>(HackathonParticipantsDocument, options);
      }
export function useHackathonParticipantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HackathonParticipantsQuery, HackathonParticipantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HackathonParticipantsQuery, HackathonParticipantsQueryVariables>(HackathonParticipantsDocument, options);
        }
export function useHackathonParticipantsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HackathonParticipantsQuery, HackathonParticipantsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HackathonParticipantsQuery, HackathonParticipantsQueryVariables>(HackathonParticipantsDocument, options);
        }
export type HackathonParticipantsQueryHookResult = ReturnType<typeof useHackathonParticipantsQuery>;
export type HackathonParticipantsLazyQueryHookResult = ReturnType<typeof useHackathonParticipantsLazyQuery>;
export type HackathonParticipantsSuspenseQueryHookResult = ReturnType<typeof useHackathonParticipantsSuspenseQuery>;
export type HackathonParticipantsQueryResult = Apollo.QueryResult<HackathonParticipantsQuery, HackathonParticipantsQueryVariables>;