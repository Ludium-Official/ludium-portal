import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MilestoneQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type MilestoneQuery = { __typename?: 'Query', milestone?: { __typename?: 'Milestone', currency?: string | null, description?: string | null, id?: string | null, price?: string | null, status?: Types.MilestoneStatus | null, title?: string | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null } | null };


export const MilestoneDocument = gql`
    query milestone($id: ID!) {
  milestone(id: $id) {
    currency
    description
    id
    links {
      title
      url
    }
    price
    status
    title
  }
}
    `;

/**
 * __useMilestoneQuery__
 *
 * To run a query within a React component, call `useMilestoneQuery` and pass it any options that fit your needs.
 * When your component renders, `useMilestoneQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMilestoneQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMilestoneQuery(baseOptions: Apollo.QueryHookOptions<MilestoneQuery, MilestoneQueryVariables> & ({ variables: MilestoneQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MilestoneQuery, MilestoneQueryVariables>(MilestoneDocument, options);
      }
export function useMilestoneLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MilestoneQuery, MilestoneQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MilestoneQuery, MilestoneQueryVariables>(MilestoneDocument, options);
        }
export function useMilestoneSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MilestoneQuery, MilestoneQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MilestoneQuery, MilestoneQueryVariables>(MilestoneDocument, options);
        }
export type MilestoneQueryHookResult = ReturnType<typeof useMilestoneQuery>;
export type MilestoneLazyQueryHookResult = ReturnType<typeof useMilestoneLazyQuery>;
export type MilestoneSuspenseQueryHookResult = ReturnType<typeof useMilestoneSuspenseQuery>;
export type MilestoneQueryResult = Apollo.QueryResult<MilestoneQuery, MilestoneQueryVariables>;