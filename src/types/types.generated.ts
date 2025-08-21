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
  comments?: Maybe<Array<Comment>>;
  content?: Maybe<Scalars['String']['output']>;
  currentFundingAmount?: Maybe<Scalars['String']['output']>;
  fundingProgress?: Maybe<Scalars['Float']['output']>;
  fundingSuccessful?: Maybe<Scalars['Boolean']['output']>;
  fundingTarget?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  investmentCount?: Maybe<Scalars['Int']['output']>;
  investmentTerms?: Maybe<Array<InvestmentTerm>>;
  investors?: Maybe<Array<Investor>>;
  links?: Maybe<Array<Link>>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  milestones?: Maybe<Array<Milestone>>;
  name?: Maybe<Scalars['String']['output']>;
  onChainProjectId?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  status?: Maybe<ApplicationStatus>;
  summary?: Maybe<Scalars['String']['output']>;
  walletAddress?: Maybe<Scalars['String']['output']>;
};

export enum ApplicationStatus {
  Accepted = 'accepted',
  Completed = 'completed',
  Pending = 'pending',
  Rejected = 'rejected',
  Submitted = 'submitted'
}

export type CarouselItem = {
  __typename?: 'CarouselItem';
  displayOrder?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  itemId?: Maybe<Scalars['String']['output']>;
  itemType?: Maybe<CarouselItemType>;
};

export type CarouselItemData = Post | Program;

export enum CarouselItemType {
  Post = 'post',
  Program = 'program'
}

export type CheckMilestoneInput = {
  id: Scalars['String']['input'];
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
  status: CheckMilestoneStatus;
};

export enum CheckMilestoneStatus {
  Completed = 'completed',
  Rejected = 'rejected'
}

export type Comment = {
  __typename?: 'Comment';
  author?: Maybe<User>;
  commentableId?: Maybe<Scalars['String']['output']>;
  commentableType?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  parent?: Maybe<Comment>;
  replies?: Maybe<Array<Comment>>;
};

export enum CommentableTypeEnum {
  Application = 'application',
  Milestone = 'milestone',
  Post = 'post',
  Program = 'program'
}

