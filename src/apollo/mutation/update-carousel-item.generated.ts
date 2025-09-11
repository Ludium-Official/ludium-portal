import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateCarouselItemMutationVariables = Types.Exact<{
  input: Types.UpdateCarouselItemInput;
}>;


export type UpdateCarouselItemMutation = { __typename?: 'Mutation', updateCarouselItem?: { __typename?: 'CarouselItem', displayOrder?: number | null, id?: string | null, isActive?: boolean | null, itemId?: string | null, itemType?: Types.CarouselItemType | null } | null };


export const UpdateCarouselItemDocument = gql`
    mutation updateCarouselItem($input: UpdateCarouselItemInput!) {
  updateCarouselItem(input: $input) {
    displayOrder
    id
    isActive
    itemId
    itemType
  }
}
    `;
export type UpdateCarouselItemMutationFn = Apollo.MutationFunction<UpdateCarouselItemMutation, UpdateCarouselItemMutationVariables>;

/**
 * __useUpdateCarouselItemMutation__
 *
 * To run a mutation, you first call `useUpdateCarouselItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCarouselItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCarouselItemMutation, { data, loading, error }] = useUpdateCarouselItemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCarouselItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCarouselItemMutation, UpdateCarouselItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCarouselItemMutation, UpdateCarouselItemMutationVariables>(UpdateCarouselItemDocument, options);
      }
export type UpdateCarouselItemMutationHookResult = ReturnType<typeof useUpdateCarouselItemMutation>;
export type UpdateCarouselItemMutationResult = Apollo.MutationResult<UpdateCarouselItemMutation>;
export type UpdateCarouselItemMutationOptions = Apollo.BaseMutationOptions<UpdateCarouselItemMutation, UpdateCarouselItemMutationVariables>;