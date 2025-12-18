import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MyApplicationsV2QueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.MyApplicationsV2QueryInput>;
}>;


export type MyApplicationsV2Query = { __typename?: 'Query', myApplicationsV2?: { __typename?: 'PaginatedApplicationsV2', count?: number | null, totalPages?: number | null, currentPage?: number | null, hasNextPage?: boolean | null, hasPreviousPage?: boolean | null, data?: Array<{ __typename?: 'ApplicationV2', id?: string | null, status?: Types.ApplicationStatusV2 | null, content?: string | null, picked?: boolean | null, rejectedReason?: string | null, createdAt?: any | null, updatedAt?: any | null, applicant?: { __typename?: 'UserV2', id?: string | null, email?: string | null, nickname?: string | null, profileImage?: string | null } | null, program?: { __typename?: 'ProgramV2', id?: string | null, title?: string | null, description?: string | null, deadline?: any | null, status?: Types.ProgramStatusV2 | null } | null }> | null } | null };


export const MyApplicationsV2Document = gql`
    query myApplicationsV2($query: MyApplicationsV2QueryInput) {
  myApplicationsV2(query: $query) {
    data {
      id
      status
      content
      picked
      rejectedReason
      createdAt
      updatedAt
      applicant {
        id
        email
        nickname
        profileImage
      }
      program {
        id
        title
        description
        deadline
        status
      }
    }
    count
    totalPages
    currentPage
    hasNextPage
    hasPreviousPage
  }
}
    `;

/**
 * __useMyApplicationsV2Query__
 *
 * To run a query within a React component, call `useMyApplicationsV2Query` and pass it any options that fit your needs.
 * When your component renders, `useMyApplicationsV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyApplicationsV2Query({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useMyApplicationsV2Query(baseOptions?: Apollo.QueryHookOptions<MyApplicationsV2Query, MyApplicationsV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyApplicationsV2Query, MyApplicationsV2QueryVariables>(MyApplicationsV2Document, options);
      }
export function useMyApplicationsV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyApplicationsV2Query, MyApplicationsV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyApplicationsV2Query, MyApplicationsV2QueryVariables>(MyApplicationsV2Document, options);
        }
export function useMyApplicationsV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyApplicationsV2Query, MyApplicationsV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyApplicationsV2Query, MyApplicationsV2QueryVariables>(MyApplicationsV2Document, options);
        }
export type MyApplicationsV2QueryHookResult = ReturnType<typeof useMyApplicationsV2Query>;
export type MyApplicationsV2LazyQueryHookResult = ReturnType<typeof useMyApplicationsV2LazyQuery>;
export type MyApplicationsV2SuspenseQueryHookResult = ReturnType<typeof useMyApplicationsV2SuspenseQuery>;
export type MyApplicationsV2QueryResult = Apollo.QueryResult<MyApplicationsV2Query, MyApplicationsV2QueryVariables>;