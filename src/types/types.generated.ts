export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type Application = {
  __typename?: 'Application';
  applicant?: Maybe<User>;
  content?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  links?: Maybe<Array<Link>>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  milestones?: Maybe<Array<Milestone>>;
  name?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  status?: Maybe<ApplicationStatus>;
  summary?: Maybe<Scalars['String']['output']>;
};

export enum ApplicationStatus {
  Accepted = 'accepted',
  Completed = 'completed',
  Pending = 'pending',
  Rejected = 'rejected',
  Submitted = 'submitted'
}

export type CheckMilestoneInput = {
  id: Scalars['String']['input'];
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
  status: CheckMilestoneStatus;
};

export enum CheckMilestoneStatus {
  Completed = 'completed',
  Pending = 'pending'
}

export type Comment = {
  __typename?: 'Comment';
  author?: Maybe<User>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  parent?: Maybe<Comment>;
  post?: Maybe<Post>;
  replies?: Maybe<Array<Comment>>;
};

export type CreateApplicationInput = {
  content: Scalars['String']['input'];
  links?: InputMaybe<Array<LinkInput>>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  milestones: Array<CreateMilestoneInput>;
  name: Scalars['String']['input'];
  price: Scalars['String']['input'];
  programId: Scalars['String']['input'];
  summary?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCommentInput = {
  content: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
  postId: Scalars['ID']['input'];
};

export type CreateMilestoneInput = {
  currency?: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  links?: InputMaybe<Array<LinkInput>>;
  price: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreatePostInput = {
  content: Scalars['String']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  isBanner?: InputMaybe<Scalars['Boolean']['input']>;
  keywords?: InputMaybe<Array<Scalars['ID']['input']>>;
  summary: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateProgramInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  deadline: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  keywords?: InputMaybe<Array<Scalars['ID']['input']>>;
  links?: InputMaybe<Array<LinkInput>>;
  name: Scalars['String']['input'];
  network?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['String']['input'];
  summary?: InputMaybe<Scalars['String']['input']>;
  validatorId: Scalars['ID']['input'];
};

export type FilterInput = {
  field: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type Keyword = {
  __typename?: 'Keyword';
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Link = {
  __typename?: 'Link';
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type LinkInput = {
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type Milestone = {
  __typename?: 'Milestone';
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  links?: Maybe<Array<Link>>;
  price?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  status?: Maybe<MilestoneStatus>;
  title?: Maybe<Scalars['String']['output']>;
};

export enum MilestoneStatus {
  Completed = 'completed',
  Pending = 'pending',
  Rejected = 'rejected',
  Submitted = 'submitted'
}

export type Mutation = {
  __typename?: 'Mutation';
  acceptApplication?: Maybe<Application>;
  acceptProgram?: Maybe<Program>;
  checkMilestone?: Maybe<Milestone>;
  createApplication?: Maybe<Application>;
  createComment?: Maybe<Comment>;
  createPost?: Maybe<Post>;
  createProgram?: Maybe<Program>;
  createUser?: Maybe<User>;
  deleteProgram?: Maybe<Scalars['Boolean']['output']>;
  deleteUser?: Maybe<User>;
  login?: Maybe<Scalars['String']['output']>;
  markAllNotificationsAsRead?: Maybe<Scalars['Boolean']['output']>;
  markNotificationAsRead?: Maybe<Scalars['Boolean']['output']>;
  rejectApplication?: Maybe<Application>;
  rejectProgram?: Maybe<Program>;
  submitMilestone?: Maybe<Milestone>;
  submitProgram?: Maybe<Program>;
  updateApplication?: Maybe<Application>;
  updateComment?: Maybe<Comment>;
  updateMilestone?: Maybe<Milestone>;
  updatePost?: Maybe<Post>;
  updateProfile?: Maybe<User>;
  updateProgram?: Maybe<Program>;
  updateUser?: Maybe<User>;
};


export type MutationAcceptApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAcceptProgramArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCheckMilestoneArgs = {
  input: CheckMilestoneInput;
};


export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreateProgramArgs = {
  input: CreateProgramInput;
};


export type MutationCreateUserArgs = {
  input: UserInput;
};


export type MutationDeleteProgramArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  loginType: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRejectApplicationArgs = {
  id: Scalars['ID']['input'];
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRejectProgramArgs = {
  id: Scalars['ID']['input'];
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSubmitMilestoneArgs = {
  input: SubmitMilestoneInput;
};


export type MutationSubmitProgramArgs = {
  educhainProgramId: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
  txHash: Scalars['String']['input'];
};


export type MutationUpdateApplicationArgs = {
  input: UpdateApplicationInput;
};


export type MutationUpdateCommentArgs = {
  input: UpdateCommentInput;
};


export type MutationUpdateMilestoneArgs = {
  input: UpdateMilestoneInput;
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
};


export type MutationUpdateProfileArgs = {
  input: UserUpdateInput;
};


export type MutationUpdateProgramArgs = {
  input: UpdateProgramInput;
};


export type MutationUpdateUserArgs = {
  input: UserUpdateInput;
};

export type Notification = {
  __typename?: 'Notification';
  action?: Maybe<NotificationAction>;
  content?: Maybe<Scalars['String']['output']>;
  entityId?: Maybe<Scalars['ID']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  readAt?: Maybe<Scalars['Date']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<NotificationType>;
};

export enum NotificationAction {
  Accepted = 'accepted',
  Broadcast = 'broadcast',
  Completed = 'completed',
  Created = 'created',
  Rejected = 'rejected',
  Submitted = 'submitted'
}

export enum NotificationType {
  Application = 'application',
  Comment = 'comment',
  Milestone = 'milestone',
  Program = 'program',
  System = 'system'
}

export type PaginatedApplications = {
  __typename?: 'PaginatedApplications';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Application>>;
};

export type PaginatedComments = {
  __typename?: 'PaginatedComments';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Comment>>;
};

export type PaginatedMilestones = {
  __typename?: 'PaginatedMilestones';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Milestone>>;
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Post>>;
};

export type PaginatedPrograms = {
  __typename?: 'PaginatedPrograms';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Program>>;
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<User>>;
};

export type PaginationInput = {
  filter?: InputMaybe<Array<FilterInput>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortEnum>;
};

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  keywords?: Maybe<Array<Keyword>>;
  summary?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type Program = {
  __typename?: 'Program';
  applications?: Maybe<Array<Application>>;
  creator?: Maybe<User>;
  currency?: Maybe<Scalars['String']['output']>;
  deadline?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  educhainProgramId?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keywords?: Maybe<Array<Keyword>>;
  links?: Maybe<Array<Link>>;
  name?: Maybe<Scalars['String']['output']>;
  network?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  status?: Maybe<ProgramStatus>;
  summary?: Maybe<Scalars['String']['output']>;
  txHash?: Maybe<Scalars['String']['output']>;
  validator?: Maybe<User>;
};

export enum ProgramStatus {
  Cancelled = 'cancelled',
  Closed = 'closed',
  Completed = 'completed',
  Draft = 'draft',
  PaymentRequired = 'payment_required',
  Published = 'published'
}

export type Query = {
  __typename?: 'Query';
  application?: Maybe<Application>;
  applications?: Maybe<PaginatedApplications>;
  banner?: Maybe<Post>;
  comment?: Maybe<Comment>;
  comments?: Maybe<PaginatedComments>;
  commentsByPost?: Maybe<Array<Comment>>;
  countNotifications?: Maybe<Scalars['Int']['output']>;
  keywords?: Maybe<Array<Keyword>>;
  milestone?: Maybe<Milestone>;
  milestones?: Maybe<PaginatedMilestones>;
  notifications?: Maybe<Array<Notification>>;
  post?: Maybe<Post>;
  posts?: Maybe<PaginatedPosts>;
  profile?: Maybe<User>;
  program?: Maybe<Program>;
  programs?: Maybe<PaginatedPrograms>;
  user?: Maybe<User>;
  users?: Maybe<PaginatedUsers>;
};


export type QueryApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryApplicationsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryCommentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommentsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  topLevelOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryCommentsByPostArgs = {
  postId: Scalars['ID']['input'];
};


export type QueryMilestoneArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMilestonesArgs = {
  applicationId: Scalars['ID']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryProgramArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProgramsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export enum SortEnum {
  Asc = 'asc',
  Desc = 'desc'
}

export type SubmitMilestoneInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  links?: InputMaybe<Array<LinkInput>>;
};

export type Subscription = {
  __typename?: 'Subscription';
  countNotifications?: Maybe<Scalars['Int']['output']>;
  notifications?: Maybe<Array<Notification>>;
};

export type UpdateApplicationInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  links?: InputMaybe<Array<LinkInput>>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ApplicationStatus>;
  summary?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCommentInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type UpdateMilestoneInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  links?: InputMaybe<Array<LinkInput>>;
  price?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MilestoneStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePostInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  isBanner?: InputMaybe<Scalars['Boolean']['input']>;
  keywords?: InputMaybe<Array<Scalars['ID']['input']>>;
  summary?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProgramInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  deadline?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  keywords?: InputMaybe<Array<Scalars['ID']['input']>>;
  links?: InputMaybe<Array<LinkInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ProgramStatus>;
  summary?: InputMaybe<Scalars['String']['input']>;
  validatorId?: InputMaybe<Scalars['ID']['input']>;
};

export type User = {
  __typename?: 'User';
  about?: Maybe<Scalars['String']['output']>;
  avatar?: Maybe<Scalars['Upload']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  isAdmin?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  links?: Maybe<Array<Link>>;
  loginType?: Maybe<Scalars['String']['output']>;
  organizationName?: Maybe<Scalars['String']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  walletAddress?: Maybe<Scalars['String']['output']>;
};

export type UserInput = {
  about?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['Upload']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  links?: InputMaybe<Array<LinkInput>>;
  loginType?: InputMaybe<Scalars['String']['input']>;
  organizationName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  summary?: InputMaybe<Scalars['String']['input']>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
};

export type UserUpdateInput = {
  about?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  links?: InputMaybe<Array<LinkInput>>;
  loginType?: InputMaybe<Scalars['String']['input']>;
  organizationName?: InputMaybe<Scalars['String']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
};
