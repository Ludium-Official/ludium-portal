import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type JobActivityCardsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type JobActivityCardsQuery = { __typename?: 'Query', jobActivityCards?: { __typename?: 'BuilderJobActivityCards', applied?: number | null, ongoing?: number | null, completed?: number | null } | null };

export type JobActivityProgramsQueryVariables = Types.Exact<{
  input: Types.JobActivityProgramsInput;
}>;


export type JobActivityProgramsQuery = { __typename?: 'Query', jobActivityPrograms?: { __typename?: 'PaginatedProgramsV2', count?: number | null, data?: Array<{ __typename?: 'ProgramV2', id?: string | null, title?: string | null, price?: string | null, createdAt?: any | null, myApplication?: { __typename?: 'ApplicationV2', createdAt?: any | null } | null, network?: { __typename?: 'NetworkV2', id?: string | null, chainId?: number | null, chainName?: string | null, mainnet?: boolean | null, exploreUrl?: string | null } | null, token?: { __typename?: 'TokenV2', id?: string | null, chainInfoId?: number | null, tokenName?: string | null, tokenAddress?: string | null } | null }> | null } | null };


export const JobActivityCardsDocument = gql`
    query jobActivityCards {
  jobActivityCards {
    applied
    ongoing
    completed
  }
}
    `;

/**
 * __useJobActivityCardsQuery__
 *
 * To run a query within a React component, call `useJobActivityCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useJobActivityCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useJobActivityCardsQuery({
 *   variables: {
 *   },
 * });
 */
export function useJobActivityCardsQuery(baseOptions?: Apollo.QueryHookOptions<JobActivityCardsQuery, JobActivityCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<JobActivityCardsQuery, JobActivityCardsQueryVariables>(JobActivityCardsDocument, options);
      }
export function useJobActivityCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<JobActivityCardsQuery, JobActivityCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<JobActivityCardsQuery, JobActivityCardsQueryVariables>(JobActivityCardsDocument, options);
        }
export function useJobActivityCardsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<JobActivityCardsQuery, JobActivityCardsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<JobActivityCardsQuery, JobActivityCardsQueryVariables>(JobActivityCardsDocument, options);
        }
export type JobActivityCardsQueryHookResult = ReturnType<typeof useJobActivityCardsQuery>;
export type JobActivityCardsLazyQueryHookResult = ReturnType<typeof useJobActivityCardsLazyQuery>;
export type JobActivityCardsSuspenseQueryHookResult = ReturnType<typeof useJobActivityCardsSuspenseQuery>;
export type JobActivityCardsQueryResult = Apollo.QueryResult<JobActivityCardsQuery, JobActivityCardsQueryVariables>;
export const JobActivityProgramsDocument = gql`
    query jobActivityPrograms($input: JobActivityProgramsInput!) {
  jobActivityPrograms(input: $input) {
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
    `;

/**
 * __useJobActivityProgramsQuery__
 *
 * To run a query within a React component, call `useJobActivityProgramsQuery` and pass it any options that fit your needs.
 * When your component renders, `useJobActivityProgramsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useJobActivityProgramsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useJobActivityProgramsQuery(baseOptions: Apollo.QueryHookOptions<JobActivityProgramsQuery, JobActivityProgramsQueryVariables> & ({ variables: JobActivityProgramsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<JobActivityProgramsQuery, JobActivityProgramsQueryVariables>(JobActivityProgramsDocument, options);
      }
export function useJobActivityProgramsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<JobActivityProgramsQuery, JobActivityProgramsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<JobActivityProgramsQuery, JobActivityProgramsQueryVariables>(JobActivityProgramsDocument, options);
        }
export function useJobActivityProgramsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<JobActivityProgramsQuery, JobActivityProgramsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<JobActivityProgramsQuery, JobActivityProgramsQueryVariables>(JobActivityProgramsDocument, options);
        }
export type JobActivityProgramsQueryHookResult = ReturnType<typeof useJobActivityProgramsQuery>;
export type JobActivityProgramsLazyQueryHookResult = ReturnType<typeof useJobActivityProgramsLazyQuery>;
export type JobActivityProgramsSuspenseQueryHookResult = ReturnType<typeof useJobActivityProgramsSuspenseQuery>;
export type JobActivityProgramsQueryResult = Apollo.QueryResult<JobActivityProgramsQuery, JobActivityProgramsQueryVariables>;