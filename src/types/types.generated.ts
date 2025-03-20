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
  metadata?: Maybe<Scalars['JSON']['output']>;
  milestones?: Maybe<Array<Milestone>>;
  program?: Maybe<Program>;
  status?: Maybe<ApplicationStatus>;
};

export enum ApplicationStatus {
  Approved = 'approved',
  Completed = 'completed',
  Pending = 'pending',
  Rejected = 'rejected',
  Withdrawn = 'withdrawn'
}

export type CreateApplicationInput = {
  content: Scalars['String']['input'];
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  programId: Scalars['String']['input'];
};

export type CreateMilestoneInput = {
  applicationId: Scalars['String']['input'];
  currency?: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
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
  completed?: Maybe<Scalars['Boolean']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  price?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createApplication?: Maybe<Application>;
  createMilestone?: Maybe<Milestone>;
  createProgram?: Maybe<Program>;
  createUser?: Maybe<User>;
  deleteProgram?: Maybe<Scalars['Boolean']['output']>;
  deleteUser?: Maybe<User>;
  login?: Maybe<Scalars['String']['output']>;
  updateApplication?: Maybe<Application>;
  updateMilestone?: Maybe<Milestone>;
  updateProgram?: Maybe<Program>;
  updateUser?: Maybe<User>;
};


export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput;
};


export type MutationCreateMilestoneArgs = {
  input: CreateMilestoneInput;
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
  email: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationUpdateApplicationArgs = {
  id: Scalars['String']['input'];
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


export type ProgramKeywordsArgs = {
  id: Scalars['String']['input'];
};

export type ProgramKeyword = {
  __typename?: 'ProgramKeyword';
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  application?: Maybe<Array<Application>>;
  applications?: Maybe<PaginatedApplications>;
  milestone?: Maybe<Milestone>;
  milestones?: Maybe<PaginatedMilestones>;
  program?: Maybe<Program>;
  programs?: Maybe<PaginatedPrograms>;
  roles?: Maybe<Array<Role>>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
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

export type Role = {
  __typename?: 'Role';
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type UpdateApplicationInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMilestoneInput = {
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  price?: InputMaybe<Scalars['String']['input']>;
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