export type CreateApplicationInput = {
  content: Scalars['String']['input'];
  fundingTarget?: InputMaybe<Scalars['String']['input']>;
  investmentTerms?: InputMaybe<Array<CreateInvestmentTermInput>>;
  links?: InputMaybe<Array<LinkInput>>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  milestones: Array<CreateMilestoneInput>;
  name: Scalars['String']['input'];
  price: Scalars['String']['input'];
  programId: Scalars['String']['input'];
  status: ApplicationStatus;
  summary: Scalars['String']['input'];
  walletAddress?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCarouselItemInput = {
  isActive: Scalars['Boolean']['input'];
  itemId: Scalars['String']['input'];
  itemType: CarouselItemType;
};

export type CreateCommentInput = {
  commentableId: Scalars['ID']['input'];
  commentableType: CommentableTypeEnum;
  content: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateInvestmentInput = {
  amount: Scalars['String']['input'];
  projectId: Scalars['ID']['input'];
  txHash?: InputMaybe<Scalars['String']['input']>;
};

export type CreateInvestmentTermInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['String']['input'];
  purchaseLimit?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
};

export type CreateMilestoneInput = {
  currency?: Scalars['String']['input'];
  deadline: Scalars['DateTime']['input'];
  description: Scalars['String']['input'];
  links?: InputMaybe<Array<LinkInput>>;
  percentage: Scalars['String']['input'];
  summary: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreatePostInput = {
  content: Scalars['String']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  keywords?: InputMaybe<Array<Scalars['ID']['input']>>;
  summary: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateProgramInput = {
  applicationEndDate?: InputMaybe<Scalars['DateTime']['input']>;
  applicationStartDate?: InputMaybe<Scalars['DateTime']['input']>;
  contractAddress?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  customFeePercentage?: InputMaybe<Scalars['Int']['input']>;
  deadline: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  feePercentage?: InputMaybe<Scalars['Int']['input']>;
  fundingCondition?: InputMaybe<FundingCondition>;
  fundingEndDate?: InputMaybe<Scalars['DateTime']['input']>;
  fundingStartDate?: InputMaybe<Scalars['DateTime']['input']>;
  image: Scalars['Upload']['input'];
  keywords: Array<Scalars['String']['input']>;
  links?: InputMaybe<Array<LinkInput>>;
  name: Scalars['String']['input'];
  network: Scalars['String']['input'];
  price: Scalars['String']['input'];
  status?: InputMaybe<ProgramStatus>;
  summary?: InputMaybe<Scalars['String']['input']>;
  tierSettings?: InputMaybe<Scalars['JSON']['input']>;
  type?: InputMaybe<ProgramType>;
  visibility?: InputMaybe<ProgramVisibility>;
};

export type EnrichedCarouselItem = {
  __typename?: 'EnrichedCarouselItem';
  data?: Maybe<CarouselItemData>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  itemId?: Maybe<Scalars['String']['output']>;
  itemType?: Maybe<CarouselItemType>;
};

export type FilterInput = {
  field: Scalars['String']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum FundingCondition {
  Open = 'open',
  Tier = 'tier'
}

export type Investment = {
  __typename?: 'Investment';
  amount?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  project?: Maybe<Application>;
  reclaimTxHash?: Maybe<Scalars['String']['output']>;
  reclaimed?: Maybe<Scalars['Boolean']['output']>;
  reclaimedAt?: Maybe<Scalars['Date']['output']>;
  status?: Maybe<InvestmentStatus>;
  supporter?: Maybe<User>;
  tier?: Maybe<Scalars['String']['output']>;
  txHash?: Maybe<Scalars['String']['output']>;
};

export enum InvestmentStatus {
  Confirmed = 'confirmed',
  Failed = 'failed',
  Pending = 'pending',
  Refunded = 'refunded'
}

export type InvestmentTerm = {
  __typename?: 'InvestmentTerm';
  applicationId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  purchaseLimit?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum InvestmentTier {
  Bronze = 'bronze',
  Gold = 'gold',
  Platinum = 'platinum',
  Silver = 'silver'
}

export type Investor = {
  __typename?: 'Investor';
  amount?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  investmentStatus?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  maxInvestmentAmount?: Maybe<Scalars['String']['output']>;
  tier?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
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
  comments?: Maybe<Array<Comment>>;
  currency?: Maybe<Scalars['String']['output']>;
  deadline?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  file?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  links?: Maybe<Array<Link>>;
  percentage?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  status?: Maybe<MilestoneStatus>;
  summary?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type MilestonePayout = {
  __typename?: 'MilestonePayout';
  amount?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  investment?: Maybe<Investment>;
  milestone?: Maybe<Milestone>;
  percentage?: Maybe<Scalars['String']['output']>;
  processedAt?: Maybe<Scalars['Date']['output']>;
  status?: Maybe<PayoutStatus>;
  txHash?: Maybe<Scalars['String']['output']>;
};

export enum MilestoneStatus {
  Completed = 'completed',
  Draft = 'draft',
  Pending = 'pending',
  Rejected = 'rejected',
  Submitted = 'submitted'
}

export type Mutation = {
  __typename?: 'Mutation';
  acceptApplication?: Maybe<Application>;
  acceptProgram?: Maybe<Program>;
  addProgramKeyword?: Maybe<Keyword>;
  addUserKeyword?: Maybe<Keyword>;
  assignValidatorToProgram?: Maybe<Program>;
  checkMilestone?: Maybe<Milestone>;
  createApplication?: Maybe<Application>;
  createCarouselItem?: Maybe<CarouselItem>;
  createComment?: Maybe<Comment>;
  createInvestment?: Maybe<Investment>;
  createInvestmentTerm?: Maybe<InvestmentTerm>;
  createPost?: Maybe<Post>;
  createProgram?: Maybe<Program>;
  createUser?: Maybe<User>;
  deleteCarouselItem?: Maybe<CarouselItem>;
  deleteInvestmentTerm?: Maybe<Scalars['Boolean']['output']>;
  deleteProgram?: Maybe<Scalars['Boolean']['output']>;
  deleteUser?: Maybe<User>;
  incrementPostView?: Maybe<Scalars['Int']['output']>;
  inviteUserToProgram?: Maybe<Program>;
  login?: Maybe<Scalars['String']['output']>;
  markAllNotificationsAsRead?: Maybe<Scalars['Boolean']['output']>;
  markNotificationAsRead?: Maybe<Scalars['Boolean']['output']>;
  processMilestonePayouts?: Maybe<Array<MilestonePayout>>;
  reclaimInvestment?: Maybe<Investment>;
  rejectApplication?: Maybe<Application>;
  rejectProgram?: Maybe<Program>;
  removeProgramKeyword?: Maybe<Scalars['Boolean']['output']>;
  removeUserKeyword?: Maybe<Scalars['Boolean']['output']>;
  removeValidatorFromProgram?: Maybe<Program>;
  reorderCarouselItems?: Maybe<Array<CarouselItem>>;
  submitMilestone?: Maybe<Milestone>;
  submitProgram?: Maybe<Program>;
  updateApplication?: Maybe<Application>;
  updateCarouselItem?: Maybe<CarouselItem>;
  updateComment?: Maybe<Comment>;
  updateInvestmentTerm?: Maybe<InvestmentTerm>;
  updateMilestone?: Maybe<Milestone>;
  updatePost?: Maybe<Post>;
  updateProfile?: Maybe<User>;
  updateProgram?: Maybe<Program>;
  updateUser?: Maybe<User>;
};


export type MutationAcceptApplicationArgs = {
  id: Scalars['ID']['input'];
  onChainProjectId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationAcceptProgramArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAddProgramKeywordArgs = {
  keyword: Scalars['String']['input'];
  programId: Scalars['ID']['input'];
};


export type MutationAddUserKeywordArgs = {
  keyword: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationAssignValidatorToProgramArgs = {
  programId: Scalars['ID']['input'];
  validatorId: Scalars['ID']['input'];
};


export type MutationCheckMilestoneArgs = {
  input: CheckMilestoneInput;
};


export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput;
};


export type MutationCreateCarouselItemArgs = {
  input: CreateCarouselItemInput;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateInvestmentArgs = {
  input: CreateInvestmentInput;
};


export type MutationCreateInvestmentTermArgs = {
  applicationId: Scalars['ID']['input'];
  input: CreateInvestmentTermInput;
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


export type MutationDeleteCarouselItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInvestmentTermArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProgramArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationIncrementPostViewArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationInviteUserToProgramArgs = {
  maxInvestmentAmount?: InputMaybe<Scalars['String']['input']>;
  programId: Scalars['ID']['input'];
  tier?: InputMaybe<InvestmentTier>;
  userId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  loginType: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationProcessMilestonePayoutsArgs = {
  input: ProcessPayoutsInput;
};


export type MutationReclaimInvestmentArgs = {
  input: ReclaimInvestmentInput;
};


export type MutationRejectApplicationArgs = {
  id: Scalars['ID']['input'];
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRejectProgramArgs = {
  id: Scalars['ID']['input'];
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRemoveProgramKeywordArgs = {
  keyword: Scalars['String']['input'];
  programId: Scalars['ID']['input'];
};


export type MutationRemoveUserKeywordArgs = {
  keyword: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRemoveValidatorFromProgramArgs = {
  programId: Scalars['ID']['input'];
  validatorId: Scalars['ID']['input'];
};


export type MutationReorderCarouselItemsArgs = {
  items: Array<ReorderCarouselItemInput>;
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


export type MutationUpdateCarouselItemArgs = {
  input: UpdateCarouselItemInput;
};


export type MutationUpdateCommentArgs = {
  input: UpdateCommentInput;
};


export type MutationUpdateInvestmentTermArgs = {
  input: UpdateInvestmentTermInput;
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
  Invited = 'invited',
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

export type PaginatedInvestments = {
  __typename?: 'PaginatedInvestments';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Investment>>;
};

export type PaginatedMilestonePayouts = {
  __typename?: 'PaginatedMilestonePayouts';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<MilestonePayout>>;
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

export enum PayoutStatus {
  Completed = 'completed',
  Failed = 'failed',
  Pending = 'pending',
  Processing = 'processing'
}

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  comments?: Maybe<Array<Comment>>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  keywords?: Maybe<Array<Keyword>>;
  summary?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  viewCount?: Maybe<Scalars['Int']['output']>;
};

export type ProcessPayoutsInput = {
  contractAddress: Scalars['String']['input'];
  milestoneId: Scalars['ID']['input'];
};

export type Program = {
  __typename?: 'Program';
  applicationEndDate?: Maybe<Scalars['DateTime']['output']>;
  applicationStartDate?: Maybe<Scalars['DateTime']['output']>;
  applications?: Maybe<Array<Application>>;
  comments?: Maybe<Array<Comment>>;
  contractAddress?: Maybe<Scalars['String']['output']>;
  creator?: Maybe<User>;
  currency?: Maybe<Scalars['String']['output']>;
  customFeePercentage?: Maybe<Scalars['Int']['output']>;
  deadline?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  educhainProgramId?: Maybe<Scalars['Int']['output']>;
  feePercentage?: Maybe<Scalars['Int']['output']>;
  fundingCondition?: Maybe<FundingCondition>;
  fundingEndDate?: Maybe<Scalars['DateTime']['output']>;
  fundingStartDate?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  invitedBuilders?: Maybe<Array<User>>;
  keywords?: Maybe<Array<Keyword>>;
  links?: Maybe<Array<Link>>;
  name?: Maybe<Scalars['String']['output']>;
  network?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  status?: Maybe<ProgramStatus>;
  summary?: Maybe<Scalars['String']['output']>;
  supporters?: Maybe<Array<Supporter>>;
  tierSettings?: Maybe<Scalars['JSON']['output']>;
  txHash?: Maybe<Scalars['String']['output']>;
  type?: Maybe<ProgramType>;
  userTierAssignment?: Maybe<UserTierAssignment>;
  validators?: Maybe<Array<User>>;
  visibility?: Maybe<ProgramVisibility>;
};

export type ProgramStatsByStatus = {
  __typename?: 'ProgramStatsByStatus';
  completed?: Maybe<Scalars['Int']['output']>;
  confirmed?: Maybe<Scalars['Int']['output']>;
  notConfirmed?: Maybe<Scalars['Int']['output']>;
  paymentRequired?: Maybe<Scalars['Int']['output']>;
  published?: Maybe<Scalars['Int']['output']>;
  refund?: Maybe<Scalars['Int']['output']>;
};

export enum ProgramStatus {
  Cancelled = 'cancelled',
  Closed = 'closed',
  Completed = 'completed',
  PaymentRequired = 'payment_required',
  Pending = 'pending',
  Published = 'published',
  Rejected = 'rejected'
}

export enum ProgramType {
  Funding = 'funding',
  Regular = 'regular'
}

export enum ProgramVisibility {
  Private = 'private',
  Public = 'public',
  Restricted = 'restricted'
}

export type Query = {
  __typename?: 'Query';
  application?: Maybe<Application>;
  applications?: Maybe<PaginatedApplications>;
  carouselItems?: Maybe<Array<EnrichedCarouselItem>>;
  comment?: Maybe<Comment>;
  comments?: Maybe<PaginatedComments>;
  commentsByCommentable?: Maybe<Array<Comment>>;
  countNotifications?: Maybe<Scalars['Int']['output']>;
  investment?: Maybe<Investment>;
  investmentTerm?: Maybe<InvestmentTerm>;
  investmentTermsByApplicationId?: Maybe<Array<InvestmentTerm>>;
  investments?: Maybe<PaginatedInvestments>;
  keywords?: Maybe<Array<Keyword>>;
  milestone?: Maybe<Milestone>;
  milestonePayout?: Maybe<MilestonePayout>;
  milestonePayouts?: Maybe<PaginatedMilestonePayouts>;
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


export type QueryCommentsByCommentableArgs = {
  commentableId: Scalars['ID']['input'];
  commentableType: CommentableTypeEnum;
};


export type QueryInvestmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInvestmentTermArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInvestmentTermsByApplicationIdArgs = {
  applicationId: Scalars['ID']['input'];
};


export type QueryInvestmentsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  supporterId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryMilestoneArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMilestonePayoutArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMilestonePayoutsArgs = {
  investmentId?: InputMaybe<Scalars['ID']['input']>;
  milestoneId?: InputMaybe<Scalars['ID']['input']>;
  pagination?: InputMaybe<PaginationInput>;
  status?: InputMaybe<PayoutStatus>;
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

export type ReclaimInvestmentInput = {
  investmentId: Scalars['ID']['input'];
  txHash: Scalars['String']['input'];
};

export type ReorderCarouselItemInput = {
  displayOrder: Scalars['Int']['input'];
  id: Scalars['String']['input'];
};

export enum SortEnum {
  Asc = 'asc',
  Desc = 'desc'
}

export type SubmitMilestoneInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  file?: InputMaybe<Scalars['Upload']['input']>;
  id: Scalars['String']['input'];
  links?: InputMaybe<Array<LinkInput>>;
  status: SubmitMilestoneStatus;
};

export enum SubmitMilestoneStatus {
  Draft = 'draft',
  Submitted = 'submitted'
}

export type Subscription = {
  __typename?: 'Subscription';
  countNotifications?: Maybe<Scalars['Int']['output']>;
  notifications?: Maybe<Array<Notification>>;
};

export type Supporter = {
  __typename?: 'Supporter';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  maxInvestmentAmount?: Maybe<Scalars['String']['output']>;
  tier?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
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

export type UpdateCarouselItemInput = {
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  itemId?: InputMaybe<Scalars['String']['input']>;
  itemType?: InputMaybe<CarouselItemType>;
};

export type UpdateCommentInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type UpdateInvestmentTermInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  price?: InputMaybe<Scalars['String']['input']>;
  purchaseLimit?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMilestoneInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  deadline?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  links?: InputMaybe<Array<LinkInput>>;
  percentage?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MilestoneStatus>;
  summary?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePostInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  keywords?: InputMaybe<Array<Scalars['ID']['input']>>;
  summary?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProgramInput = {
  applicationEndDate?: InputMaybe<Scalars['DateTime']['input']>;
  applicationStartDate?: InputMaybe<Scalars['DateTime']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  customFeePercentage?: InputMaybe<Scalars['Int']['input']>;
  deadline?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  feePercentage?: InputMaybe<Scalars['Int']['input']>;
  fundingCondition?: InputMaybe<FundingCondition>;
  fundingEndDate?: InputMaybe<Scalars['DateTime']['input']>;
  fundingStartDate?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  keywords?: InputMaybe<Array<Scalars['String']['input']>>;
  links?: InputMaybe<Array<LinkInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ProgramStatus>;
  summary?: InputMaybe<Scalars['String']['input']>;
  tierSettings?: InputMaybe<Scalars['JSON']['input']>;
  type?: InputMaybe<ProgramType>;
  visibility?: InputMaybe<ProgramVisibility>;
};

export type User = {
  __typename?: 'User';
  about?: Maybe<Scalars['String']['output']>;
  avatar?: Maybe<Scalars['Upload']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  keywords?: Maybe<Array<Keyword>>;
  lastName?: Maybe<Scalars['String']['output']>;
  links?: Maybe<Array<Link>>;
  loginType?: Maybe<Scalars['String']['output']>;
  organizationName?: Maybe<Scalars['String']['output']>;
  programStatistics?: Maybe<UserProgramStatistics>;
  role?: Maybe<UserRole>;
  summary?: Maybe<Scalars['String']['output']>;
  walletAddress?: Maybe<Scalars['String']['output']>;
};

export type UserInput = {
  about?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['Upload']['input']>;
  keywords?: InputMaybe<Array<Scalars['String']['input']>>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  links?: InputMaybe<Array<LinkInput>>;
  loginType?: InputMaybe<Scalars['String']['input']>;
  organizationName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  summary?: InputMaybe<Scalars['String']['input']>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
};

export type UserProgramStatistics = {
  __typename?: 'UserProgramStatistics';
  asBuilder?: Maybe<ProgramStatsByStatus>;
  asSponsor?: Maybe<ProgramStatsByStatus>;
  asValidator?: Maybe<ProgramStatsByStatus>;
};

export enum UserRole {
  Admin = 'admin',
  Superadmin = 'superadmin',
  User = 'user'
}

export type UserTierAssignment = {
  __typename?: 'UserTierAssignment';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  currentInvestment?: Maybe<Scalars['String']['output']>;
  maxInvestmentAmount?: Maybe<Scalars['String']['output']>;
  remainingCapacity?: Maybe<Scalars['String']['output']>;
  tier?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type UserUpdateInput = {
  about?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  keywords?: InputMaybe<Array<Scalars['String']['input']>>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  links?: InputMaybe<Array<LinkInput>>;
  loginType?: InputMaybe<Scalars['String']['input']>;
  organizationName?: InputMaybe<Scalars['String']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
};
