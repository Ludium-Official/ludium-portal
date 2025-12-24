import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type JobActivityV2QueryVariables = Types.Exact<{
  input: Types.JobActivityV2Input;
}>;


export type JobActivityV2Query = { __typename?: 'Query', jobActivityV2?: { __typename?: 'JobActivityV2', cards?: { __typename?: 'BuilderJobActivityCards', applied?: number | null, ongoing?: number | null, completed?: number | null } | null, programs?: { __typename?: 'PaginatedProgramsV2', count?: number | null, data?: Array<{ __typename?: 'ProgramV2', id?: string | null, title?: string | null, price?: string | null, createdAt?: any | null, myApplication?: { __typename?: 'ApplicationV2', createdAt?: any | null } | null, network?: { __typename?: 'NetworkV2', id?: string | null, chainId?: number | null, chainName?: string | null, mainnet?: boolean | null, exploreUrl?: string | null } | null, token?: { __typename?: 'TokenV2', id?: string | null, chainInfoId?: number | null, tokenName?: string | null, tokenAddress?: string | null } | null }> | null } | null } | null };


export const JobActivityV2Document = gql`
    query jobActivityV2($input: JobActivityV2Input!) {
  jobActivityV2(input: $input) {
    cards {
      applied
      ongoing
      completed
    }
    programs {
      data {
        id
        title
        price
        createdAt
        myApplication {
          createdAt
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
 * __useJobActivityV2Query__
 *
 * To run a query within a React component, call `useJobActivityV2Query` and pass it any options that fit your needs.
 * When your component renders, `useJobActivityV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useJobActivityV2Query({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useJobActivityV2Query(baseOptions: Apollo.QueryHookOptions<JobActivityV2Query, JobActivityV2QueryVariables> & ({ variables: JobActivityV2QueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<JobActivityV2Query, JobActivityV2QueryVariables>(JobActivityV2Document, options);
      }
export function useJobActivityV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<JobActivityV2Query, JobActivityV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<JobActivityV2Query, JobActivityV2QueryVariables>(JobActivityV2Document, options);
        }
export function useJobActivityV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<JobActivityV2Query, JobActivityV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<JobActivityV2Query, JobActivityV2QueryVariables>(JobActivityV2Document, options);
        }
export type JobActivityV2QueryHookResult = ReturnType<typeof useJobActivityV2Query>;
export type JobActivityV2LazyQueryHookResult = ReturnType<typeof useJobActivityV2LazyQuery>;
export type JobActivityV2SuspenseQueryHookResult = ReturnType<typeof useJobActivityV2SuspenseQuery>;
export type JobActivityV2QueryResult = Apollo.QueryResult<JobActivityV2Query, JobActivityV2QueryVariables>;