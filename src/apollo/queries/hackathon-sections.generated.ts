import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type HackathonSectionsQueryVariables = Types.Exact<{
  hackathonId: Types.Scalars['ID']['input'];
}>;


export type HackathonSectionsQuery = { __typename?: 'Query', hackathonSections?: Array<{ __typename?: 'HackathonSection', id?: string | null, hackathonId?: string | null, title?: string | null, key?: string | null, value?: string | null, isVisible?: boolean | null, sortOrder?: number | null, createdAt?: any | null, updatedAt?: any | null }> | null };


export const HackathonSectionsDocument = gql`
    query hackathonSections($hackathonId: ID!) {
  hackathonSections(hackathonId: $hackathonId) {
    id
    hackathonId
    title
    key
    value
    isVisible
    sortOrder
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useHackathonSectionsQuery__
 *
 * To run a query within a React component, call `useHackathonSectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHackathonSectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHackathonSectionsQuery({
 *   variables: {
 *      hackathonId: // value for 'hackathonId'
 *   },
 * });
 */
export function useHackathonSectionsQuery(baseOptions: Apollo.QueryHookOptions<HackathonSectionsQuery, HackathonSectionsQueryVariables> & ({ variables: HackathonSectionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HackathonSectionsQuery, HackathonSectionsQueryVariables>(HackathonSectionsDocument, options);
      }
export function useHackathonSectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HackathonSectionsQuery, HackathonSectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HackathonSectionsQuery, HackathonSectionsQueryVariables>(HackathonSectionsDocument, options);
        }
export function useHackathonSectionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HackathonSectionsQuery, HackathonSectionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HackathonSectionsQuery, HackathonSectionsQueryVariables>(HackathonSectionsDocument, options);
        }
export type HackathonSectionsQueryHookResult = ReturnType<typeof useHackathonSectionsQuery>;
export type HackathonSectionsLazyQueryHookResult = ReturnType<typeof useHackathonSectionsLazyQuery>;
export type HackathonSectionsSuspenseQueryHookResult = ReturnType<typeof useHackathonSectionsSuspenseQuery>;
export type HackathonSectionsQueryResult = Apollo.QueryResult<HackathonSectionsQuery, HackathonSectionsQueryVariables>;