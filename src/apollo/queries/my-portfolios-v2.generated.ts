import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MyPortfoliosV2QueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MyPortfoliosV2Query = { __typename?: 'Query', myPortfoliosV2?: Array<{ __typename?: 'PortfolioV2', id?: string | null, title?: string | null, description?: string | null, role?: string | null, isLudiumProject?: boolean | null, images?: Array<string> | null, createdAt?: string | null, updatedAt?: string | null }> | null };


export const MyPortfoliosV2Document = gql`
    query myPortfoliosV2 {
  myPortfoliosV2 {
    id
    title
    description
    role
    isLudiumProject
    images
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useMyPortfoliosV2Query__
 *
 * To run a query within a React component, call `useMyPortfoliosV2Query` and pass it any options that fit your needs.
 * When your component renders, `useMyPortfoliosV2Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyPortfoliosV2Query({
 *   variables: {
 *   },
 * });
 */
export function useMyPortfoliosV2Query(baseOptions?: Apollo.QueryHookOptions<MyPortfoliosV2Query, MyPortfoliosV2QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyPortfoliosV2Query, MyPortfoliosV2QueryVariables>(MyPortfoliosV2Document, options);
      }
export function useMyPortfoliosV2LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyPortfoliosV2Query, MyPortfoliosV2QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyPortfoliosV2Query, MyPortfoliosV2QueryVariables>(MyPortfoliosV2Document, options);
        }
export function useMyPortfoliosV2SuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyPortfoliosV2Query, MyPortfoliosV2QueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyPortfoliosV2Query, MyPortfoliosV2QueryVariables>(MyPortfoliosV2Document, options);
        }
export type MyPortfoliosV2QueryHookResult = ReturnType<typeof useMyPortfoliosV2Query>;
export type MyPortfoliosV2LazyQueryHookResult = ReturnType<typeof useMyPortfoliosV2LazyQuery>;
export type MyPortfoliosV2SuspenseQueryHookResult = ReturnType<typeof useMyPortfoliosV2SuspenseQuery>;
export type MyPortfoliosV2QueryResult = Apollo.QueryResult<MyPortfoliosV2Query, MyPortfoliosV2QueryVariables>;