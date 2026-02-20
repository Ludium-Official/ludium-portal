import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HackathonPrizesQueryVariables = Types.Exact<{
  hackathonId: Types.Scalars['ID']['input'];
}>;


export type HackathonPrizesQuery = { __typename?: 'Query', hackathonPrizes?: Array<{ __typename?: 'HackathonPrize', id?: string | null, hackathonId?: string | null, name?: string | null, about?: string | null, prize?: number | null, sponsorImage?: string | null, link?: string | null, createdAt?: any | null, updatedAt?: any | null }> | null };


export const HackathonPrizesDocument = gql`
    query hackathonPrizes($hackathonId: ID!) {
  hackathonPrizes(hackathonId: $hackathonId) {
    id
    hackathonId
    name
    about
    prize
    sponsorImage
    link
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useHackathonPrizesQuery__
 *
 * To run a query within a React component, call `useHackathonPrizesQuery` and pass it any options that fit your needs.
 * When your component renders, `useHackathonPrizesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHackathonPrizesQuery({
 *   variables: {
 *      hackathonId: // value for 'hackathonId'
 *   },
 * });
 */
export function useHackathonPrizesQuery(baseOptions: Apollo.QueryHookOptions<HackathonPrizesQuery, HackathonPrizesQueryVariables> & ({ variables: HackathonPrizesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HackathonPrizesQuery, HackathonPrizesQueryVariables>(HackathonPrizesDocument, options);
      }
export function useHackathonPrizesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HackathonPrizesQuery, HackathonPrizesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HackathonPrizesQuery, HackathonPrizesQueryVariables>(HackathonPrizesDocument, options);
        }
export function useHackathonPrizesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HackathonPrizesQuery, HackathonPrizesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HackathonPrizesQuery, HackathonPrizesQueryVariables>(HackathonPrizesDocument, options);
        }
export type HackathonPrizesQueryHookResult = ReturnType<typeof useHackathonPrizesQuery>;
export type HackathonPrizesLazyQueryHookResult = ReturnType<typeof useHackathonPrizesLazyQuery>;
export type HackathonPrizesSuspenseQueryHookResult = ReturnType<typeof useHackathonPrizesSuspenseQuery>;
export type HackathonPrizesQueryResult = Apollo.QueryResult<HackathonPrizesQuery, HackathonPrizesQueryVariables>;