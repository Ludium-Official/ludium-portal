import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetProgramsByBuilderV2QueryVariables = Types.Exact<{
  builderId: Types.Scalars['ID']['input'];
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type GetProgramsByBuilderV2Query = { __typename?: 'Query', programsByBuilderIdV2?: { __typename?: 'PaginatedProgramsV2', count?: number | null, data?: Array<{ __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, price?: string | null, createdAt?: any | null, deadline?: any | null, status?: Types.ProgramStatusV2 | null, applicationCount?: number | null, sponsor?: { __typename?: 'UserV2', id?: string | null, walletAddress?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, profileImage?: string | null } | null, network?: { __typename?: 'NetworkV2', id?: string | null, chainId?: number | null, chainName?: string | null, mainnet?: boolean | null, exploreUrl?: string | null } | null, token?: { __typename?: 'TokenV2', id?: string | null, chainInfoId?: number | null, tokenName?: string | null, tokenAddress?: string | null } | null }> | null } | null };


export const GetProgramsByBuilderV2Document = gql`
    query GetProgramsByBuilderV2($builderId: ID!, $pagination: PaginationInput) {
  programsByBuilderIdV2(builderId: $builderId, pagination: $pagination) {
    data {
      id
      title
      description
      price
      createdAt
      deadline
      status
      applicationCount
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
 * __useGetProgramsByBuilderV2Query__
 *
 * To run a query within a React component, call `useGetProgramsByBuilderV2Query` and pass it any options that fit your needs.
 * When your component renders, `useGetProgramsByBuilderV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProgramsByBuilderV2Query({
 *   variables: {
 *      builderId: // value for 'builderId'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetProgramsByBuilderV2Query(baseOptions: Apollo.QueryHookOptions<GetProgramsByBuilderV2Query, GetProgramsByBuilderV2QueryVariables> & ({ variables: GetProgramsByBuilderV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProgramsByBuilderV2Query, GetProgramsByBuilderV2QueryVariables>(GetProgramsByBuilderV2Document, options);
      }
export function useGetProgramsByBuilderV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProgramsByBuilderV2Query, GetProgramsByBuilderV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProgramsByBuilderV2Query, GetProgramsByBuilderV2QueryVariables>(GetProgramsByBuilderV2Document, options);
        }
export function useGetProgramsByBuilderV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProgramsByBuilderV2Query, GetProgramsByBuilderV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProgramsByBuilderV2Query, GetProgramsByBuilderV2QueryVariables>(GetProgramsByBuilderV2Document, options);
        }
export type GetProgramsByBuilderV2QueryHookResult = ReturnType<typeof useGetProgramsByBuilderV2Query>;
export type GetProgramsByBuilderV2LazyQueryHookResult = ReturnType<typeof useGetProgramsByBuilderV2LazyQuery>;
export type GetProgramsByBuilderV2SuspenseQueryHookResult = ReturnType<typeof useGetProgramsByBuilderV2SuspenseQuery>;
export type GetProgramsByBuilderV2QueryResult = Apollo.QueryResult<GetProgramsByBuilderV2Query, GetProgramsByBuilderV2QueryVariables>;