import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetProgramV2QueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GetProgramV2Query = { __typename?: 'Query', programV2?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, price?: string | null, createdAt?: any | null, deadline?: any | null, status?: Types.ProgramStatusV2 | null, visibility?: Types.ProgramVisibilityV2 | null, skills?: Array<string> | null, networkId?: number | null, token_id?: number | null, invitedMembers?: Array<string> | null, applicationCount?: number | null, hasApplied?: boolean | null, sponsor?: { __typename?: 'UserV2', id?: string | null, walletAddress?: string | null, email?: string | null, nickname?: string | null, profileImage?: string | null } | null, network?: { __typename?: 'NetworkV2', id?: string | null, chainId?: number | null, chainName?: string | null, mainnet?: boolean | null, exploreUrl?: string | null } | null, token?: { __typename?: 'TokenV2', id?: string | null, chainInfoId?: number | null, tokenName?: string | null, tokenAddress?: string | null } | null } | null };


export const GetProgramV2Document = gql`
    query GetProgramV2($id: ID!) {
  programV2(id: $id) {
    id
    title
    description
    price
    createdAt
    deadline
    status
    visibility
    skills
    networkId
    token_id
    invitedMembers
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
}
    `;

/**
 * __useGetProgramV2Query__
 *
 * To run a query within a React component, call `useGetProgramV2Query` and pass it any options that fit your needs.
 * When your component renders, `useGetProgramV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProgramV2Query({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProgramV2Query(baseOptions: Apollo.QueryHookOptions<GetProgramV2Query, GetProgramV2QueryVariables> & ({ variables: GetProgramV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProgramV2Query, GetProgramV2QueryVariables>(GetProgramV2Document, options);
      }
export function useGetProgramV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProgramV2Query, GetProgramV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProgramV2Query, GetProgramV2QueryVariables>(GetProgramV2Document, options);
        }
export function useGetProgramV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProgramV2Query, GetProgramV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProgramV2Query, GetProgramV2QueryVariables>(GetProgramV2Document, options);
        }
export type GetProgramV2QueryHookResult = ReturnType<typeof useGetProgramV2Query>;
export type GetProgramV2LazyQueryHookResult = ReturnType<typeof useGetProgramV2LazyQuery>;
export type GetProgramV2SuspenseQueryHookResult = ReturnType<typeof useGetProgramV2SuspenseQuery>;
export type GetProgramV2QueryResult = Apollo.QueryResult<GetProgramV2Query, GetProgramV2QueryVariables>;