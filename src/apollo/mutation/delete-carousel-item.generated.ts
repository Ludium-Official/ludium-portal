import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DeleteCarouselItemMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteCarouselItemMutation = { __typename?: 'Mutation', deleteCarouselItem?: { __typename?: 'CarouselItem', displayOrder?: number | null, id?: string | null, isActive?: boolean | null, itemId?: string | null, itemType?: Types.CarouselItemType | null } | null };


export const DeleteCarouselItemDocument = gql`
    mutation DeleteCarouselItem($id: ID!) {
  deleteCarouselItem(id: $id) {
    displayOrder
    id
    isActive
    itemId
    itemType
  }
}
    `;
export type DeleteCarouselItemMutationFn = Apollo.MutationFunction<DeleteCarouselItemMutation, DeleteCarouselItemMutationVariables>;

/**
 * __useDeleteCarouselItemMutation__
 *
 * To run a mutation, you first call `useDeleteCarouselItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCarouselItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCarouselItemMutation, { data, loading, error }] = useDeleteCarouselItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCarouselItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCarouselItemMutation, DeleteCarouselItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCarouselItemMutation, DeleteCarouselItemMutationVariables>(DeleteCarouselItemDocument, options);
      }
export type DeleteCarouselItemMutationHookResult = ReturnType<typeof useDeleteCarouselItemMutation>;
export type DeleteCarouselItemMutationResult = Apollo.MutationResult<DeleteCarouselItemMutation>;
export type DeleteCarouselItemMutationOptions = Apollo.BaseMutationOptions<DeleteCarouselItemMutation, DeleteCarouselItemMutationVariables>;