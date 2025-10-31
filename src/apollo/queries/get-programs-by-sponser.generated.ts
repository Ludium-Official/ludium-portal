import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetProgramsBySponsorV2QueryVariables = Types.Exact<{
  sponsorId: Types.Scalars['ID']['input'];
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type GetProgramsBySponsorV2Query = { __typename?: 'Query', programsBysponsorIdV2?: { __typename?: 'PaginatedProgramsV2', count?: number | null, data?: Array<{ __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, price?: string | null, createdAt?: any | null, deadline?: any | null, status?: Types.ProgramStatusV2 | null, sponsor?: { __typename?: 'UserV2', id?: string | null, walletAddress?: string | null, email?: string | null } | null, network?: { __typename?: 'NetworkV2', id?: string | null, chainName?: string | null } | null, token?: { __typename?: 'TokenV2', id?: string | null, tokenName?: string | null } | null }> | null } | null };


export const GetProgramsBySponsorV2Document = gql`
    query GetProgramsBySponsorV2($sponsorId: ID!, $pagination: PaginationInput) {
  programsBysponsorIdV2(sponsorId: $sponsorId, pagination: $pagination) {
    data {
      id
      title
      description
      price
      createdAt
      deadline
      status
      sponsor {
        id
        walletAddress
        email
      }
      network {
        id
        chainName
      }
      token {
        id
        tokenName
      }
    }
    count
  }
}
    `;

/**
 * __useGetProgramsBySponsorV2Query__
 *
 * To run a query within a React component, call `useGetProgramsBySponsorV2Query` and pass it any options that fit your needs.
 * When your component renders, `useGetProgramsBySponsorV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProgramsBySponsorV2Query({
 *   variables: {
 *      sponsorId: // value for 'sponsorId'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetProgramsBySponsorV2Query(baseOptions: Apollo.QueryHookOptions<GetProgramsBySponsorV2Query, GetProgramsBySponsorV2QueryVariables> & ({ variables: GetProgramsBySponsorV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProgramsBySponsorV2Query, GetProgramsBySponsorV2QueryVariables>(GetProgramsBySponsorV2Document, options);
      }
export function useGetProgramsBySponsorV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProgramsBySponsorV2Query, GetProgramsBySponsorV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProgramsBySponsorV2Query, GetProgramsBySponsorV2QueryVariables>(GetProgramsBySponsorV2Document, options);
        }
export function useGetProgramsBySponsorV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProgramsBySponsorV2Query, GetProgramsBySponsorV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProgramsBySponsorV2Query, GetProgramsBySponsorV2QueryVariables>(GetProgramsBySponsorV2Document, options);
        }
export type GetProgramsBySponsorV2QueryHookResult = ReturnType<typeof useGetProgramsBySponsorV2Query>;
export type GetProgramsBySponsorV2LazyQueryHookResult = ReturnType<typeof useGetProgramsBySponsorV2LazyQuery>;
export type GetProgramsBySponsorV2SuspenseQueryHookResult = ReturnType<typeof useGetProgramsBySponsorV2SuspenseQuery>;
export type GetProgramsBySponsorV2QueryResult = Apollo.QueryResult<GetProgramsBySponsorV2Query, GetProgramsBySponsorV2QueryVariables>;