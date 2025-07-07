import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CommentsByCommentableQueryVariables = Types.Exact<{
  commentableId: Types.Scalars['ID']['input'];
  commentableType: Types.CommentableTypeEnum;
}>;


export type CommentsByCommentableQuery = { __typename?: 'Query', commentsByCommentable?: Array<{ __typename?: 'Comment', commentableId?: string | null, commentableType?: string | null, content?: string | null, createdAt?: any | null, id?: string | null, author?: { __typename?: 'User', about?: string | null, avatar?: any | null, email?: string | null, firstName?: string | null, id?: string | null, image?: string | null, lastName?: string | null, loginType?: string | null, organizationName?: string | null, role?: Types.UserRole | null, summary?: string | null, walletAddress?: string | null, links?: Array<{ __typename?: 'Link', title?: string | null, url?: string | null }> | null } | null, parent?: { __typename?: 'Comment', id?: string | null } | null, replies?: Array<{ __typename?: 'Comment', commentableId?: string | null, commentableType?: string | null, content?: string | null, createdAt?: any | null, id?: string | null, author?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null } | null, replies?: Array<{ __typename?: 'Comment', id?: string | null }> | null }> | null }> | null };


export const CommentsByCommentableDocument = gql`
    query CommentsByCommentable($commentableId: ID!, $commentableType: CommentableTypeEnum!) {
  commentsByCommentable(
    commentableId: $commentableId
    commentableType: $commentableType
  ) {
    author {
      about
      avatar
      email
      firstName
      id
      image
      lastName
      links {
        title
        url
      }
      loginType
      organizationName
      role
      summary
      walletAddress
    }
    commentableId
    commentableType
    content
    createdAt
    id
    parent {
      id
    }
    replies {
      author {
        id
        firstName
        lastName
      }
      commentableId
      commentableType
      content
      createdAt
      id
      replies {
        id
      }
    }
  }
}
    `;

/**
 * __useCommentsByCommentableQuery__
 *
 * To run a query within a React component, call `useCommentsByCommentableQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommentsByCommentableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentsByCommentableQuery({
 *   variables: {
 *      commentableId: // value for 'commentableId'
 *      commentableType: // value for 'commentableType'
 *   },
 * });
 */
export function useCommentsByCommentableQuery(baseOptions: Apollo.QueryHookOptions<CommentsByCommentableQuery, CommentsByCommentableQueryVariables> & ({ variables: CommentsByCommentableQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CommentsByCommentableQuery, CommentsByCommentableQueryVariables>(CommentsByCommentableDocument, options);
      }
export function useCommentsByCommentableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommentsByCommentableQuery, CommentsByCommentableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CommentsByCommentableQuery, CommentsByCommentableQueryVariables>(CommentsByCommentableDocument, options);
        }
export function useCommentsByCommentableSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CommentsByCommentableQuery, CommentsByCommentableQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CommentsByCommentableQuery, CommentsByCommentableQueryVariables>(CommentsByCommentableDocument, options);
        }
export type CommentsByCommentableQueryHookResult = ReturnType<typeof useCommentsByCommentableQuery>;
export type CommentsByCommentableLazyQueryHookResult = ReturnType<typeof useCommentsByCommentableLazyQuery>;
export type CommentsByCommentableSuspenseQueryHookResult = ReturnType<typeof useCommentsByCommentableSuspenseQuery>;
export type CommentsByCommentableQueryResult = Apollo.QueryResult<CommentsByCommentableQuery, CommentsByCommentableQueryVariables>;