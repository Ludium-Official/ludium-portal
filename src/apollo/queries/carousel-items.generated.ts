import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CarouselItemsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CarouselItemsQuery = { __typename?: 'Query', carouselItems?: Array<{ __typename?: 'EnrichedCarouselItem', displayOrder?: number | null, id?: string | null, isActive?: boolean | null, itemId?: string | null, itemType?: Types.CarouselItemType | null, data?: { __typename: 'Post', title?: string | null, image?: string | null, summary?: string | null, keywords?: Array<{ __typename?: 'Keyword', name?: string | null }> | null } | { __typename: 'Program', name?: string | null, summary?: string | null, keywords?: Array<{ __typename?: 'Keyword', name?: string | null }> | null } | null }> | null };


export const CarouselItemsDocument = gql`
    query CarouselItems {
  carouselItems {
    data {
      __typename
      ... on Post {
        title
        image
        keywords {
          name
        }
        summary
      }
      ... on Program {
        name
        keywords {
          name
        }
        summary
      }
    }
    displayOrder
    id
    isActive
    itemId
    itemType
  }
}
    `;

/**
 * __useCarouselItemsQuery__
 *
 * To run a query within a React component, call `useCarouselItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCarouselItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCarouselItemsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCarouselItemsQuery(baseOptions?: Apollo.QueryHookOptions<CarouselItemsQuery, CarouselItemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CarouselItemsQuery, CarouselItemsQueryVariables>(CarouselItemsDocument, options);
      }
export function useCarouselItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CarouselItemsQuery, CarouselItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CarouselItemsQuery, CarouselItemsQueryVariables>(CarouselItemsDocument, options);
        }
export function useCarouselItemsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CarouselItemsQuery, CarouselItemsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CarouselItemsQuery, CarouselItemsQueryVariables>(CarouselItemsDocument, options);
        }
export type CarouselItemsQueryHookResult = ReturnType<typeof useCarouselItemsQuery>;
export type CarouselItemsLazyQueryHookResult = ReturnType<typeof useCarouselItemsLazyQuery>;
export type CarouselItemsSuspenseQueryHookResult = ReturnType<typeof useCarouselItemsSuspenseQuery>;
export type CarouselItemsQueryResult = Apollo.QueryResult<CarouselItemsQuery, CarouselItemsQueryVariables>;