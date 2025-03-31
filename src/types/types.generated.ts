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
  status?: Maybe<ApplicationStatus>;
};

export enum ApplicationStatus {
  Approved = 'approved',
  Completed = 'completed',
  Pending = 'pending',
  Rejected = 'rejected',
  Withdrawn = 'withdrawn'
}

export type CheckMilestoneInput = {
  id: Scalars['String']['input'];
  status: CheckMilestoneStatus;
};

export enum CheckMilestoneStatus {
  Completed = 'completed',
  Pending = 'pending'
}

export type CreateApplicationInput = {
  content: Scalars['String']['input'];
  links?: InputMaybe<Array<LinkInput>>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['String']['input'];
  programId: Scalars['String']['input'];
};

export type CreateMilestoneInput = {
  applicationId: Scalars['String']['input'];
  currency?: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  links?: InputMaybe<Array<LinkInput>>;
  price: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateProgramInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  deadline?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  keywords?: InputMaybe<Array<Scalars['ID']['input']>>;
  links?: InputMaybe<Array<LinkInput>>;
  name: Scalars['String']['input'];
  price?: InputMaybe<Scalars['String']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  validatorId: Scalars['ID']['input'];
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

export type LoginResponse = {
  __typename?: 'LoginResponse';
  token?: Maybe<Scalars['String']['output']>;
  userRoles?: Maybe<Array<Scalars['String']['output']>>;
};

export type Milestone = {
  __typename?: 'Milestone';
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  links?: Maybe<Array<Link>>;
  price?: Maybe<Scalars['String']['output']>;
  status?: Maybe<MilestoneStatus>;
  title?: Maybe<Scalars['String']['output']>;
};

export enum MilestoneStatus {
  Completed = 'completed',
  Failed = 'failed',
  Pending = 'pending',
  RevisionRequested = 'revision_requested'
}

export type Mutation = {
  __typename?: 'Mutation';
  approveApplication?: Maybe<Application>;
  checkMilestone?: Maybe<Milestone>;
  createApplication?: Maybe<Application>;
  createMilestones?: Maybe<Array<Milestone>>;
  createProgram?: Maybe<Program>;
  createUser?: Maybe<User>;
  deleteProgram?: Maybe<Scalars['Boolean']['output']>;
  deleteUser?: Maybe<User>;
  denyApplication?: Maybe<Application>;
  login?: Maybe<LoginResponse>;
  publishProgram?: Maybe<Program>;
  submitMilestone?: Maybe<Milestone>;
  updateApplication?: Maybe<Application>;
  updateMilestone?: Maybe<Milestone>;
  updateProgram?: Maybe<Program>;
  updateUser?: Maybe<User>;
};


export type MutationApproveApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCheckMilestoneArgs = {
  input: CheckMilestoneInput;
};


export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput;
};


export type MutationCreateMilestonesArgs = {
  input: Array<CreateMilestoneInput>;
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


export type MutationDenyApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  network?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
  walletId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationPublishProgramArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitMilestoneArgs = {
  input: SubmitMilestoneInput;
};


export type MutationUpdateApplicationArgs = {
  input: UpdateApplicationInput;
};


export type MutationUpdateMilestoneArgs = {
  input: UpdateMilestoneInput;
};


export type MutationUpdateProgramArgs = {
  input: UpdateProgramInput;
};


export type MutationUpdateUserArgs = {
  input: UserUpdateInput;
};

export type PaginatedApplications = {
  __typename?: 'PaginatedApplications';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Application>>;
};

export type PaginatedMilestones = {
  __typename?: 'PaginatedMilestones';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Milestone>>;
};

export type PaginatedPrograms = {
  __typename?: 'PaginatedPrograms';
  count?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Program>>;
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Program = {
  __typename?: 'Program';
  applications?: Maybe<Array<Application>>;
  creator?: Maybe<User>;
  currency?: Maybe<Scalars['String']['output']>;
  deadline?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keywords?: Maybe<Array<ProgramKeyword>>;
  links?: Maybe<Array<Link>>;
  name?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  validator?: Maybe<User>;
};

export type ProgramKeyword = {
  __typename?: 'ProgramKeyword';
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  application?: Maybe<Application>;
  applications?: Maybe<PaginatedApplications>;
  keywords?: Maybe<Array<ProgramKeyword>>;
  milestone?: Maybe<Milestone>;
  milestones?: Maybe<PaginatedMilestones>;
  program?: Maybe<Program>;
  programs?: Maybe<PaginatedPrograms>;
  roles?: Maybe<Array<Role>>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
  usersByRole?: Maybe<Array<User>>;
};


export type QueryApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryApplicationsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryMilestoneArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMilestonesArgs = {
  applicationId: Scalars['ID']['input'];
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


export type QueryUsersByRoleArgs = {
  role: Scalars['String']['input'];
};

export type Role = {
  __typename?: 'Role';
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type SubmitMilestoneInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  links?: InputMaybe<Array<LinkInput>>;
};

export type UpdateApplicationInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  links?: InputMaybe<Array<LinkInput>>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ApplicationStatus>;
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

export type UpdateProgramInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  deadline?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  keywords?: InputMaybe<Array<Scalars['ID']['input']>>;
  links?: InputMaybe<Array<LinkInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  validatorId?: InputMaybe<Scalars['ID']['input']>;
};

export type User = {
  __typename?: 'User';
  about?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  links?: Maybe<Array<Link>>;
  organizationName?: Maybe<Scalars['String']['output']>;
};

export type UserInput = {
  about?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  links?: InputMaybe<Array<LinkInput>>;
  organizationName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type UserUpdateInput = {
  about?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  links?: InputMaybe<Array<LinkInput>>;
  organizationName?: InputMaybe<Scalars['String']['input']>;
};
