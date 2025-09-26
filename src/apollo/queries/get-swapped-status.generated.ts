import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetSwappedStatusQueryVariables = Types.Exact<{
  userId: Types.Scalars['String']['input'];
}>;


export type GetSwappedStatusQuery = { __typename?: 'Query', getSwappedStatus?: { __typename?: 'SwappedStatusResponse', status?: string | null, message?: string | null, orderId?: string | null, data?: string | null } | null };


export const GetSwappedStatusDocument = gql`
    query GetSwappedStatus($userId: String!) {
  getSwappedStatus(userId: $userId) {
    status
    message
    orderId
    data
  }
}
    `;

/**
 * __useGetSwappedStatusQuery__
 *
 * To run a query within a React component, call `useGetSwappedStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSwappedStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSwappedStatusQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetSwappedStatusQuery(baseOptions: Apollo.QueryHookOptions<GetSwappedStatusQuery, GetSwappedStatusQueryVariables> & ({ variables: GetSwappedStatusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSwappedStatusQuery, GetSwappedStatusQueryVariables>(GetSwappedStatusDocument, options);
      }
export function useGetSwappedStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSwappedStatusQuery, GetSwappedStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSwappedStatusQuery, GetSwappedStatusQueryVariables>(GetSwappedStatusDocument, options);
        }
export function useGetSwappedStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSwappedStatusQuery, GetSwappedStatusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSwappedStatusQuery, GetSwappedStatusQueryVariables>(GetSwappedStatusDocument, options);
        }
export type GetSwappedStatusQueryHookResult = ReturnType<typeof useGetSwappedStatusQuery>;
export type GetSwappedStatusLazyQueryHookResult = ReturnType<typeof useGetSwappedStatusLazyQuery>;
export type GetSwappedStatusSuspenseQueryHookResult = ReturnType<typeof useGetSwappedStatusSuspenseQuery>;
export type GetSwappedStatusQueryResult = Apollo.QueryResult<GetSwappedStatusQuery, GetSwappedStatusQueryVariables>;