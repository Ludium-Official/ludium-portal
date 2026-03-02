import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HackathonQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type HackathonQuery = { __typename?: 'Query', hackathon?: { __typename?: 'Hackathon', id?: string | null, title?: string | null, coverImage?: string | null, status?: Types.HackathonStatus | null, trackMode?: Types.HackathonTrackMode | null, deadlineAt?: any | null, submissionAt?: any | null, prizePoolAmount?: number | null, networkId?: number | null, tokenId?: number | null, createdAt?: any | null, updatedAt?: any | null, network?: { __typename?: 'NetworkV2', id?: string | null, chainId?: number | null, chainName?: string | null, mainnet?: boolean | null, exploreUrl?: string | null } | null, token?: { __typename?: 'TokenV2', id?: string | null, tokenName?: string | null, decimals?: number | null, tokenAddress?: string | null } | null, sponsor?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null, email?: string | null } | null } | null };


export const HackathonDocument = gql`
    query hackathon($id: ID!) {
  hackathon(id: $id) {
    id
    title
    coverImage
    status
    trackMode
    deadlineAt
    submissionAt
    prizePoolAmount
    networkId
    tokenId
    createdAt
    updatedAt
    network {
      id
      chainId
      chainName
      mainnet
      exploreUrl
    }
    token {
      id
      tokenName
      decimals
      tokenAddress
    }
    sponsor {
      id
      nickname
      profileImage
      email
    }
  }
}
    `;

/**
 * __useHackathonQuery__
 *
 * To run a query within a React component, call `useHackathonQuery` and pass it any options that fit your needs.
 * When your component renders, `useHackathonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHackathonQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useHackathonQuery(baseOptions: Apollo.QueryHookOptions<HackathonQuery, HackathonQueryVariables> & ({ variables: HackathonQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HackathonQuery, HackathonQueryVariables>(HackathonDocument, options);
      }
export function useHackathonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HackathonQuery, HackathonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HackathonQuery, HackathonQueryVariables>(HackathonDocument, options);
        }
export function useHackathonSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HackathonQuery, HackathonQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HackathonQuery, HackathonQueryVariables>(HackathonDocument, options);
        }
export type HackathonQueryHookResult = ReturnType<typeof useHackathonQuery>;
export type HackathonLazyQueryHookResult = ReturnType<typeof useHackathonLazyQuery>;
export type HackathonSuspenseQueryHookResult = ReturnType<typeof useHackathonSuspenseQuery>;
export type HackathonQueryResult = Apollo.QueryResult<HackathonQuery, HackathonQueryVariables>;