import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HiringActivityV2QueryVariables = Types.Exact<{
  input: Types.HiringActivityV2Input;
}>;


export type HiringActivityV2Query = { __typename?: 'Query', hiringActivityV2?: { __typename?: 'HiringActivityV2', cards?: { __typename?: 'SponsorHiringActivityCards', all?: number | null, open?: number | null, ongoing?: number | null, completed?: number | null } | null, programs?: { __typename?: 'PaginatedProgramsV2', count?: number | null, data?: Array<{ __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, price?: string | null, status?: Types.ProgramStatusV2 | null, createdAt?: any | null, deadline?: any | null, applicationCount?: number | null, hasApplied?: boolean | null, sponsor?: { __typename?: 'UserV2', id?: string | null, walletAddress?: string | null, email?: string | null, nickname?: string | null, profileImage?: string | null } | null, network?: { __typename?: 'NetworkV2', id?: string | null, chainId?: number | null, chainName?: string | null, mainnet?: boolean | null, exploreUrl?: string | null } | null, token?: { __typename?: 'TokenV2', id?: string | null, chainInfoId?: number | null, tokenName?: string | null, tokenAddress?: string | null } | null }> | null } | null } | null };


export const HiringActivityV2Document = gql`
    query hiringActivityV2($input: HiringActivityV2Input!) {
  hiringActivityV2(input: $input) {
    cards {
      all
      open
      ongoing
      completed
    }
    programs {
      data {
        id
        title
        description
        price
        status
        createdAt
        deadline
        applicationCount
        hasApplied
        sponsor {
          id
          walletAddress
          email
          nickname
          profileImage
        }
        network {
          id
          chainId
          chainName
          mainnet
          exploreUrl
        }
        token {
          id
          chainInfoId
          tokenName
          tokenAddress
        }
      }
      count
    }
  }
}
    `;

/**
 * __useHiringActivityV2Query__
 *
 * To run a query within a React component, call `useHiringActivityV2Query` and pass it any options that fit your needs.
 * When your component renders, `useHiringActivityV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHiringActivityV2Query({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useHiringActivityV2Query(baseOptions: Apollo.QueryHookOptions<HiringActivityV2Query, HiringActivityV2QueryVariables> & ({ variables: HiringActivityV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HiringActivityV2Query, HiringActivityV2QueryVariables>(HiringActivityV2Document, options);
      }
export function useHiringActivityV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HiringActivityV2Query, HiringActivityV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HiringActivityV2Query, HiringActivityV2QueryVariables>(HiringActivityV2Document, options);
        }
export function useHiringActivityV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HiringActivityV2Query, HiringActivityV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HiringActivityV2Query, HiringActivityV2QueryVariables>(HiringActivityV2Document, options);
        }
export type HiringActivityV2QueryHookResult = ReturnType<typeof useHiringActivityV2Query>;
export type HiringActivityV2LazyQueryHookResult = ReturnType<typeof useHiringActivityV2LazyQuery>;
export type HiringActivityV2SuspenseQueryHookResult = ReturnType<typeof useHiringActivityV2SuspenseQuery>;
export type HiringActivityV2QueryResult = Apollo.QueryResult<HiringActivityV2Query, HiringActivityV2QueryVariables>;