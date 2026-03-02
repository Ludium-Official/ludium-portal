import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AppliedHackathonsQueryVariables = Types.Exact<{
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type AppliedHackathonsQuery = { __typename?: 'Query', appliedHackathons?: { __typename?: 'PaginatedAppliedHackathons', count?: number | null, totalPages?: number | null, currentPage?: number | null, hasNextPage?: boolean | null, hasPreviousPage?: boolean | null, data?: Array<{ __typename?: 'AppliedHackathon', hackathon?: { __typename?: 'Hackathon', id?: string | null, title?: string | null, coverImage?: string | null, status?: Types.HackathonStatus | null, submissionAt?: any | null, deadlineAt?: any | null, prizePoolAmount?: number | null, token?: { __typename?: 'TokenV2', id?: string | null, tokenName?: string | null, decimals?: number | null, tokenAddress?: string | null } | null } | null, firstSection?: { __typename?: 'HackathonSection', id?: string | null, title?: string | null, key?: string | null, value?: string | null, isVisible?: boolean | null, sortOrder?: number | null } | null, sponsor?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null, email?: string | null } | null }> | null } | null };


export const AppliedHackathonsDocument = gql`
    query appliedHackathons($page: Int, $limit: Int, $search: String) {
  appliedHackathons(page: $page, limit: $limit, search: $search) {
    count
    totalPages
    currentPage
    hasNextPage
    hasPreviousPage
    data {
      hackathon {
        id
        title
        coverImage
        status
        submissionAt
        deadlineAt
        prizePoolAmount
        token {
          id
          tokenName
          decimals
          tokenAddress
        }
      }
      firstSection {
        id
        title
        key
        value
        isVisible
        sortOrder
      }
      sponsor {
        id
        nickname
        profileImage
        email
      }
    }
  }
}
    `;

/**
 * __useAppliedHackathonsQuery__
 *
 * To run a query within a React component, call `useAppliedHackathonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppliedHackathonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppliedHackathonsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useAppliedHackathonsQuery(baseOptions?: Apollo.QueryHookOptions<AppliedHackathonsQuery, AppliedHackathonsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AppliedHackathonsQuery, AppliedHackathonsQueryVariables>(AppliedHackathonsDocument, options);
      }
export function useAppliedHackathonsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AppliedHackathonsQuery, AppliedHackathonsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AppliedHackathonsQuery, AppliedHackathonsQueryVariables>(AppliedHackathonsDocument, options);
        }
export function useAppliedHackathonsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AppliedHackathonsQuery, AppliedHackathonsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AppliedHackathonsQuery, AppliedHackathonsQueryVariables>(AppliedHackathonsDocument, options);
        }
export type AppliedHackathonsQueryHookResult = ReturnType<typeof useAppliedHackathonsQuery>;
export type AppliedHackathonsLazyQueryHookResult = ReturnType<typeof useAppliedHackathonsLazyQuery>;
export type AppliedHackathonsSuspenseQueryHookResult = ReturnType<typeof useAppliedHackathonsSuspenseQuery>;
export type AppliedHackathonsQueryResult = Apollo.QueryResult<AppliedHackathonsQuery, AppliedHackathonsQueryVariables>;