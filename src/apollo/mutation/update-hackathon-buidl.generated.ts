import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateHackathonBuidlMutationVariables = Types.Exact<{
  buidlId: Types.Scalars['ID']['input'];
  input: Types.UpdateHackathonBuidlInput;
}>;


export type UpdateHackathonBuidlMutation = { __typename?: 'Mutation', updateHackathonBuidl?: { __typename?: 'HackathonBuidl', id?: string | null, hackathonId?: string | null, title?: string | null, description?: string | null, buidlDescription?: string | null, coverImage?: string | null, githubLink?: string | null, websiteLink?: string | null, demoVideoLink?: string | null, socialLinks?: Array<string> | null, sponsorIds?: Array<string> | null, status?: Types.HackathonBuidlStatus | null, ownerUserId?: number | null, updatedAt?: any | null, owner?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null } | null, builders?: Array<{ __typename?: 'HackathonBuidlBuilder', id?: string | null, userId?: number | null, isAccepted?: boolean | null, user?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null } | null }> | null, sponsors?: Array<{ __typename?: 'HackathonSponsor', id?: string | null, name?: string | null, tracks?: Array<{ __typename?: 'HackathonSponsorTrack', id?: string | null, title?: string | null }> | null }> | null } | null };


export const UpdateHackathonBuidlDocument = gql`
    mutation updateHackathonBuidl($buidlId: ID!, $input: UpdateHackathonBuidlInput!) {
  updateHackathonBuidl(buidlId: $buidlId, input: $input) {
    id
    hackathonId
    title
    description
    buidlDescription
    coverImage
    githubLink
    websiteLink
    demoVideoLink
    socialLinks
    sponsorIds
    status
    ownerUserId
    updatedAt
    owner {
      id
      nickname
      profileImage
    }
    builders {
      id
      userId
      isAccepted
      user {
        id
        nickname
        profileImage
      }
    }
    sponsors {
      id
      name
      tracks {
        id
        title
      }
    }
  }
}
    `;
export type UpdateHackathonBuidlMutationFn = Apollo.MutationFunction<UpdateHackathonBuidlMutation, UpdateHackathonBuidlMutationVariables>;

/**
 * __useUpdateHackathonBuidlMutation__
 *
 * To run a mutation, you first call `useUpdateHackathonBuidlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateHackathonBuidlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateHackathonBuidlMutation, { data, loading, error }] = useUpdateHackathonBuidlMutation({
 *   variables: {
 *      buidlId: // value for 'buidlId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateHackathonBuidlMutation(baseOptions?: Apollo.MutationHookOptions<UpdateHackathonBuidlMutation, UpdateHackathonBuidlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateHackathonBuidlMutation, UpdateHackathonBuidlMutationVariables>(UpdateHackathonBuidlDocument, options);
      }
export type UpdateHackathonBuidlMutationHookResult = ReturnType<typeof useUpdateHackathonBuidlMutation>;
export type UpdateHackathonBuidlMutationResult = Apollo.MutationResult<UpdateHackathonBuidlMutation>;
export type UpdateHackathonBuidlMutationOptions = Apollo.BaseMutationOptions<UpdateHackathonBuidlMutation, UpdateHackathonBuidlMutationVariables>;