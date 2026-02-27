import * as Types from '../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateHackathonBuidlMutationVariables = Types.Exact<{
  input: Types.CreateHackathonBuidlInput;
}>;


export type CreateHackathonBuidlMutation = { __typename?: 'Mutation', createHackathonBuidl?: { __typename?: 'HackathonBuidl', id?: string | null, hackathonId?: string | null, title?: string | null, description?: string | null, buidlDescription?: string | null, coverImage?: string | null, githubLink?: string | null, websiteLink?: string | null, demoVideoLink?: string | null, socialLinks?: Array<string> | null, sponsorIds?: Array<string> | null, status?: Types.HackathonBuidlStatus | null, ownerUserId?: number | null, createdAt?: any | null, owner?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null } | null, builders?: Array<{ __typename?: 'HackathonBuidlBuilder', id?: string | null, userId?: number | null, isAccepted?: boolean | null, user?: { __typename?: 'UserV2', id?: string | null, nickname?: string | null, profileImage?: string | null } | null }> | null, sponsors?: Array<{ __typename?: 'HackathonSponsor', id?: string | null, name?: string | null, tracks?: Array<{ __typename?: 'HackathonSponsorTrack', id?: string | null, title?: string | null }> | null }> | null } | null };


export const CreateHackathonBuidlDocument = gql`
    mutation createHackathonBuidl($input: CreateHackathonBuidlInput!) {
  createHackathonBuidl(input: $input) {
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
    createdAt
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
export type CreateHackathonBuidlMutationFn = Apollo.MutationFunction<CreateHackathonBuidlMutation, CreateHackathonBuidlMutationVariables>;

/**
 * __useCreateHackathonBuidlMutation__
 *
 * To run a mutation, you first call `useCreateHackathonBuidlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateHackathonBuidlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createHackathonBuidlMutation, { data, loading, error }] = useCreateHackathonBuidlMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateHackathonBuidlMutation(baseOptions?: Apollo.MutationHookOptions<CreateHackathonBuidlMutation, CreateHackathonBuidlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateHackathonBuidlMutation, CreateHackathonBuidlMutationVariables>(CreateHackathonBuidlDocument, options);
      }
export type CreateHackathonBuidlMutationHookResult = ReturnType<typeof useCreateHackathonBuidlMutation>;
export type CreateHackathonBuidlMutationResult = Apollo.MutationResult<CreateHackathonBuidlMutation>;
export type CreateHackathonBuidlMutationOptions = Apollo.BaseMutationOptions<CreateHackathonBuidlMutation, CreateHackathonBuidlMutationVariables>;