import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetProgramsV2QueryVariables = Types.Exact<{
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type GetProgramsV2Query = { __typename?: 'Query', programsV2?: { __typename?: 'PaginatedProgramsV2', count?: number | null, data?: Array<{ __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, price?: string | null, createdAt?: any | null, deadline?: any | null, applicationCount?: number | null, hasApplied?: boolean | null, sponsor?: { __typename?: 'UserV2', id?: string | null, walletAddress?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, profileImage?: string | null } | null, network?: { __typename?: 'NetworkV2', id?: string | null, chainId?: number | null, chainName?: string | null, mainnet?: boolean | null, exploreUrl?: string | null } | null, token?: { __typename?: 'TokenV2', id?: string | null, chainInfoId?: number | null, tokenName?: string | null, tokenAddress?: string | null } | null }> | null } | null };


export const GetProgramsV2Document = gql`
    query GetProgramsV2($pagination: PaginationInput) {
  programsV2(pagination: $pagination) {
    data {
      id
      title
      description
      price
      createdAt
      deadline
      applicationCount
      hasApplied
      sponsor {
        id
        walletAddress
        email
        firstName
        lastName
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
 * __useGetProgramsV2Query__
 *
 * To run a query within a React component, call `useGetProgramsV2Query` and pass it any options that fit your needs.
 * When your component renders, `useGetProgramsV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProgramsV2Query({
 *   variables: {
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetProgramsV2Query(baseOptions?: Apollo.QueryHookOptions<GetProgramsV2Query, GetProgramsV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProgramsV2Query, GetProgramsV2QueryVariables>(GetProgramsV2Document, options);
      }
export function useGetProgramsV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProgramsV2Query, GetProgramsV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProgramsV2Query, GetProgramsV2QueryVariables>(GetProgramsV2Document, options);
        }
export function useGetProgramsV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProgramsV2Query, GetProgramsV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProgramsV2Query, GetProgramsV2QueryVariables>(GetProgramsV2Document, options);
        }
export type GetProgramsV2QueryHookResult = ReturnType<typeof useGetProgramsV2Query>;
export type GetProgramsV2LazyQueryHookResult = ReturnType<typeof useGetProgramsV2LazyQuery>;
export type GetProgramsV2SuspenseQueryHookResult = ReturnType<typeof useGetProgramsV2SuspenseQuery>;
export type GetProgramsV2QueryResult = Apollo.QueryResult<GetProgramsV2Query, GetProgramsV2QueryVariables>;