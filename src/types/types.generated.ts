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
  program?: Maybe<Program>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  status?: Maybe<ApplicationStatus>;
  summary?: Maybe<Scalars['String']['output']>;
  walletAddress?: Maybe<Scalars['String']['output']>;
};

export type ApplicationMilestoneStatus = {
  __typename?: 'ApplicationMilestoneStatus';
  /** Whether all milestones for the application are completed */
  allCompleted?: Maybe<Scalars['Boolean']['output']>;
  /** Number of completed milestones */
  completedCount?: Maybe<Scalars['Int']['output']>;
  /** Total number of milestones for the application */
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export enum ApplicationStatus {
  Accepted = 'accepted',
  Completed = 'completed',
  Pending = 'pending',
  Rejected = 'rejected',
  Submitted = 'submitted'
}

/** Lifecycle status for V2 applications: submitted → pending_signature → in_progress → completed */
export enum ApplicationStatusV2 {
  Completed = 'completed',
  InProgress = 'in_progress',
  PendingSignature = 'pending_signature',
  Submitted = 'submitted'
}

export type ApplicationV2 = {
  __typename?: 'ApplicationV2';
  /** User who submitted this application */
  applicant?: Maybe<UserV2>;
  /** ID of the user who submitted this application */
  applicantId?: Maybe<Scalars['ID']['output']>;
  /** Chatroom message ID for this application (set by program sponsor) */
  chatroomMessageId?: Maybe<Scalars['String']['output']>;
  /** Content of the application submitted by the applicant */
  content?: Maybe<Scalars['String']['output']>;
  /** Application creation timestamp */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Application unique identifier */
  id?: Maybe<Scalars['ID']['output']>;
  /** Whether this application has been picked */
  picked?: Maybe<Scalars['Boolean']['output']>;
  /** Program this application is for */
  program?: Maybe<ProgramV2>;
  /** ID of the program this application is for */
  programId?: Maybe<Scalars['ID']['output']>;
  /** Legacy rejection note or optional review comment (populated when sponsors leave a note) */
  rejectedReason?: Maybe<Scalars['String']['output']>;
  /** Application lifecycle status (submitted, pending_signature, in_progress, completed) */
  status?: Maybe<ApplicationStatusV2>;
  /** Title of the application */
  title?: Maybe<Scalars['String']['output']>;
  /** Application last update timestamp */
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ApplicationsByProgramV2QueryInput = {
  /** Number of items per page */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Page number (1-based) */
  page?: InputMaybe<Scalars['Int']['input']>;
  /** Program ID to get applications for */
  programId: Scalars['ID']['input'];
};

export type ApplicationsV2QueryInput = {
  /** Filter by applicant ID */
  applicantId?: InputMaybe<Scalars['ID']['input']>;
  /** Number of items per page */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Page number (1-based) */
  page?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by program ID */
  programId?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by application status */
  status?: InputMaybe<ApplicationStatusV2>;
};

export type Article = {
  __typename?: 'Article';
  author?: Maybe<UserV2>;
  /** Number of comments */
  commentCount?: Maybe<Scalars['Int']['output']>;
  /** Cover image URL or path */
  coverImage?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Article description in markdown format */
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  /** Whether the currently authenticated user has liked this article */
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  /** Whether this article is pinned */
  isPin?: Maybe<Scalars['Boolean']['output']>;
  /** Number of likes */
  likeCount?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<ArticleStatus>;
  title?: Maybe<Scalars['String']['output']>;
  /** Article category (article, newsletter, campaign) */
  type?: Maybe<ArticleType>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Number of views */
  view?: Maybe<Scalars['Int']['output']>;
};

export type ArticleComment = {
  __typename?: 'ArticleComment';
  articleId?: Maybe<Scalars['ID']['output']>;
  authorId?: Maybe<Scalars['Int']['output']>;
  /** Author nickname */
  authorNickname?: Maybe<Scalars['String']['output']>;
  /** Author profile image URL */
  authorProfileImage?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  dislikeCount?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isDisliked?: Maybe<Scalars['Boolean']['output']>;
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  likeCount?: Maybe<Scalars['Int']['output']>;
  parentId?: Maybe<Scalars['ID']['output']>;
  replies?: Maybe<Array<ArticleComment>>;
  /** Number of child comments */
  replyCount?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum ArticleCommentReaction {
  Dislike = 'dislike',
  Like = 'like'
}

/** Filter type for articles: LATEST (latest articles), TRENDING (trending articles in last week), NEWSLETTER (newsletter type), CAMPAIGN (campaign type) */
export enum ArticleFilter {
  Campaign = 'CAMPAIGN',
  Latest = 'LATEST',
  Newsletter = 'NEWSLETTER',
  Trending = 'TRENDING'
}

export enum ArticleStatus {
  Draft = 'draft',
  Published = 'published'
}

export enum ArticleType {
  Article = 'article',
  Campaign = 'campaign',
  Newsletter = 'newsletter'
}

export type ArticlesQueryInput = {
  /** Filter by author ID */
  authorId?: InputMaybe<Scalars['ID']['input']>;
  /** Filter type: LATEST, TRENDING, NEWSLETTER, or CAMPAIGN */
  filter?: InputMaybe<ArticleFilter>;
  /** Pagination options */
  pagination?: InputMaybe<PaginationInput>;
  /** Search by title */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter by status */
  status?: InputMaybe<ArticleStatus>;
  /** Filter by type (category) */
  type?: InputMaybe<ArticleType>;
};

export type AssignUserTierInput = {
  maxInvestmentAmount: Scalars['String']['input'];
  programId: Scalars['ID']['input'];
  tier: InvestmentTier;
  userId: Scalars['ID']['input'];
};

export type BuilderInfo = {
  __typename?: 'BuilderInfo';
  nickname?: Maybe<Scalars['String']['output']>;
  profileImage?: Maybe<Scalars['String']['output']>;
};

export type BuilderJobActivity = {
  __typename?: 'BuilderJobActivity';
  /** Number of programs the builder has applied to (excluding deleted status) */
  appliedPrograms?: Maybe<Scalars['Int']['output']>;
  /** Number of programs with ongoing milestones (applications with in_progress or pending_signature status) */
  ongoingPrograms?: Maybe<Scalars['Int']['output']>;
};

export type BuilderJobActivityCards = {
  __typename?: 'BuilderJobActivityCards';
  /** Total number of programs builder has applied to (excluding deleted) */
  applied?: Maybe<Scalars['Int']['output']>;
  /** Number of programs with status completed */
  completed?: Maybe<Scalars['Int']['output']>;
  /** Number of programs with ongoing milestones (applications with in_progress or pending_signature) */
  ongoing?: Maybe<Scalars['Int']['output']>;
};

export type BuilderMilestoneV2 = {
  __typename?: 'BuilderMilestoneV2';
  /** Milestone deadline */
  deadline?: Maybe<Scalars['DateTime']['output']>;
  /** Milestone unique identifier */
  id?: Maybe<Scalars['ID']['output']>;
  /** Current paid amount (if status is completed and payout_tx exists) */
  paidAmount?: Maybe<Scalars['String']['output']>;
  /** Milestone status */
  status?: Maybe<Scalars['String']['output']>;
  /** Milestone title */
  title?: Maybe<Scalars['String']['output']>;
  /** Token ID for the milestone */
  tokenId?: Maybe<Scalars['Int']['output']>;
  /** Unpaid amount (amount not yet paid) */
  unpaidAmount?: Maybe<Scalars['String']['output']>;
};

export type BuilderMilestonesInput = {
  /** Pagination options for milestones */
  pagination?: InputMaybe<PaginationInput>;
  /** Program ID */
  programId: Scalars['ID']['input'];
};

export type BulkAssignTiersInput = {
  assignments: Array<AssignUserTierInput>;
  programId: Scalars['ID']['input'];
};

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

export type CheckCompleteProgramResponse = {
  __typename?: 'CheckCompleteProgramResponse';
  allCompleted?: Maybe<Scalars['Boolean']['output']>;
  completedCount?: Maybe<Scalars['Int']['output']>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type CheckMilestoneInput = {
  id: Scalars['String']['input'];
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
  status: CheckMilestoneStatus;
};

export enum CheckMilestoneStatus {
  Completed = 'completed',
  Rejected = 'rejected'
}

export type ClaimableFees = {
  __typename?: 'ClaimableFees';
  amount?: Maybe<Scalars['String']['output']>;
  canClaim?: Maybe<Scalars['Boolean']['output']>;
  claimedAt?: Maybe<Scalars['DateTime']['output']>;
  feePercentage?: Maybe<Scalars['Float']['output']>;
  pendingEndDate?: Maybe<Scalars['DateTime']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
};

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

export type CommentReactionResult = {
  __typename?: 'CommentReactionResult';
  dislikeCount?: Maybe<Scalars['Int']['output']>;
  isDisliked?: Maybe<Scalars['Boolean']['output']>;
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  likeCount?: Maybe<Scalars['Int']['output']>;
};

export enum CommentableTypeEnum {
  Application = 'application',
  Milestone = 'milestone',
  Post = 'post',
  Program = 'program'
}

export type ContractV2 = {
  __typename?: 'ContractV2';
  applicantId?: Maybe<Scalars['Int']['output']>;
  applicationId?: Maybe<Scalars['Int']['output']>;
  builder_signature?: Maybe<Scalars['String']['output']>;
  contract_snapshot_cotents?: Maybe<Scalars['JSON']['output']>;
  contract_snapshot_hash?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  onchainContractId?: Maybe<Scalars['Int']['output']>;
  programId?: Maybe<Scalars['String']['output']>;
  smartContractId?: Maybe<Scalars['Int']['output']>;
  sponsorId?: Maybe<Scalars['Int']['output']>;
};

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

export type CreateApplicationV2Input = {
  /** Content of the application submitted by the applicant */
  content?: InputMaybe<Scalars['String']['input']>;
  /** ID of the program to apply for */
  programId: Scalars['ID']['input'];
  /** Application status (defaults to submitted) */
  status?: InputMaybe<ApplicationStatusV2>;
};

export type CreateArticleCommentInput = {
  /** Article ID */
  articleId: Scalars['ID']['input'];
  /** Comment content */
  content: Scalars['String']['input'];
  /** Parent comment ID for nested comments */
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateArticleInput = {
  /** Article category (default: article) */
  category?: InputMaybe<ArticleType>;
  /** Cover image file */
  coverImage?: InputMaybe<Scalars['Upload']['input']>;
  /** Article description in markdown format */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Whether to pin this article (default: false, admin only) */
  isPin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Article status (published or draft) */
  status?: InputMaybe<ArticleStatus>;
  /** Article title (max 130 characters) */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Article ID to unpin when pinning would exceed 2 pinned articles (admin only) */
  unpinArticleId?: InputMaybe<Scalars['ID']['input']>;
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

export type CreateContractV2Input = {
  applicantId: Scalars['Int']['input'];
  applicationId: Scalars['Int']['input'];
  builder_signature?: InputMaybe<Scalars['String']['input']>;
  contract_snapshot_cotents?: InputMaybe<Scalars['JSON']['input']>;
  contract_snapshot_hash?: InputMaybe<Scalars['String']['input']>;
  /** On-chain contract ID (optional on creation, will be set after contract execution) */
  onchainContractId?: InputMaybe<Scalars['Int']['input']>;
  programId: Scalars['String']['input'];
  smartContractId: Scalars['Int']['input'];
  sponsorId: Scalars['Int']['input'];
};

export type CreateEducationV2Input = {
  attendedEndDate?: InputMaybe<Scalars['Int']['input']>;
  attendedStartDate?: InputMaybe<Scalars['Int']['input']>;
  degree?: InputMaybe<Scalars['String']['input']>;
  school: Scalars['String']['input'];
  study?: InputMaybe<Scalars['String']['input']>;
};

export type CreateInvestmentInput = {
  amount: Scalars['String']['input'];
  investmentTermId?: InputMaybe<Scalars['ID']['input']>;
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

export type CreateMilestoneV2Input = {
  /** ID of the application */
  applicationId: Scalars['ID']['input'];
  /** Milestone deadline */
  deadline?: InputMaybe<Scalars['DateTime']['input']>;
  /** Milestone description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Milestone files (URLs) */
  files?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Milestone payout amount */
  payout?: InputMaybe<Scalars['String']['input']>;
  /** ID of the program */
  programId: Scalars['ID']['input'];
  /** ID of the sponsor (user) */
  sponsorId: Scalars['ID']['input'];
  /** Milestone status */
  status?: InputMaybe<MilestoneStatusV2>;
  /** Milestone title */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateNetworkV2Input = {
  chainId: Scalars['Int']['input'];
  chainName: Scalars['String']['input'];
  exploreUrl?: InputMaybe<Scalars['String']['input']>;
  mainnet: Scalars['Boolean']['input'];
};

export type CreateOnchainContractInfoV2Input = {
  applicantId: Scalars['Int']['input'];
  onchainContractId: Scalars['Int']['input'];
  programId: Scalars['String']['input'];
  smartContractId: Scalars['Int']['input'];
  sponsorId: Scalars['Int']['input'];
  status?: InputMaybe<OnchainContractStatusV2>;
  tx: Scalars['String']['input'];
};

export type CreateOnchainProgramInfoV2Input = {
  networkId: Scalars['Int']['input'];
  onchainProgramId: Scalars['Int']['input'];
  programId: Scalars['String']['input'];
  smartContractId: Scalars['Int']['input'];
  status?: InputMaybe<OnchainProgramStatusV2>;
  tx: Scalars['String']['input'];
};

export type CreatePortfolioV2Input = {
  /** Portfolio description (max 1000 characters) */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Array of image files to upload */
  images?: InputMaybe<Array<Scalars['Upload']['input']>>;
  /** Whether this is a Ludium project */
  isLudiumProject?: InputMaybe<Scalars['Boolean']['input']>;
  /** Role in the project (e.g., "Frontend Developer") */
  role?: InputMaybe<Scalars['String']['input']>;
  /** Portfolio title (required) */
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

export type CreateProgramV2Input = {
  deadline: Scalars['DateTime']['input'];
  description: Scalars['String']['input'];
  invitedMembers?: InputMaybe<Array<Scalars['String']['input']>>;
  networkId: Scalars['Int']['input'];
  price: Scalars['String']['input'];
  skills: Array<Scalars['String']['input']>;
  status: ProgramStatusV2;
  title: Scalars['String']['input'];
  token_id: Scalars['Int']['input'];
  visibility: ProgramVisibilityV2;
};

export type CreateProgramWithOnchainV2Input = {
  onchain: OnchainProgramInfoForCreateWithProgramV2Input;
  program: CreateProgramV2Input;
};

export type CreateProgramWithOnchainV2Payload = {
  __typename?: 'CreateProgramWithOnchainV2Payload';
  onchain?: Maybe<OnchainProgramInfoV2>;
  program?: Maybe<ProgramV2>;
};

export type CreateSmartContractV2Input = {
  address: Scalars['String']['input'];
  chainInfoId: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type CreateThreadCommentInput = {
  /** Comment content */
  content: Scalars['String']['input'];
  /** Parent comment ID for nested comments */
  parentId?: InputMaybe<Scalars['ID']['input']>;
  /** Thread ID */
  threadId: Scalars['ID']['input'];
};

export type CreateThreadInput = {
  /** Thread content */
  content: Scalars['String']['input'];
};

export type CreateTokenV2Input = {
  chainInfoId: Scalars['Int']['input'];
  decimals: Scalars['Int']['input'];
  tokenAddress: Scalars['String']['input'];
  tokenName: Scalars['String']['input'];
};

export type CreateUserV2Input = {
  /** User about section (max 1000 characters) */
  about?: InputMaybe<Scalars['String']['input']>;
  /** User email address */
  email?: InputMaybe<Scalars['String']['input']>;
  /** User location/timezone (e.g., "(GMT+09:00) Korea Standard Time - Seoul") */
  location?: InputMaybe<Scalars['String']['input']>;
  /** User login type */
  loginType: LoginTypeEnum;
  /** User nickname */
  nickname?: InputMaybe<Scalars['String']['input']>;
  /** User profile image URL */
  profileImage?: InputMaybe<Scalars['String']['input']>;
  /** User role (defaults to user) */
  role?: InputMaybe<UserRoleV2>;
  /** User skills array */
  skills?: InputMaybe<Array<Scalars['String']['input']>>;
  /** User professional role (e.g., "Web Developer") */
  userRole?: InputMaybe<Scalars['String']['input']>;
  /** User wallet address */
  walletAddress: Scalars['String']['input'];
};

export type CreateWorkExperienceV2Input = {
  company: Scalars['String']['input'];
  currentWork?: InputMaybe<Scalars['Boolean']['input']>;
  employmentType?: InputMaybe<Scalars['String']['input']>;
  endMonth?: InputMaybe<Scalars['String']['input']>;
  endYear?: InputMaybe<Scalars['Int']['input']>;
  role: Scalars['String']['input'];
  startMonth?: InputMaybe<Scalars['String']['input']>;
  startYear?: InputMaybe<Scalars['Int']['input']>;
};

export type DashboardV2 = {
  __typename?: 'DashboardV2';
  /** Payment overview by week for builder (4 weeks) */
  builderPaymentOverview?: Maybe<Array<PaymentWeek>>;
  /** Hiring activity statistics (as sponsor - programs created by user) */
  hiringActivity?: Maybe<SponsorHiringActivity>;
  /** Job activity statistics (as builder - programs user has applied to) */
  jobActivity?: Maybe<BuilderJobActivity>;
  /** Payment overview by week for sponsor (4 weeks) */
  sponsorPaymentOverview?: Maybe<Array<PaymentWeek>>;
};

export type DeleteArticleCommentInput = {
  /** Comment ID to delete */
  commentId: Scalars['ID']['input'];
};

export type DeleteThreadCommentInput = {
  /** Comment ID to delete */
  commentId: Scalars['ID']['input'];
};

export type EducationV2 = {
  __typename?: 'EducationV2';
  attendedEndDate?: Maybe<Scalars['Int']['output']>;
  attendedStartDate?: Maybe<Scalars['Int']['output']>;
  degree?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  school?: Maybe<Scalars['String']['output']>;
  study?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['Int']['output']>;
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

export type FeeClaim = {
  __typename?: 'FeeClaim';
  amount?: Maybe<Scalars['String']['output']>;
  claimedAt?: Maybe<Scalars['DateTime']['output']>;
  claimedBy?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  programId?: Maybe<Scalars['ID']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  txHash?: Maybe<Scalars['String']['output']>;
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

export type HiredBuilderV2 = {
  __typename?: 'HiredBuilderV2';
  id?: Maybe<Scalars['Int']['output']>;
  milestoneCount?: Maybe<Scalars['Int']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  paidAmount?: Maybe<Scalars['String']['output']>;
  profileImage?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  tokenId?: Maybe<Scalars['Int']['output']>;
  totalAmount?: Maybe<Scalars['String']['output']>;
};

export type HiredBuildersInput = {
  /** Pagination options for hired builders */
  pagination?: InputMaybe<PaginationInput>;
  /** Program ID */
  programId: Scalars['ID']['input'];
};

/** Filter for program status: ALL, OPEN, ONGOING, or COMPLETED */
export enum HiringActivityProgramStatusFilter {
  All = 'ALL',
  Completed = 'COMPLETED',
  Ongoing = 'ONGOING',
  Open = 'OPEN'
}

export type HiringActivityProgramsInput = {
  /** Pagination options */
  pagination?: InputMaybe<PaginationInput>;
  /** Search by program title */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter by program status: ALL, OPEN, ONGOING, or COMPLETED */
  status?: InputMaybe<HiringActivityProgramStatusFilter>;
};

export type HiringActivityV2 = {
  __typename?: 'HiringActivityV2';
  /** Card data with counts (for sponsor) */
  cards?: Maybe<SponsorHiringActivityCards>;
  /** Paginated list of programs */
  programs?: Maybe<PaginatedProgramsV2>;
};

export type Investment = {
  __typename?: 'Investment';
  amount?: Maybe<Scalars['String']['output']>;
  canReclaim?: Maybe<Scalars['Boolean']['output']>;
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

export type InvestmentStatsByStatus = {
  __typename?: 'InvestmentStatsByStatus';
  applicationOngoing?: Maybe<Scalars['Int']['output']>;
  fundingOngoing?: Maybe<Scalars['Int']['output']>;
  programCompleted?: Maybe<Scalars['Int']['output']>;
  projectOngoing?: Maybe<Scalars['Int']['output']>;
  ready?: Maybe<Scalars['Int']['output']>;
  refund?: Maybe<Scalars['Int']['output']>;
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
  currentPurchases?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  purchaseLimit?: Maybe<Scalars['Int']['output']>;
  remainingPurchases?: Maybe<Scalars['Int']['output']>;
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

/** Filter for program status: APPLIED, ONGOING or COMPLETED */
export enum JobActivityProgramStatusFilter {
  Applied = 'APPLIED',
  Completed = 'COMPLETED',
  Ongoing = 'ONGOING'
}

export type JobActivityProgramsInput = {
  /** Pagination options */
  pagination?: InputMaybe<PaginationInput>;
  /** Search by program title */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter by program status: APPLIED, ONGOING, or COMPLETED */
  status?: InputMaybe<JobActivityProgramStatusFilter>;
};

export type JobActivityV2 = {
  __typename?: 'JobActivityV2';
  /** Card data with counts (for builder) */
  cards?: Maybe<BuilderJobActivityCards>;
  /** Paginated list of programs */
  programs?: Maybe<PaginatedProgramsV2>;
};

export type Keyword = {
  __typename?: 'Keyword';
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export enum KeywordType {
  Role = 'role',
  Skill = 'skill'
}

export type LanguageV2 = {
  __typename?: 'LanguageV2';
  id?: Maybe<Scalars['ID']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  proficiency?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['Int']['output']>;
};

export type LanguageV2Input = {
  language: Scalars['String']['input'];
  proficiency: Scalars['String']['input'];
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

export enum LoginTypeEnum {
  Farcaster = 'farcaster',
  Google = 'google',
  Wallet = 'wallet'
}

export type Milestone = {
  __typename?: 'Milestone';
  /** Whether this milestone can be reclaimed (unpaid past deadline) */
  canReclaim?: Maybe<Scalars['Boolean']['output']>;
  comments?: Maybe<Array<Comment>>;
  currency?: Maybe<Scalars['String']['output']>;
  deadline?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  file?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  links?: Maybe<Array<Link>>;
  percentage?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  reclaimTxHash?: Maybe<Scalars['String']['output']>;
  reclaimed?: Maybe<Scalars['Boolean']['output']>;
  reclaimedAt?: Maybe<Scalars['DateTime']['output']>;
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

export type MilestoneProgress = {
  __typename?: 'MilestoneProgress';
  /** Number of completed milestones */
  completed?: Maybe<Scalars['Int']['output']>;
  /** Total number of milestones */
  total?: Maybe<Scalars['Int']['output']>;
};

export type MilestoneProgressInput = {
  /** Program ID */
  programId: Scalars['ID']['input'];
};

export enum MilestoneStatus {
  Completed = 'completed',
  Draft = 'draft',
  Pending = 'pending',
  Rejected = 'rejected',
  Submitted = 'submitted'
}

export enum MilestoneStatusV2 {
  Completed = 'completed',
  Draft = 'draft',
  InProgress = 'in_progress',
  UnderReview = 'under_review',
  Update = 'update'
}

export type MilestoneV2 = {
  __typename?: 'MilestoneV2';
  /** User who owns this milestone */
  applicant?: Maybe<UserV2>;
  /** ID of the application this milestone belongs to */
  applicationId?: Maybe<Scalars['Int']['output']>;
  /** Milestone creation timestamp */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Milestone deadline */
  deadline?: Maybe<Scalars['DateTime']['output']>;
  /** Milestone description */
  description?: Maybe<Scalars['String']['output']>;
  /** Files associated with this milestone */
  files?: Maybe<Array<Scalars['String']['output']>>;
  /** Milestone unique identifier */
  id?: Maybe<Scalars['ID']['output']>;
  /** The onchain contract metadata associated with this milestone (matched by programId and applicantId) */
  onchainMetadata?: Maybe<OnchainContractInfoV2>;
  /** Milestone payout amount */
  payout?: Maybe<Scalars['String']['output']>;
  /** Transaction hash for the milestone payout */
  payout_tx?: Maybe<Scalars['String']['output']>;
  /** Program this milestone belongs to */
  program?: Maybe<ProgramV2>;
  /** ID of the program this milestone belongs to */
  programId?: Maybe<Scalars['String']['output']>;
  /** Sponsor user who created this milestone */
  sponsor?: Maybe<UserV2>;
  /** ID of the sponsor (user) who created this milestone */
  sponsorId?: Maybe<Scalars['Int']['output']>;
  /** Milestone status: draft, under_review, in_progress, or completed */
  status?: Maybe<MilestoneStatusV2>;
  /** Milestone title */
  title?: Maybe<Scalars['String']['output']>;
  /** Milestone last update timestamp */
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type MilestonesV2QueryInput = {
  /** Filter by application ID */
  applicationId?: InputMaybe<Scalars['ID']['input']>;
  /** Number of items per page */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Page number (1-based) */
  page?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by program ID */
  programId?: InputMaybe<Scalars['ID']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptApplication?: Maybe<Application>;
  acceptProgram?: Maybe<Program>;
  addProgramKeyword?: Maybe<Keyword>;
  addUserKeyword?: Maybe<Keyword>;
  assignValidatorToProgram?: Maybe<Program>;
  banUser?: Maybe<User>;
  checkMilestone?: Maybe<Milestone>;
  claimProgramFees?: Maybe<FeeClaim>;
  /** Complete an application after verifying all milestones are completed (only by applicant) */
  completeApplicationV2?: Maybe<ApplicationV2>;
  /** Complete a program by changing its status to closed. Requires all applications to be completed. */
  completeProgramV2?: Maybe<ProgramV2>;
  createApplication?: Maybe<Application>;
  /** Create a new application */
  createApplicationV2?: Maybe<ApplicationV2>;
  /** Create a new article */
  createArticle?: Maybe<Article>;
  /** Create a comment on an article */
  createArticleComment?: Maybe<ArticleComment>;
  createCarouselItem?: Maybe<CarouselItem>;
  createComment?: Maybe<Comment>;
  createContractV2?: Maybe<ContractV2>;
  /** Create a new education */
  createEducationV2?: Maybe<EducationV2>;
  createInvestment?: Maybe<Investment>;
  createInvestmentTerm?: Maybe<InvestmentTerm>;
  /** Create a new milestone */
  createMilestoneV2?: Maybe<MilestoneV2>;
  createNetworkV2?: Maybe<NetworkV2>;
  createOnchainContractInfoV2?: Maybe<OnchainContractInfoV2>;
  createOnchainProgramInfoV2?: Maybe<OnchainProgramInfoV2>;
  /** Create a new portfolio */
  createPortfolioV2?: Maybe<PortfolioV2>;
  createPost?: Maybe<Post>;
  createProgram?: Maybe<Program>;
  createProgramV2?: Maybe<ProgramV2>;
  createProgramWithOnchainV2?: Maybe<CreateProgramWithOnchainV2Payload>;
  createSmartContractV2?: Maybe<SmartContractV2>;
  /** Create a new thread */
  createThread?: Maybe<Thread>;
  /** Create a comment on a thread */
  createThreadComment?: Maybe<ThreadComment>;
  createTokenV2?: Maybe<TokenV2>;
  createUser?: Maybe<User>;
  /** Create a new user */
  createUserV2?: Maybe<UserV2>;
  /** Create a new work experience */
  createWorkExperienceV2?: Maybe<WorkExperienceV2>;
  /** Delete an application by ID (only by the applicant) */
  deleteApplicationV2?: Maybe<ApplicationV2>;
  /** Delete an article */
  deleteArticle?: Maybe<Scalars['Boolean']['output']>;
  /** Delete a comment */
  deleteArticleComment?: Maybe<Scalars['Boolean']['output']>;
  deleteCarouselItem?: Maybe<CarouselItem>;
  deleteContractV2?: Maybe<ContractV2>;
  /** Delete an education (hard delete) */
  deleteEducationV2?: Maybe<Scalars['Boolean']['output']>;
  deleteInvestmentTerm?: Maybe<Scalars['Boolean']['output']>;
  /** Delete a milestone by ID */
  deleteMilestoneV2?: Maybe<MilestoneV2>;
  deleteNetworkV2?: Maybe<NetworkV2>;
  deleteOnchainContractInfoV2?: Maybe<OnchainContractInfoV2>;
  deleteOnchainProgramInfoV2?: Maybe<OnchainProgramInfoV2>;
  /** Delete a portfolio (hard delete) */
  deletePortfolioV2?: Maybe<Scalars['Boolean']['output']>;
  deleteProgram?: Maybe<Scalars['Boolean']['output']>;
  deleteProgramV2?: Maybe<Scalars['ID']['output']>;
  deleteSmartContractV2?: Maybe<SmartContractV2>;
  /** Delete a thread */
  deleteThread?: Maybe<Scalars['Boolean']['output']>;
  /** Delete a comment */
  deleteThreadComment?: Maybe<Scalars['Boolean']['output']>;
  deleteTokenV2?: Maybe<TokenV2>;
  deleteUser?: Maybe<User>;
  /** Delete a user by ID */
  deleteUserV2?: Maybe<Scalars['Boolean']['output']>;
  /** Delete a work experience (hard delete) */
  deleteWorkExperienceV2?: Maybe<Scalars['Boolean']['output']>;
  demoteFromAdmin?: Maybe<User>;
  generateSwappedUrl?: Maybe<SwappedUrlResponse>;
  hidePost?: Maybe<Post>;
  hideProgram?: Maybe<Program>;
  incrementPostView?: Maybe<Scalars['Int']['output']>;
  inviteUserToProgram?: Maybe<Program>;
  login?: Maybe<Scalars['String']['output']>;
  /** Login or create user account and return JWT token */
  loginV2?: Maybe<Scalars['String']['output']>;
  markAllNotificationsAsRead?: Maybe<Scalars['Boolean']['output']>;
  markNotificationAsRead?: Maybe<Scalars['Boolean']['output']>;
  /** Pick or unpick application (bookmark favorite, only by program creator) */
  pickApplicationV2?: Maybe<ApplicationV2>;
  processMilestonePayouts?: Maybe<Array<MilestonePayout>>;
  promoteToAdmin?: Maybe<User>;
  reclaimInvestment?: Maybe<Investment>;
  /** Reclaim funds from an unpaid milestone past its deadline */
  reclaimMilestone?: Maybe<Milestone>;
  reclaimProgram?: Maybe<Program>;
  rejectApplication?: Maybe<Application>;
  rejectProgram?: Maybe<Program>;
  removeProgramKeyword?: Maybe<Scalars['Boolean']['output']>;
  removeUserFromProgram?: Maybe<Program>;
  removeUserKeyword?: Maybe<Scalars['Boolean']['output']>;
  removeValidatorFromProgram?: Maybe<Program>;
  reorderCarouselItems?: Maybe<Array<CarouselItem>>;
  /** Request email verification code */
  requestEmailVerificationV2?: Maybe<Scalars['Boolean']['output']>;
  /** Review and accept/reject application (only by program creator) */
  reviewApplicationV2?: Maybe<ApplicationV2>;
  showPost?: Maybe<Post>;
  showProgram?: Maybe<Program>;
  submitMilestone?: Maybe<Milestone>;
  submitProgram?: Maybe<Program>;
  syncApplicationTiers?: Maybe<TierSyncResult>;
  /** Toggle like/dislike on a comment */
  toggleArticleCommentReaction?: Maybe<CommentReactionResult>;
  /** Toggle like on an article (like if not liked, unlike if liked) */
  toggleArticleLike?: Maybe<Scalars['Boolean']['output']>;
  /** Toggle like/dislike on a comment */
  toggleThreadCommentReaction?: Maybe<ThreadCommentReactionResult>;
  /** Toggle like/dislike on a thread */
  toggleThreadReaction?: Maybe<ThreadReactionResult>;
  unbanUser?: Maybe<User>;
  /** Update about section (max 1000 characters) */
  updateAboutSectionV2?: Maybe<UserV2>;
  updateApplication?: Maybe<Application>;
  /** Update chatroom message ID for an application (only by program sponsor). Generates a random UUID. */
  updateApplicationChatroomV2?: Maybe<ApplicationV2>;
  /** Update application content (only by applicant) */
  updateApplicationV2?: Maybe<ApplicationV2>;
  /** Update an article */
  updateArticle?: Maybe<Article>;
  /** Update a comment */
  updateArticleComment?: Maybe<ArticleComment>;
  updateCarouselItem?: Maybe<CarouselItem>;
  updateComment?: Maybe<Comment>;
  updateContractV2?: Maybe<ContractV2>;
  /** Update an existing education */
  updateEducationV2?: Maybe<EducationV2>;
  /** Update expertise section (role, skills, languages) */
  updateExpertiseSectionV2?: Maybe<UserV2>;
  updateInvestmentTerm?: Maybe<InvestmentTerm>;
  updateMilestone?: Maybe<Milestone>;
  /** Update milestone payout_tx and status by relayer service */
  updateMilestoneByRelayerV2?: Maybe<MilestoneV2>;
  /** Update an existing milestone */
  updateMilestoneV2?: Maybe<MilestoneV2>;
  updateNetworkV2?: Maybe<NetworkV2>;
  updateOnchainContractInfoV2?: Maybe<OnchainContractInfoV2>;
  updateOnchainProgramInfoV2?: Maybe<OnchainProgramInfoV2>;
  /** Update an existing portfolio */
  updatePortfolioV2?: Maybe<PortfolioV2>;
  updatePost?: Maybe<Post>;
  updateProfile?: Maybe<User>;
  /** Update profile section (nickname, email, location, profileImage) */
  updateProfileSectionV2?: Maybe<UserV2>;
  updateProgram?: Maybe<Program>;
  /** Update program status from open to closed by relayer service */
  updateProgramByRelayerV2?: Maybe<ProgramV2>;
  updateProgramV2?: Maybe<ProgramV2>;
  updateSmartContractV2?: Maybe<SmartContractV2>;
  /** Update a thread (content only) */
  updateThread?: Maybe<Thread>;
  /** Update a comment */
  updateThreadComment?: Maybe<ThreadComment>;
  updateTokenV2?: Maybe<TokenV2>;
  updateUser?: Maybe<User>;
  /** Update an existing user */
  updateUserV2?: Maybe<UserV2>;
  /** Update an existing work experience */
  updateWorkExperienceV2?: Maybe<WorkExperienceV2>;
  /** Verify email with verification code */
  verifyEmailV2?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationAcceptApplicationArgs = {
  id: Scalars['ID']['input'];
  onChainProjectId?: InputMaybe<Scalars['Int']['input']>;
  tierSyncInfo?: InputMaybe<TierSyncInfo>;
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
  type?: InputMaybe<KeywordType>;
  userId: Scalars['ID']['input'];
};


export type MutationAssignValidatorToProgramArgs = {
  programId: Scalars['ID']['input'];
  validatorId: Scalars['ID']['input'];
};


export type MutationBanUserArgs = {
  reason?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};


export type MutationCheckMilestoneArgs = {
  input: CheckMilestoneInput;
};


export type MutationClaimProgramFeesArgs = {
  programId: Scalars['ID']['input'];
  txHash: Scalars['String']['input'];
};


export type MutationCompleteApplicationV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationCompleteProgramV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput;
};


export type MutationCreateApplicationV2Args = {
  input: CreateApplicationV2Input;
};


export type MutationCreateArticleArgs = {
  input: CreateArticleInput;
};


export type MutationCreateArticleCommentArgs = {
  input: CreateArticleCommentInput;
};


export type MutationCreateCarouselItemArgs = {
  input: CreateCarouselItemInput;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateContractV2Args = {
  input: CreateContractV2Input;
};


export type MutationCreateEducationV2Args = {
  input: CreateEducationV2Input;
};


export type MutationCreateInvestmentArgs = {
  input: CreateInvestmentInput;
};


export type MutationCreateInvestmentTermArgs = {
  applicationId: Scalars['ID']['input'];
  input: CreateInvestmentTermInput;
};


export type MutationCreateMilestoneV2Args = {
  input: CreateMilestoneV2Input;
};


export type MutationCreateNetworkV2Args = {
  input: CreateNetworkV2Input;
};


export type MutationCreateOnchainContractInfoV2Args = {
  input: CreateOnchainContractInfoV2Input;
};


export type MutationCreateOnchainProgramInfoV2Args = {
  input: CreateOnchainProgramInfoV2Input;
};


export type MutationCreatePortfolioV2Args = {
  input: CreatePortfolioV2Input;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreateProgramArgs = {
  input: CreateProgramInput;
};


export type MutationCreateProgramV2Args = {
  input: CreateProgramV2Input;
};


export type MutationCreateProgramWithOnchainV2Args = {
  input: CreateProgramWithOnchainV2Input;
};


export type MutationCreateSmartContractV2Args = {
  input: CreateSmartContractV2Input;
};


export type MutationCreateThreadArgs = {
  input: CreateThreadInput;
};


export type MutationCreateThreadCommentArgs = {
  input: CreateThreadCommentInput;
};


export type MutationCreateTokenV2Args = {
  input: CreateTokenV2Input;
};


export type MutationCreateUserArgs = {
  input: UserInput;
};


export type MutationCreateUserV2Args = {
  input: CreateUserV2Input;
};


export type MutationCreateWorkExperienceV2Args = {
  input: CreateWorkExperienceV2Input;
};


export type MutationDeleteApplicationV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteArticleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteArticleCommentArgs = {
  input: DeleteArticleCommentInput;
};


export type MutationDeleteCarouselItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteContractV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEducationV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInvestmentTermArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMilestoneV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNetworkV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOnchainContractInfoV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOnchainProgramInfoV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePortfolioV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProgramArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProgramV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSmartContractV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteThreadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteThreadCommentArgs = {
  input: DeleteThreadCommentInput;
};


export type MutationDeleteTokenV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteWorkExperienceV2Args = {
  id: Scalars['ID']['input'];
};


export type MutationDemoteFromAdminArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationGenerateSwappedUrlArgs = {
  amount: Scalars['String']['input'];
  currencyCode: Scalars['String']['input'];
  userId: Scalars['String']['input'];
  walletAddress: Scalars['String']['input'];
};


export type MutationHidePostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationHideProgramArgs = {
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


export type MutationLoginV2Args = {
  email?: InputMaybe<Scalars['String']['input']>;
  loginType: LoginTypeEnum;
  walletAddress: Scalars['String']['input'];
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPickApplicationV2Args = {
  id: Scalars['ID']['input'];
  input: PickApplicationV2Input;
};


export type MutationProcessMilestonePayoutsArgs = {
  input: ProcessPayoutsInput;
};


export type MutationPromoteToAdminArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationReclaimInvestmentArgs = {
  input: ReclaimInvestmentInput;
};


export type MutationReclaimMilestoneArgs = {
  milestoneId: Scalars['ID']['input'];
  txHash?: InputMaybe<Scalars['String']['input']>;
};


export type MutationReclaimProgramArgs = {
  programId: Scalars['ID']['input'];
  txHash?: InputMaybe<Scalars['String']['input']>;
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


export type MutationRemoveUserFromProgramArgs = {
  programId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRemoveUserKeywordArgs = {
  keyword: Scalars['String']['input'];
  type?: InputMaybe<KeywordType>;
  userId: Scalars['ID']['input'];
};


export type MutationRemoveValidatorFromProgramArgs = {
  programId: Scalars['ID']['input'];
  validatorId: Scalars['ID']['input'];
};


export type MutationReorderCarouselItemsArgs = {
  items: Array<ReorderCarouselItemInput>;
};


export type MutationRequestEmailVerificationV2Args = {
  input: RequestEmailVerificationV2Input;
};


export type MutationReviewApplicationV2Args = {
  id: Scalars['ID']['input'];
  input: ReviewApplicationV2Input;
};


export type MutationShowPostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationShowProgramArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitMilestoneArgs = {
  input: SubmitMilestoneInput;
};


export type MutationSubmitProgramArgs = {
  educhainProgramId: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
  txHash: Scalars['String']['input'];
};


export type MutationSyncApplicationTiersArgs = {
  applicationId: Scalars['ID']['input'];
};


export type MutationToggleArticleCommentReactionArgs = {
  input: ToggleArticleCommentReactionInput;
};


export type MutationToggleArticleLikeArgs = {
  articleId: Scalars['ID']['input'];
};


export type MutationToggleThreadCommentReactionArgs = {
  input: ToggleThreadCommentReactionInput;
};


export type MutationToggleThreadReactionArgs = {
  input: ToggleThreadReactionInput;
};


export type MutationUnbanUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationUpdateAboutSectionV2Args = {
  input: UpdateAboutSectionV2Input;
};


export type MutationUpdateApplicationArgs = {
  input: UpdateApplicationInput;
};


export type MutationUpdateApplicationChatroomV2Args = {
  id: Scalars['ID']['input'];
  input: UpdateApplicationChatroomV2Input;
};


export type MutationUpdateApplicationV2Args = {
  id: Scalars['ID']['input'];
  input: UpdateApplicationV2Input;
};


export type MutationUpdateArticleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateArticleInput;
};


export type MutationUpdateArticleCommentArgs = {
  input: UpdateArticleCommentInput;
};


export type MutationUpdateCarouselItemArgs = {
  input: UpdateCarouselItemInput;
};


export type MutationUpdateCommentArgs = {
  input: UpdateCommentInput;
};


export type MutationUpdateContractV2Args = {
  id: Scalars['ID']['input'];
  input: UpdateContractV2Input;
};


export type MutationUpdateEducationV2Args = {
  input: UpdateEducationV2Input;
};


export type MutationUpdateExpertiseSectionV2Args = {
  input: UpdateExpertiseSectionV2Input;
};


export type MutationUpdateInvestmentTermArgs = {
  input: UpdateInvestmentTermInput;
};


export type MutationUpdateMilestoneArgs = {
  input: UpdateMilestoneInput;
};


export type MutationUpdateMilestoneByRelayerV2Args = {
  id: Scalars['ID']['input'];
  input: UpdateMilestoneByRelayerV2Input;
};


export type MutationUpdateMilestoneV2Args = {
  id: Scalars['ID']['input'];
  input: UpdateMilestoneV2Input;
};


export type MutationUpdateNetworkV2Args = {
  id: Scalars['ID']['input'];
  input: UpdateNetworkV2Input;
};


export type MutationUpdateOnchainContractInfoV2Args = {
  id: Scalars['ID']['input'];
  input: UpdateOnchainContractInfoV2Input;
};


export type MutationUpdateOnchainProgramInfoV2Args = {
  id: Scalars['ID']['input'];
  input: UpdateOnchainProgramInfoV2Input;
};


export type MutationUpdatePortfolioV2Args = {
  input: UpdatePortfolioV2Input;
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
};


export type MutationUpdateProfileArgs = {
  input: UserUpdateInput;
};


export type MutationUpdateProfileSectionV2Args = {
  input: UpdateProfileSectionV2Input;
};


export type MutationUpdateProgramArgs = {
  input: UpdateProgramInput;
};


export type MutationUpdateProgramByRelayerV2Args = {
  id: Scalars['ID']['input'];
  input: UpdateProgramByRelayerV2Input;
};


export type MutationUpdateProgramV2Args = {
  id: Scalars['ID']['input'];
  input: UpdateProgramV2Input;
};


export type MutationUpdateSmartContractV2Args = {
  id: Scalars['ID']['input'];
  input: UpdateSmartContractV2Input;
};


export type MutationUpdateThreadArgs = {
  id: Scalars['ID']['input'];
  input: UpdateThreadInput;
};


export type MutationUpdateThreadCommentArgs = {
  input: UpdateThreadCommentInput;
};


export type MutationUpdateTokenV2Args = {
  id: Scalars['ID']['input'];
  input: UpdateTokenV2Input;
};


export type MutationUpdateUserArgs = {
  input: UserUpdateInput;
};


export type MutationUpdateUserV2Args = {
  input: UpdateUserV2Input;
};


export type MutationUpdateWorkExperienceV2Args = {
  input: UpdateWorkExperienceV2Input;
};


export type MutationVerifyEmailV2Args = {
  email: Scalars['String']['input'];
  verificationCode: Scalars['String']['input'];
};

export type MyApplicationsV2QueryInput = {
  /** Number of items per page */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Page number (1-based) */
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type NetworkV2 = {
  __typename?: 'NetworkV2';
  chainId?: Maybe<Scalars['Int']['output']>;
  chainName?: Maybe<Scalars['String']['output']>;
  exploreUrl?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  mainnet?: Maybe<Scalars['Boolean']['output']>;
};

export type Notification = {
  __typename?: 'Notification';
  action?: Maybe<NotificationAction>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
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

export type NotificationResult = {
  __typename?: 'NotificationResult';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Notification>>;
};

export enum NotificationType {
  Application = 'application',
  Comment = 'comment',
  Milestone = 'milestone',
  Program = 'program',
  System = 'system'
}

export type OnchainContractInfoV2 = {
  __typename?: 'OnchainContractInfoV2';
  applicantId?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  /** The network associated with this onchain contract info (via smart contract) */
  network?: Maybe<NetworkV2>;
  onchainContractId?: Maybe<Scalars['Int']['output']>;
  programId?: Maybe<Scalars['String']['output']>;
  /** The smart contract associated with this onchain contract info */
  smartContract?: Maybe<SmartContractV2>;
  smartContractId?: Maybe<Scalars['Int']['output']>;
  sponsorId?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<OnchainContractStatusV2>;
  /** The token associated with the program of this contract info */
  token?: Maybe<TokenV2>;
  tx?: Maybe<Scalars['String']['output']>;
};

export enum OnchainContractStatusV2 {
  Active = 'active',
  Cancelled = 'cancelled',
  Completed = 'completed',
  Paused = 'paused',
  Updated = 'updated'
}

export type OnchainProgramInfoForCreateWithProgramV2Input = {
  onchainProgramId: Scalars['Int']['input'];
  smartContractId: Scalars['Int']['input'];
  status?: InputMaybe<OnchainProgramStatusV2>;
  tx: Scalars['String']['input'];
};

export type OnchainProgramInfoV2 = {
  __typename?: 'OnchainProgramInfoV2';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  /** The network associated with this onchain program info */
  network?: Maybe<NetworkV2>;
  networkId?: Maybe<Scalars['Int']['output']>;
  onchainProgramId?: Maybe<Scalars['Int']['output']>;
  /** The smart contract associated with this onchain program info */
  smartContract?: Maybe<SmartContractV2>;
  smartContractId?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<OnchainProgramStatusV2>;
  tx?: Maybe<Scalars['String']['output']>;
};

export enum OnchainProgramStatusV2 {
  Active = 'active',
  Cancelled = 'cancelled',
  Completed = 'completed',
  Paused = 'paused'
}

export type PaginatedApplications = {
  __typename?: 'PaginatedApplications';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Application>>;
};

export type PaginatedApplicationsV2 = {
  __typename?: 'PaginatedApplicationsV2';
  /** Total number of applications matching the query */
  count?: Maybe<Scalars['Int']['output']>;
  /** Current page number */
  currentPage?: Maybe<Scalars['Int']['output']>;
  /** List of applications for the current page */
  data?: Maybe<Array<ApplicationV2>>;
  /** Whether there is a next page */
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  /** Whether there is a previous page */
  hasPreviousPage?: Maybe<Scalars['Boolean']['output']>;
  /** Total number of pages */
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type PaginatedArticle = {
  __typename?: 'PaginatedArticle';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Article>>;
};

export type PaginatedBuilderMilestones = {
  __typename?: 'PaginatedBuilderMilestones';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<BuilderMilestoneV2>>;
};

export type PaginatedBuilderMilestonesV2 = {
  __typename?: 'PaginatedBuilderMilestonesV2';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<BuilderMilestoneV2>>;
};

export type PaginatedComments = {
  __typename?: 'PaginatedComments';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Comment>>;
};

export type PaginatedContractV2 = {
  __typename?: 'PaginatedContractV2';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<ContractV2>>;
};

export type PaginatedHiredBuilders = {
  __typename?: 'PaginatedHiredBuilders';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<HiredBuilderV2>>;
};

export type PaginatedHiredBuildersV2 = {
  __typename?: 'PaginatedHiredBuildersV2';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<HiredBuilderV2>>;
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

export type PaginatedMilestonesV2 = {
  __typename?: 'PaginatedMilestonesV2';
  /** Total number of milestones matching the query */
  count?: Maybe<Scalars['Int']['output']>;
  /** Current page number */
  currentPage?: Maybe<Scalars['Int']['output']>;
  /** List of milestones for the current page */
  data?: Maybe<Array<MilestoneV2>>;
  /** Whether there is a next page */
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  /** Whether there is a previous page */
  hasPreviousPage?: Maybe<Scalars['Boolean']['output']>;
  /** Total number of pages */
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type PaginatedNetworksV2 = {
  __typename?: 'PaginatedNetworksV2';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<NetworkV2>>;
};

export type PaginatedOnchainContractInfoV2 = {
  __typename?: 'PaginatedOnchainContractInfoV2';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<OnchainContractInfoV2>>;
};

export type PaginatedOnchainProgramInfoV2 = {
  __typename?: 'PaginatedOnchainProgramInfoV2';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<OnchainProgramInfoV2>>;
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

export type PaginatedProgramsV2 = {
  __typename?: 'PaginatedProgramsV2';
  /** Total number of programs matching the query */
  count?: Maybe<Scalars['Int']['output']>;
  /** Current page number */
  currentPage?: Maybe<Scalars['Int']['output']>;
  /** List of programs for the current page */
  data?: Maybe<Array<ProgramV2>>;
  /** Whether there is a next page */
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  /** Whether there is a previous page */
  hasPreviousPage?: Maybe<Scalars['Boolean']['output']>;
  /** Total number of pages */
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type PaginatedSmartContractsV2 = {
  __typename?: 'PaginatedSmartContractsV2';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<SmartContractV2>>;
};

export type PaginatedThread = {
  __typename?: 'PaginatedThread';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Thread>>;
};

export type PaginatedTokensV2 = {
  __typename?: 'PaginatedTokensV2';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<TokenV2>>;
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<User>>;
};

export type PaginatedUsersV2 = {
  __typename?: 'PaginatedUsersV2';
  /** Current page number */
  currentPage?: Maybe<Scalars['Int']['output']>;
  /** Whether there is a next page */
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  /** Whether there is a previous page */
  hasPreviousPage?: Maybe<Scalars['Boolean']['output']>;
  /** Total number of users matching the query */
  totalCount?: Maybe<Scalars['Int']['output']>;
  /** Total number of pages */
  totalPages?: Maybe<Scalars['Int']['output']>;
  /** List of users for the current page */
  users?: Maybe<Array<UserV2>>;
};

export type PaginationInput = {
  filter?: InputMaybe<Array<FilterInput>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortEnum>;
};

export type PaginationInputV2 = {
  filter?: InputMaybe<Array<FilterInput>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortEnum>;
};

export type PaymentInfo = {
  __typename?: 'PaymentInfo';
  deadline?: Maybe<Scalars['DateTime']['output']>;
  payout?: Maybe<Scalars['String']['output']>;
  tokenId?: Maybe<Scalars['Int']['output']>;
};

export type PaymentWeek = {
  __typename?: 'PaymentWeek';
  /** Total budget for completed milestones in this week */
  budget?: Maybe<Scalars['String']['output']>;
  /** Week label (e.g., "1 week", "2 week") */
  label?: Maybe<Scalars['String']['output']>;
};

export enum PayoutStatus {
  Completed = 'completed',
  Failed = 'failed',
  Pending = 'pending',
  Processing = 'processing'
}

export type PickApplicationV2Input = {
  /** Whether to mark this application as picked (bookmark) */
  picked: Scalars['Boolean']['input'];
};

export type PortfolioV2 = {
  __typename?: 'PortfolioV2';
  /** Portfolio creation timestamp */
  createdAt?: Maybe<Scalars['String']['output']>;
  /** Portfolio description (max 1000 characters) */
  description?: Maybe<Scalars['String']['output']>;
  /** Portfolio unique identifier */
  id?: Maybe<Scalars['ID']['output']>;
  /** Array of image URLs */
  images?: Maybe<Array<Scalars['String']['output']>>;
  /** Whether this is a Ludium project */
  isLudiumProject?: Maybe<Scalars['Boolean']['output']>;
  /** Role in the project */
  role?: Maybe<Scalars['String']['output']>;
  /** Portfolio title */
  title?: Maybe<Scalars['String']['output']>;
  /** Portfolio last update timestamp */
  updatedAt?: Maybe<Scalars['String']['output']>;
};

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
  visibility?: Maybe<PostVisibility>;
};

export enum PostVisibility {
  Private = 'private',
  Public = 'public',
  Restricted = 'restricted'
}

export type ProcessPayoutsInput = {
  contractAddress: Scalars['String']['input'];
  milestoneId: Scalars['ID']['input'];
};

export type Program = {
  __typename?: 'Program';
  applicationEndDate?: Maybe<Scalars['DateTime']['output']>;
  applicationStartDate?: Maybe<Scalars['DateTime']['output']>;
  applications?: Maybe<Array<Application>>;
  /** Whether this program can be reclaimed (unused past deadline) */
  canReclaim?: Maybe<Scalars['Boolean']['output']>;
  comments?: Maybe<Array<Comment>>;
  contractAddress?: Maybe<Scalars['String']['output']>;
  creator?: Maybe<User>;
  currency?: Maybe<Scalars['String']['output']>;
  customFeePercentage?: Maybe<Scalars['Int']['output']>;
  deadline?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  detailedStatus?: Maybe<Scalars['JSON']['output']>;
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
  maxFundingAmount?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  network?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  reclaimTxHash?: Maybe<Scalars['String']['output']>;
  reclaimed?: Maybe<Scalars['Boolean']['output']>;
  reclaimedAt?: Maybe<Scalars['DateTime']['output']>;
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

export type ProgramOverviewV2 = {
  __typename?: 'ProgramOverviewV2';
  /** List of hired builders (for sponsor) */
  hiredBuilders?: Maybe<PaginatedHiredBuildersV2>;
  /** Milestone progress (completed/total) */
  milestoneProgress?: Maybe<MilestoneProgress>;
  /** List of milestones (for builder) */
  milestones?: Maybe<PaginatedBuilderMilestonesV2>;
  /** List of upcoming payments (within 7 days based on deadline + 2 days) */
  upcomingPayments?: Maybe<Array<UpcomingPayment>>;
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

export enum ProgramStatusV2 {
  Closed = 'closed',
  Declined = 'declined',
  Deleted = 'deleted',
  Draft = 'draft',
  Open = 'open',
  UnderReview = 'under_review'
}

export enum ProgramType {
  Funding = 'funding',
  Regular = 'regular'
}

export type ProgramV2 = {
  __typename?: 'ProgramV2';
  /** The number of applications submitted by builders for this program */
  applicationCount?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deadline?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  /** Whether the currently authenticated builder has applied to this program */
  hasApplied?: Maybe<Scalars['Boolean']['output']>;
  /** Whether this program has at least one application with in_progress status */
  hasInProgressApplication?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  invitedMembers?: Maybe<Array<Scalars['String']['output']>>;
  /** The current builder's application to this program (only available in getProgramsByBuilderV2) */
  myApplication?: Maybe<ApplicationV2>;
  /** The network associated with this program */
  network?: Maybe<NetworkV2>;
  networkId?: Maybe<Scalars['Int']['output']>;
  /** The onchain program information associated with this program */
  onchain?: Maybe<OnchainProgramInfoV2>;
  price?: Maybe<Scalars['String']['output']>;
  skills?: Maybe<Array<Scalars['String']['output']>>;
  /** The sponsor (creator) of this program */
  sponsor?: Maybe<UserV2>;
  status?: Maybe<ProgramStatusV2>;
  title?: Maybe<Scalars['String']['output']>;
  /** The token associated with this program */
  token?: Maybe<TokenV2>;
  token_id?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  visibility?: Maybe<ProgramVisibilityV2>;
};

export enum ProgramVisibility {
  Private = 'private',
  Public = 'public',
  Restricted = 'restricted'
}

export enum ProgramVisibilityV2 {
  Private = 'private',
  Public = 'public',
  Restricted = 'restricted'
}

export type ProgramsV2QueryInput = {
  /** Number of items per page */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Page number (1-based) */
  page?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by program status */
  status?: InputMaybe<ProgramStatusV2>;
};

export type Query = {
  __typename?: 'Query';
  adminUsers?: Maybe<PaginatedUsers>;
  application?: Maybe<Application>;
  /** Get a single application by ID */
  applicationV2?: Maybe<ApplicationV2>;
  applications?: Maybe<PaginatedApplications>;
  /** Get applications for a specific program. Sponsors see all applications, builders see only their own. */
  applicationsByProgramV2?: Maybe<PaginatedApplicationsV2>;
  /** Get paginated list of applications with filtering options */
  applicationsV2?: Maybe<PaginatedApplicationsV2>;
  /** Get a single article by ID */
  article?: Maybe<Article>;
  /** Get child comments for a parent comment */
  articleChildComments?: Maybe<Array<ArticleComment>>;
  /** Get all comments for an article (hierarchical structure) */
  articleComments?: Maybe<Array<ArticleComment>>;
  /** Get a paginated list of articles */
  articles?: Maybe<PaginatedArticle>;
  /** Get list of milestones (for builder) */
  builderMilestones?: Maybe<PaginatedBuilderMilestones>;
  /** Get payment overview by week for builder (4 weeks) */
  builderPaymentOverview?: Maybe<Array<PaymentWeek>>;
  carouselItems?: Maybe<Array<EnrichedCarouselItem>>;
  /** Check if all milestones for a specific application are completed. Returns completion statistics. */
  checkApplicationMilestonesCompletedV2?: Maybe<ApplicationMilestoneStatus>;
  /** Check if a program can be completed (i.e., all applications are completed). */
  checkCompleteProgram?: Maybe<CheckCompleteProgramResponse>;
  claimableFees?: Maybe<ClaimableFees>;
  comment?: Maybe<Comment>;
  comments?: Maybe<PaginatedComments>;
  commentsByCommentable?: Maybe<Array<Comment>>;
  contractV2?: Maybe<ContractV2>;
  contractsByApplicantV2?: Maybe<PaginatedContractV2>;
  contractsByApplicationV2?: Maybe<PaginatedContractV2>;
  contractsByProgramV2?: Maybe<PaginatedContractV2>;
  contractsBySponsorV2?: Maybe<PaginatedContractV2>;
  contractsV2?: Maybe<PaginatedContractV2>;
  countNotifications?: Maybe<Scalars['Int']['output']>;
  getSwappedStatus?: Maybe<SwappedStatusResponse>;
  /** Get list of hired builders (for sponsor) */
  hiredBuilders?: Maybe<PaginatedHiredBuilders>;
  /** Get hiring activity statistics (as sponsor - programs created by user) */
  hiringActivity?: Maybe<SponsorHiringActivity>;
  /** Get hiring activity cards (counts for sponsor) */
  hiringActivityCards?: Maybe<SponsorHiringActivityCards>;
  /** Get hiring activity programs list */
  hiringActivityPrograms?: Maybe<PaginatedProgramsV2>;
  investment?: Maybe<Investment>;
  investmentTerm?: Maybe<InvestmentTerm>;
  investmentTermsByApplicationId?: Maybe<Array<InvestmentTerm>>;
  investments?: Maybe<PaginatedInvestments>;
  /** Get job activity statistics (as builder - programs user has applied to) */
  jobActivity?: Maybe<BuilderJobActivity>;
  /** Get job activity cards (counts for builder) */
  jobActivityCards?: Maybe<BuilderJobActivityCards>;
  /** Get job activity programs list */
  jobActivityPrograms?: Maybe<PaginatedProgramsV2>;
  keywords?: Maybe<Array<Keyword>>;
  milestone?: Maybe<Milestone>;
  milestonePayout?: Maybe<MilestonePayout>;
  milestonePayouts?: Maybe<PaginatedMilestonePayouts>;
  /** Get milestone progress (completed/total) */
  milestoneProgress?: Maybe<MilestoneProgress>;
  /** Get a single milestone by ID */
  milestoneV2?: Maybe<MilestoneV2>;
  milestones?: Maybe<PaginatedMilestones>;
  /** Get paginated list of milestones with status in_progress */
  milestonesInProgressV2?: Maybe<PaginatedMilestonesV2>;
  /** Get paginated list of milestones with filtering options */
  milestonesV2?: Maybe<PaginatedMilestonesV2>;
  /** Get all applications submitted by the current user */
  myApplicationsV2?: Maybe<PaginatedApplicationsV2>;
  /** Get all portfolios for the current authenticated user */
  myPortfoliosV2?: Maybe<Array<PortfolioV2>>;
  /** Get threads created by the authenticated user */
  myThreads?: Maybe<PaginatedThread>;
  networkV2?: Maybe<NetworkV2>;
  networksV2?: Maybe<PaginatedNetworksV2>;
  notifications?: Maybe<NotificationResult>;
  onchainContractInfoV2?: Maybe<OnchainContractInfoV2>;
  onchainContractInfosByApplicantV2?: Maybe<PaginatedOnchainContractInfoV2>;
  onchainContractInfosByProgramV2?: Maybe<PaginatedOnchainContractInfoV2>;
  onchainContractInfosV2?: Maybe<PaginatedOnchainContractInfoV2>;
  onchainProgramInfoV2?: Maybe<OnchainProgramInfoV2>;
  onchainProgramInfosByProgramV2?: Maybe<PaginatedOnchainProgramInfoV2>;
  onchainProgramInfosBySmartContractV2?: Maybe<PaginatedOnchainProgramInfoV2>;
  onchainProgramInfosV2?: Maybe<PaginatedOnchainProgramInfoV2>;
  /** Get all pinned articles */
  pinnedArticles?: Maybe<Array<Article>>;
  /** Get a single portfolio by ID */
  portfolioV2?: Maybe<PortfolioV2>;
  /** Get all portfolios for a specific user */
  portfoliosByUserIdV2?: Maybe<Array<PortfolioV2>>;
  post?: Maybe<Post>;
  posts?: Maybe<PaginatedPosts>;
  /** Get current user profile (deprecated: use profileV2 instead) */
  profile?: Maybe<User>;
  /** Get current authenticated user profile */
  profileV2?: Maybe<UserV2>;
  program?: Maybe<Program>;
  /** Get a single program by ID. */
  programV2?: Maybe<ProgramV2>;
  programs?: Maybe<PaginatedPrograms>;
  /** Get all programs that the current builder has applied to, with pagination. Each program includes the builder's application with appliedAt. Default limit is 10, default offset is 0. */
  programsByBuilderIdV2?: Maybe<PaginatedProgramsV2>;
  /** Get all programs by sponsor ID with pagination. Default limit is 10, default offset is 0. Returns all programs created by a specific sponsor. */
  programsBysponsorIdV2?: Maybe<PaginatedProgramsV2>;
  /** Get all programs that are currently in progress (status: open) with pagination. Default page is 1, default limit is 10. */
  programsInProgressV2?: Maybe<PaginatedProgramsV2>;
  /** Get all programs with pagination. Default limit is 10, default offset is 0. */
  programsV2?: Maybe<PaginatedProgramsV2>;
  /** Get all programs with filtering options (status, pagination). */
  programsWithFilterV2?: Maybe<PaginatedProgramsV2>;
  /** Query users with dynamic field=value filters (AND condition, no pagination) */
  queryUsersV2?: Maybe<Array<UserV2>>;
  /** Get recommended articles by type */
  recommendedArticles?: Maybe<Array<Article>>;
  smartContractV2?: Maybe<SmartContractV2>;
  smartContractsV2?: Maybe<PaginatedSmartContractsV2>;
  /** Get payment overview by week for sponsor (4 weeks) */
  sponsorPaymentOverview?: Maybe<Array<PaymentWeek>>;
  /** Get a single thread by ID */
  thread?: Maybe<Thread>;
  /** Get child comments for a parent comment */
  threadChildComments?: Maybe<Array<ThreadComment>>;
  /** Get all comments for a thread (hierarchical structure) */
  threadComments?: Maybe<Array<ThreadComment>>;
  /** Get a paginated list of threads */
  threads?: Maybe<PaginatedThread>;
  tokenV2?: Maybe<TokenV2>;
  tokensByNetworkV2?: Maybe<PaginatedTokensV2>;
  tokensV2?: Maybe<PaginatedTokensV2>;
  /** Get top 5 articles by view count in the last 30 days */
  topViewedArticles?: Maybe<Array<Article>>;
  /** Get list of upcoming payments (within 7 days based on deadline + 2 days) */
  upcomingPayments?: Maybe<Array<UpcomingPayment>>;
  user?: Maybe<User>;
  /** Get a single user by ID */
  userV2?: Maybe<UserV2>;
  users?: Maybe<PaginatedUsers>;
  /** Get paginated list of users with comprehensive filtering options */
  usersV2?: Maybe<PaginatedUsersV2>;
};


export type QueryAdminUsersArgs = {
  includesBanned?: InputMaybe<Scalars['Boolean']['input']>;
  onlyBanned?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationInput>;
  role?: InputMaybe<UserRole>;
};


export type QueryApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryApplicationV2Args = {
  id: Scalars['ID']['input'];
};


export type QueryApplicationsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryApplicationsByProgramV2Args = {
  query: ApplicationsByProgramV2QueryInput;
};


export type QueryApplicationsV2Args = {
  query?: InputMaybe<ApplicationsV2QueryInput>;
};


export type QueryArticleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryArticleChildCommentsArgs = {
  parentId: Scalars['ID']['input'];
};


export type QueryArticleCommentsArgs = {
  articleId: Scalars['ID']['input'];
};


export type QueryArticlesArgs = {
  input?: InputMaybe<ArticlesQueryInput>;
};


export type QueryBuilderMilestonesArgs = {
  input: BuilderMilestonesInput;
};


export type QueryCheckApplicationMilestonesCompletedV2Args = {
  applicationId: Scalars['ID']['input'];
};


export type QueryCheckCompleteProgramArgs = {
  programId: Scalars['ID']['input'];
};


export type QueryClaimableFeesArgs = {
  programId: Scalars['ID']['input'];
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


export type QueryContractV2Args = {
  id: Scalars['ID']['input'];
};


export type QueryContractsByApplicantV2Args = {
  applicantId: Scalars['Int']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryContractsByApplicationV2Args = {
  applicationId: Scalars['Int']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryContractsByProgramV2Args = {
  pagination?: InputMaybe<PaginationInput>;
  programId: Scalars['String']['input'];
};


export type QueryContractsBySponsorV2Args = {
  pagination?: InputMaybe<PaginationInput>;
  sponsorId: Scalars['Int']['input'];
};


export type QueryContractsV2Args = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryGetSwappedStatusArgs = {
  userId: Scalars['String']['input'];
};


export type QueryHiredBuildersArgs = {
  input: HiredBuildersInput;
};


export type QueryHiringActivityProgramsArgs = {
  input: HiringActivityProgramsInput;
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


export type QueryJobActivityProgramsArgs = {
  input: JobActivityProgramsInput;
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


export type QueryMilestoneProgressArgs = {
  input: MilestoneProgressInput;
};


export type QueryMilestoneV2Args = {
  id: Scalars['ID']['input'];
};


export type QueryMilestonesArgs = {
  applicationId: Scalars['ID']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryMilestonesInProgressV2Args = {
  query?: InputMaybe<MilestonesV2QueryInput>;
};


export type QueryMilestonesV2Args = {
  query?: InputMaybe<MilestonesV2QueryInput>;
};


export type QueryMyApplicationsV2Args = {
  query?: InputMaybe<MyApplicationsV2QueryInput>;
};


export type QueryMyThreadsArgs = {
  input?: InputMaybe<ThreadsQueryInput>;
};


export type QueryNetworkV2Args = {
  id: Scalars['ID']['input'];
};


export type QueryNetworksV2Args = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryNotificationsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryOnchainContractInfoV2Args = {
  id: Scalars['ID']['input'];
};


export type QueryOnchainContractInfosByApplicantV2Args = {
  applicantId: Scalars['Int']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryOnchainContractInfosByProgramV2Args = {
  pagination?: InputMaybe<PaginationInput>;
  programId: Scalars['String']['input'];
};


export type QueryOnchainContractInfosV2Args = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryOnchainProgramInfoV2Args = {
  id: Scalars['ID']['input'];
};


export type QueryOnchainProgramInfosByProgramV2Args = {
  pagination?: InputMaybe<PaginationInput>;
  programId: Scalars['String']['input'];
};


export type QueryOnchainProgramInfosBySmartContractV2Args = {
  pagination?: InputMaybe<PaginationInput>;
  smartContractId: Scalars['Int']['input'];
};


export type QueryOnchainProgramInfosV2Args = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryPortfolioV2Args = {
  id: Scalars['ID']['input'];
};


export type QueryPortfoliosByUserIdV2Args = {
  userId: Scalars['ID']['input'];
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


export type QueryProgramV2Args = {
  id: Scalars['ID']['input'];
};


export type QueryProgramsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryProgramsByBuilderIdV2Args = {
  builderId: Scalars['ID']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryProgramsBysponsorIdV2Args = {
  pagination?: InputMaybe<PaginationInput>;
  sponsorId: Scalars['ID']['input'];
};


export type QueryProgramsInProgressV2Args = {
  query?: InputMaybe<ProgramsV2QueryInput>;
};


export type QueryProgramsV2Args = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryProgramsWithFilterV2Args = {
  query?: InputMaybe<ProgramsV2QueryInput>;
};


export type QueryQueryUsersV2Args = {
  filter?: InputMaybe<Array<UserV2QueryFilterInput>>;
};


export type QueryRecommendedArticlesArgs = {
  type: ArticleType;
};


export type QuerySmartContractV2Args = {
  id: Scalars['ID']['input'];
};


export type QuerySmartContractsV2Args = {
  chainInfoId?: InputMaybe<Scalars['Int']['input']>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryThreadArgs = {
  id: Scalars['ID']['input'];
};


export type QueryThreadChildCommentsArgs = {
  parentId: Scalars['ID']['input'];
};


export type QueryThreadCommentsArgs = {
  threadId: Scalars['ID']['input'];
};


export type QueryThreadsArgs = {
  input?: InputMaybe<ThreadsQueryInput>;
};


export type QueryTokenV2Args = {
  id: Scalars['ID']['input'];
};


export type QueryTokensByNetworkV2Args = {
  networkId: Scalars['Int']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryTokensV2Args = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryTopViewedArticlesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUpcomingPaymentsArgs = {
  input: UpcomingPaymentsInput;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserV2Args = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryUsersV2Args = {
  query?: InputMaybe<UsersV2QueryInput>;
};

export type ReclaimInvestmentInput = {
  investmentId: Scalars['ID']['input'];
  txHash: Scalars['String']['input'];
};

export type ReorderCarouselItemInput = {
  displayOrder: Scalars['Int']['input'];
  id: Scalars['String']['input'];
};

export type RequestEmailVerificationV2Input = {
  /** Email address to verify */
  email: Scalars['String']['input'];
};

export type ReviewApplicationV2Input = {
  /** Optional note when adjusting status (legacy compatibility) */
  rejectedReason?: InputMaybe<Scalars['String']['input']>;
  /** Review decision status update (e.g., pending_signature, in_progress) */
  status: ApplicationStatusV2;
};

export type SmartContractV2 = {
  __typename?: 'SmartContractV2';
  address?: Maybe<Scalars['String']['output']>;
  chainInfoId?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  network?: Maybe<NetworkV2>;
};

export enum SortEnum {
  Asc = 'asc',
  Desc = 'desc'
}

export type SponsorHiringActivity = {
  __typename?: 'SponsorHiringActivity';
  /** Number of programs with ongoing milestones (applications with in_progress or pending_signature status) */
  ongoingPrograms?: Maybe<Scalars['Int']['output']>;
  /** Number of programs with status open */
  openPrograms?: Maybe<Scalars['Int']['output']>;
};

export type SponsorHiringActivityCards = {
  __typename?: 'SponsorHiringActivityCards';
  /** Total number of programs created by sponsor (excluding deleted) */
  all?: Maybe<Scalars['Int']['output']>;
  /** Number of programs with status completed */
  completed?: Maybe<Scalars['Int']['output']>;
  /** Number of programs with ongoing milestones (applications with in_progress or pending_signature) */
  ongoing?: Maybe<Scalars['Int']['output']>;
  /** Number of programs with status open */
  open?: Maybe<Scalars['Int']['output']>;
};

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
  notifications?: Maybe<NotificationResult>;
};


export type SubscriptionNotificationsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type Supporter = {
  __typename?: 'Supporter';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  maxInvestmentAmount?: Maybe<Scalars['String']['output']>;
  tier?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
  walletAddress?: Maybe<Scalars['String']['output']>;
};

export type SwappedStatusResponse = {
  __typename?: 'SwappedStatusResponse';
  data?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  orderId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type SwappedUrlResponse = {
  __typename?: 'SwappedUrlResponse';
  originalUrl?: Maybe<Scalars['String']['output']>;
  signature?: Maybe<Scalars['String']['output']>;
  signedUrl?: Maybe<Scalars['String']['output']>;
};

export type Thread = {
  __typename?: 'Thread';
  /** Author nickname */
  authorNickname?: Maybe<Scalars['String']['output']>;
  /** Author profile image URL */
  authorProfileImage?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Number of dislikes */
  dislikeCount?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  /** Whether the currently authenticated user has disliked this thread */
  isDisliked?: Maybe<Scalars['Boolean']['output']>;
  /** Whether the currently authenticated user has liked this thread */
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  /** Number of likes */
  likeCount?: Maybe<Scalars['Int']['output']>;
  /** Number of comments */
  replyCount?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ThreadComment = {
  __typename?: 'ThreadComment';
  authorId?: Maybe<Scalars['Int']['output']>;
  /** Author nickname */
  authorNickname?: Maybe<Scalars['String']['output']>;
  /** Author profile image URL */
  authorProfileImage?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  dislikeCount?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isDisliked?: Maybe<Scalars['Boolean']['output']>;
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  likeCount?: Maybe<Scalars['Int']['output']>;
  parentId?: Maybe<Scalars['ID']['output']>;
  replies?: Maybe<Array<ThreadComment>>;
  /** Number of child comments */
  replyCount?: Maybe<Scalars['Int']['output']>;
  threadId?: Maybe<Scalars['ID']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum ThreadCommentReaction {
  Dislike = 'dislike',
  Like = 'like'
}

export type ThreadCommentReactionResult = {
  __typename?: 'ThreadCommentReactionResult';
  dislikeCount?: Maybe<Scalars['Int']['output']>;
  isDisliked?: Maybe<Scalars['Boolean']['output']>;
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  likeCount?: Maybe<Scalars['Int']['output']>;
};

export enum ThreadReaction {
  Dislike = 'dislike',
  Like = 'like'
}

export type ThreadReactionResult = {
  __typename?: 'ThreadReactionResult';
  dislikeCount?: Maybe<Scalars['Int']['output']>;
  isDisliked?: Maybe<Scalars['Boolean']['output']>;
  isLiked?: Maybe<Scalars['Boolean']['output']>;
  likeCount?: Maybe<Scalars['Int']['output']>;
};

export type ThreadsQueryInput = {
  /** Pagination options */
  pagination?: InputMaybe<PaginationInput>;
};

export type TierAssignmentData = {
  __typename?: 'TierAssignmentData';
  maxInvestmentAmount?: Maybe<Scalars['String']['output']>;
  tier?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
  walletAddress?: Maybe<Scalars['String']['output']>;
};

export type TierSyncInfo = {
  contractAddress: Scalars['String']['input'];
  programOwnerAddress: Scalars['String']['input'];
};

export type TierSyncResult = {
  __typename?: 'TierSyncResult';
  contractAddress?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['Int']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  tierAssignments?: Maybe<Array<TierAssignmentData>>;
};

export type ToggleArticleCommentReactionInput = {
  /** Comment ID */
  commentId: Scalars['ID']['input'];
  /** Reaction type (like or dislike) */
  reaction: ArticleCommentReaction;
};

export type ToggleThreadCommentReactionInput = {
  /** Comment ID */
  commentId: Scalars['ID']['input'];
  /** Reaction type (like or dislike) */
  reaction: ThreadCommentReaction;
};

export type ToggleThreadReactionInput = {
  /** Reaction type (like or dislike) */
  reaction: ThreadReaction;
  /** Thread ID */
  threadId: Scalars['ID']['input'];
};

export type TokenV2 = {
  __typename?: 'TokenV2';
  chainInfoId?: Maybe<Scalars['Int']['output']>;
  decimals?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  tokenAddress?: Maybe<Scalars['String']['output']>;
  tokenName?: Maybe<Scalars['String']['output']>;
};

export type UpcomingPayment = {
  __typename?: 'UpcomingPayment';
  builder?: Maybe<BuilderInfo>;
  payment?: Maybe<Array<PaymentInfo>>;
};

export type UpcomingPaymentsInput = {
  /** Program ID */
  programId: Scalars['ID']['input'];
};

export type UpdateAboutSectionV2Input = {
  /** User about section (max 1000 characters, required) */
  about: Scalars['String']['input'];
};

export type UpdateApplicationChatroomV2Input = {
  /** Placeholder field (GraphQL requires at least one field in input types) */
  _placeholder?: InputMaybe<Scalars['Boolean']['input']>;
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

export type UpdateApplicationV2Input = {
  /** Updated application content */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Updated application status (builder-driven lifecycle updates) */
  status?: InputMaybe<ApplicationStatusV2>;
};

export type UpdateArticleCommentInput = {
  /** Comment ID to update */
  commentId: Scalars['ID']['input'];
  /** Updated comment content */
  content: Scalars['String']['input'];
};

export type UpdateArticleInput = {
  /** Article category (admin only) */
  category?: InputMaybe<ArticleType>;
  /** Cover image file */
  coverImage?: InputMaybe<Scalars['Upload']['input']>;
  /** Article description in markdown format */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Whether to pin this article (admin only) */
  isPin?: InputMaybe<Scalars['Boolean']['input']>;
  /** Article status (published or draft) */
  status?: InputMaybe<ArticleStatus>;
  /** Article title (max 130 characters) */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Article ID to unpin when pinning would exceed 2 pinned articles (admin only) */
  unpinArticleId?: InputMaybe<Scalars['ID']['input']>;
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

export type UpdateContractV2Input = {
  builder_signature?: InputMaybe<Scalars['String']['input']>;
  contract_snapshot_cotents?: InputMaybe<Scalars['JSON']['input']>;
  contract_snapshot_hash?: InputMaybe<Scalars['String']['input']>;
  /** On-chain contract ID (set after contract execution and payment) */
  onchainContractId?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateEducationV2Input = {
  attendedEndDate?: InputMaybe<Scalars['Int']['input']>;
  attendedStartDate?: InputMaybe<Scalars['Int']['input']>;
  degree?: InputMaybe<Scalars['String']['input']>;
  /** Education ID to update */
  id: Scalars['ID']['input'];
  school: Scalars['String']['input'];
  study?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateExpertiseSectionV2Input = {
  /** User languages list */
  languages?: InputMaybe<Array<LanguageV2Input>>;
  /** User professional role (required) */
  role: Scalars['String']['input'];
  /** User skills array */
  skills?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateInvestmentTermInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  price?: InputMaybe<Scalars['String']['input']>;
  purchaseLimit?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMilestoneByRelayerV2Input = {
  /** Transaction hash for the milestone payout */
  payout_tx: Scalars['String']['input'];
  /** Milestone status (typically set to completed when payout_tx is set) */
  status?: InputMaybe<MilestoneStatusV2>;
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

export type UpdateMilestoneV2Input = {
  /** Milestone deadline */
  deadline?: InputMaybe<Scalars['DateTime']['input']>;
  /** Milestone description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Milestone files (URLs) */
  files?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Milestone payout amount */
  payout?: InputMaybe<Scalars['String']['input']>;
  /** Transaction hash for the milestone payout */
  payout_tx?: InputMaybe<Scalars['String']['input']>;
  /** Milestone status */
  status?: InputMaybe<MilestoneStatusV2>;
  /** Milestone title */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateNetworkV2Input = {
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainName?: InputMaybe<Scalars['String']['input']>;
  exploreUrl?: InputMaybe<Scalars['String']['input']>;
  mainnet?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateOnchainContractInfoV2Input = {
  status?: InputMaybe<OnchainContractStatusV2>;
  tx?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOnchainProgramInfoV2Input = {
  status?: InputMaybe<OnchainProgramStatusV2>;
  tx?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePortfolioV2Input = {
  /** Portfolio description (max 1000 characters) */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Portfolio ID to update */
  id: Scalars['ID']['input'];
  /** Array of image files to upload (replaces existing images) */
  images?: InputMaybe<Array<Scalars['Upload']['input']>>;
  /** Whether this is a Ludium project */
  isLudiumProject?: InputMaybe<Scalars['Boolean']['input']>;
  /** Role in the project (e.g., "Frontend Developer") */
  role?: InputMaybe<Scalars['String']['input']>;
  /** Portfolio title (required) */
  title: Scalars['String']['input'];
};

export type UpdatePostInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  keywords?: InputMaybe<Array<Scalars['ID']['input']>>;
  summary?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProfileSectionV2Input = {
  /** User email address (required) */
  email: Scalars['String']['input'];
  /** User location/timezone (required) */
  location: Scalars['String']['input'];
  /** User nickname (required) */
  nickname: Scalars['String']['input'];
  /** User profile image (optional) */
  profileImage?: InputMaybe<Scalars['Upload']['input']>;
  /** Email verification code (required if email is new or changed) */
  verificationCode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProgramByRelayerV2Input = {
  /** Program status (relayer can only change from open to closed) */
  status: ProgramStatusV2;
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

export type UpdateProgramV2Input = {
  deadline?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  invitedMembers?: InputMaybe<Array<Scalars['String']['input']>>;
  networkId?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
  skills?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<ProgramStatusV2>;
  title?: InputMaybe<Scalars['String']['input']>;
  token_id?: InputMaybe<Scalars['Int']['input']>;
  visibility?: InputMaybe<ProgramVisibilityV2>;
};

export type UpdateSmartContractV2Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateThreadCommentInput = {
  /** Comment ID to update */
  commentId: Scalars['ID']['input'];
  /** Updated comment content */
  content: Scalars['String']['input'];
};

export type UpdateThreadInput = {
  /** Updated thread content */
  content: Scalars['String']['input'];
};

export type UpdateTokenV2Input = {
  chainInfoId?: InputMaybe<Scalars['Int']['input']>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  tokenName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserV2Input = {
  /** User about section (max 1000 characters) */
  about?: InputMaybe<Scalars['String']['input']>;
  /** User email address */
  email?: InputMaybe<Scalars['String']['input']>;
  /** User ID to update */
  id: Scalars['ID']['input'];
  /** User location/timezone (e.g., "(GMT+09:00) Korea Standard Time - Seoul") */
  location?: InputMaybe<Scalars['String']['input']>;
  /** User nickname */
  nickname?: InputMaybe<Scalars['String']['input']>;
  /** User profile image URL */
  profileImage?: InputMaybe<Scalars['String']['input']>;
  /** User role */
  role?: InputMaybe<UserRoleV2>;
  /** User skills array */
  skills?: InputMaybe<Array<Scalars['String']['input']>>;
  /** User professional role (e.g., "Web Developer") */
  userRole?: InputMaybe<Scalars['String']['input']>;
  /** User wallet address */
  walletAddress?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateWorkExperienceV2Input = {
  company: Scalars['String']['input'];
  currentWork?: InputMaybe<Scalars['Boolean']['input']>;
  employmentType?: InputMaybe<Scalars['String']['input']>;
  endMonth?: InputMaybe<Scalars['String']['input']>;
  endYear?: InputMaybe<Scalars['Int']['input']>;
  /** Work experience ID to update */
  id: Scalars['ID']['input'];
  role: Scalars['String']['input'];
  startMonth?: InputMaybe<Scalars['String']['input']>;
  startYear?: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename?: 'User';
  about?: Maybe<Scalars['String']['output']>;
  avatar?: Maybe<Scalars['Upload']['output']>;
  banned?: Maybe<Scalars['Boolean']['output']>;
  bannedAt?: Maybe<Scalars['Date']['output']>;
  bannedReason?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  investmentStatistics?: Maybe<UserInvestmentStatistics>;
  keywords?: Maybe<Array<Keyword>>;
  lastName?: Maybe<Scalars['String']['output']>;
  links?: Maybe<Array<Link>>;
  loginType?: Maybe<Scalars['String']['output']>;
  organizationName?: Maybe<Scalars['String']['output']>;
  programStatistics?: Maybe<UserProgramStatistics>;
  role?: Maybe<UserRole>;
  roleKeywords?: Maybe<Array<Keyword>>;
  skillKeywords?: Maybe<Array<Keyword>>;
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

export type UserInvestmentStatistics = {
  __typename?: 'UserInvestmentStatistics';
  asHost?: Maybe<InvestmentStatsByStatus>;
  asProject?: Maybe<InvestmentStatsByStatus>;
  asSupporter?: Maybe<InvestmentStatsByStatus>;
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

export enum UserRoleV2 {
  Admin = 'admin',
  Relayer = 'relayer',
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
  roleKeywords?: InputMaybe<Array<Scalars['String']['input']>>;
  skillKeywords?: InputMaybe<Array<Scalars['String']['input']>>;
  summary?: InputMaybe<Scalars['String']['input']>;
  walletAddress?: InputMaybe<Scalars['String']['input']>;
};

export type UserV2 = {
  __typename?: 'UserV2';
  /** User about (max 1000) */
  about?: Maybe<Scalars['String']['output']>;
  /** User creation timestamp */
  createdAt?: Maybe<Scalars['Date']['output']>;
  /** Programs created by this user */
  createdPrograms?: Maybe<Array<ProgramV2>>;
  /** User education history */
  educations?: Maybe<Array<EducationV2>>;
  /** User email address */
  email?: Maybe<Scalars['String']['output']>;
  /** User unique identifier */
  id?: Maybe<Scalars['ID']['output']>;
  /** User languages */
  languages?: Maybe<Array<LanguageV2>>;
  /** User location/timezone (e.g., "(GMT+09:00) Korea Standard Time - Seoul") */
  location?: Maybe<Scalars['String']['output']>;
  /** Authentication method used by the user */
  loginType?: Maybe<LoginTypeEnum>;
  /** User nickname */
  nickname?: Maybe<Scalars['String']['output']>;
  /** User profile image URL */
  profileImage?: Maybe<Scalars['String']['output']>;
  /** User role (user or admin) */
  role?: Maybe<UserRoleV2>;
  /** User skills list */
  skills?: Maybe<Array<Scalars['String']['output']>>;
  /** User last update timestamp */
  updatedAt?: Maybe<Scalars['Date']['output']>;
  /** User professional role (e.g., "Web Developer") */
  userRole?: Maybe<Scalars['String']['output']>;
  /** User wallet address */
  walletAddress?: Maybe<Scalars['String']['output']>;
  /** User work experiences */
  workExperiences?: Maybe<Array<WorkExperienceV2>>;
};

export type UserV2QueryFilterInput = {
  /** Field name to filter by (walletAddress, email, role, loginType, nickname) */
  field: Scalars['String']['input'];
  /** Value to filter for */
  value?: InputMaybe<Scalars['String']['input']>;
};

export type UsersV2QueryInput = {
  /** Filter users with/without email */
  hasEmail?: InputMaybe<Scalars['Boolean']['input']>;
  /** Number of items per page */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by login type */
  loginType?: InputMaybe<LoginTypeEnum>;
  /** Page number (1-based) */
  page?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by user role */
  role?: InputMaybe<UserRoleV2>;
  /** Search term for walletAddress, email, firstName, lastName */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Field to sort by (createdAt, updatedAt, firstName, lastName) */
  sortBy?: InputMaybe<Scalars['String']['input']>;
  /** Sort order (asc/desc) */
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};

export type WorkExperienceV2 = {
  __typename?: 'WorkExperienceV2';
  company?: Maybe<Scalars['String']['output']>;
  currentWork?: Maybe<Scalars['Boolean']['output']>;
  employmentType?: Maybe<Scalars['String']['output']>;
  endMonth?: Maybe<Scalars['String']['output']>;
  endYear?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  startMonth?: Maybe<Scalars['String']['output']>;
  startYear?: Maybe<Scalars['Int']['output']>;
  userId?: Maybe<Scalars['Int']['output']>;
};
