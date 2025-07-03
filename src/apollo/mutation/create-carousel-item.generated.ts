import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateCarouselItemMutationVariables = Types.Exact<{
  input: Types.CreateCarouselItemInput;
}>;


export type CreateCarouselItemMutation = { __typename?: 'Mutation', createCarouselItem?: { __typename?: 'CarouselItem', displayOrder?: number | null, id?: string | null, isActive?: boolean | null, itemId?: string | null, itemType?: Types.CarouselItemType | null } | null };


export const CreateCarouselItemDocument = gql`
    mutation CreateCarouselItem($input: CreateCarouselItemInput!) {
  createCarouselItem(input: $input) {
    displayOrder
    id
    isActive
    itemId
    itemType
  }
}
    `;
export type CreateCarouselItemMutationFn = Apollo.MutationFunction<CreateCarouselItemMutation, CreateCarouselItemMutationVariables>;

/**
 * __useCreateCarouselItemMutation__
 *
 * To run a mutation, you first call `useCreateCarouselItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCarouselItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCarouselItemMutation, { data, loading, error }] = useCreateCarouselItemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCarouselItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateCarouselItemMutation, CreateCarouselItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCarouselItemMutation, CreateCarouselItemMutationVariables>(CreateCarouselItemDocument, options);
      }
export type CreateCarouselItemMutationHookResult = ReturnType<typeof useCreateCarouselItemMutation>;
export type CreateCarouselItemMutationResult = Apollo.MutationResult<CreateCarouselItemMutation>;
export type CreateCarouselItemMutationOptions = Apollo.BaseMutationOptions<CreateCarouselItemMutation, CreateCarouselItemMutationVariables>;