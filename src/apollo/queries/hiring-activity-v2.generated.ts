import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HiringActivityCardsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type HiringActivityCardsQuery = { __typename?: 'Query', hiringActivityCards?: { __typename?: 'SponsorHiringActivityCards', all?: number | null, open?: number | null, ongoing?: number | null, completed?: number | null } | null };

export type HiringActivityProgramsQueryVariables = Types.Exact<{
  input: Types.HiringActivityProgramsInput;
}>;


export type HiringActivityProgramsQuery = { __typename?: 'Query', hiringActivityPrograms?: { __typename?: 'PaginatedProgramsV2', count?: number | null, data?: Array<{ __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, price?: string | null, status?: Types.ProgramStatusV2 | null, createdAt?: any | null, deadline?: any | null, applicationCount?: number | null, hasApplied?: boolean | null, sponsor?: { __typename?: 'UserV2', id?: string | null, walletAddress?: string | null, email?: string | null, nickname?: string | null, profileImage?: string | null } | null, network?: { __typename?: 'NetworkV2', id?: string | null, chainId?: number | null, chainName?: string | null, mainnet?: boolean | null, exploreUrl?: string | null } | null, token?: { __typename?: 'TokenV2', id?: string | null, chainInfoId?: number | null, tokenName?: string | null, tokenAddress?: string | null } | null }> | null } | null };


export const HiringActivityCardsDocument = gql`
    query hiringActivityCards {
  hiringActivityCards {
    all
    open
    ongoing
    completed
  }
}
    `;

/**
 * __useHiringActivityCardsQuery__
 *
 * To run a query within a React component, call `useHiringActivityCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHiringActivityCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHiringActivityCardsQuery({
 *   variables: {
 *   },
 * });
 */
export function useHiringActivityCardsQuery(baseOptions?: Apollo.QueryHookOptions<HiringActivityCardsQuery, HiringActivityCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HiringActivityCardsQuery, HiringActivityCardsQueryVariables>(HiringActivityCardsDocument, options);
      }
export function useHiringActivityCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HiringActivityCardsQuery, HiringActivityCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HiringActivityCardsQuery, HiringActivityCardsQueryVariables>(HiringActivityCardsDocument, options);
        }
export function useHiringActivityCardsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HiringActivityCardsQuery, HiringActivityCardsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HiringActivityCardsQuery, HiringActivityCardsQueryVariables>(HiringActivityCardsDocument, options);
        }
export type HiringActivityCardsQueryHookResult = ReturnType<typeof useHiringActivityCardsQuery>;
export type HiringActivityCardsLazyQueryHookResult = ReturnType<typeof useHiringActivityCardsLazyQuery>;
export type HiringActivityCardsSuspenseQueryHookResult = ReturnType<typeof useHiringActivityCardsSuspenseQuery>;
export type HiringActivityCardsQueryResult = Apollo.QueryResult<HiringActivityCardsQuery, HiringActivityCardsQueryVariables>;
export const HiringActivityProgramsDocument = gql`
    query hiringActivityPrograms($input: HiringActivityProgramsInput!) {
  hiringActivityPrograms(input: $input) {
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
    `;

/**
 * __useHiringActivityProgramsQuery__
 *
 * To run a query within a React component, call `useHiringActivityProgramsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHiringActivityProgramsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHiringActivityProgramsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useHiringActivityProgramsQuery(baseOptions: Apollo.QueryHookOptions<HiringActivityProgramsQuery, HiringActivityProgramsQueryVariables> & ({ variables: HiringActivityProgramsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HiringActivityProgramsQuery, HiringActivityProgramsQueryVariables>(HiringActivityProgramsDocument, options);
      }
export function useHiringActivityProgramsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HiringActivityProgramsQuery, HiringActivityProgramsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HiringActivityProgramsQuery, HiringActivityProgramsQueryVariables>(HiringActivityProgramsDocument, options);
        }
export function useHiringActivityProgramsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HiringActivityProgramsQuery, HiringActivityProgramsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HiringActivityProgramsQuery, HiringActivityProgramsQueryVariables>(HiringActivityProgramsDocument, options);
        }
export type HiringActivityProgramsQueryHookResult = ReturnType<typeof useHiringActivityProgramsQuery>;
export type HiringActivityProgramsLazyQueryHookResult = ReturnType<typeof useHiringActivityProgramsLazyQuery>;
export type HiringActivityProgramsSuspenseQueryHookResult = ReturnType<typeof useHiringActivityProgramsSuspenseQuery>;
export type HiringActivityProgramsQueryResult = Apollo.QueryResult<HiringActivityProgramsQuery, HiringActivityProgramsQueryVariables>;