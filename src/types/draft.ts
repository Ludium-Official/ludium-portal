import type { LabelValueProps, VisibilityProps } from '@/types/common';

// Investment Draft Types
export type InvestmentDraft = {
  programName?: string;
  price?: string;
  description?: string;
  summary?: string;
  currency?: string;
  deadline?: string; // yyyy-MM-dd
  keywords?: string[];
  validators?: string[];
  selectedValidatorItems?: Array<LabelValueProps>;
  links?: string[];
  network?: string;
  visibility?: VisibilityProps;
  builders?: string[];
  selectedBuilderItems?: Array<LabelValueProps>;
  applicationStartDate?: string;
  applicationEndDate?: string;
  fundingStartDate?: string;
  fundingEndDate?: string;
  fundingCondition?: 'open' | 'tier';
  tierSettings?: {
    bronze?: { enabled: boolean; maxAmount: string };
    silver?: { enabled: boolean; maxAmount: string };
    gold?: { enabled: boolean; maxAmount: string };
    platinum?: { enabled: boolean; maxAmount: string };
  };
  feeType?: 'default' | 'custom';
  customFee?: string;
};

// Program Draft Types
export type ProgramDraft = {
  programTitle?: string;
  price?: string;
  description?: string;
  currency?: string;
  deadline?: Date;
  skills?: string[];
  selectedSkillItems?: Array<LabelValueProps>;
  links?: string[];
  network?: string;
  visibility?: VisibilityProps;
  builders?: string[];
  selectedBuilderItems?: Array<LabelValueProps>;
  budget?: string;
};

// Project Draft Types
export interface ProjectTerm {
  id: number;
  title: string;
  prize: string;
  purchaseLimit: string;
  description: string;
}

export interface ProjectMilestone {
  id: number;
  title: string;
  payoutPercentage: string;
  endDate: Date | undefined;
  summary: string;
  description: string;
}

export type ProjectDraft = {
  name?: string;
  fundingToBeRaised?: string;
  description?: string;
  summary?: string;
  links?: string[];
  visibility?: VisibilityProps;
  builders?: string[];
  selectedBuilderItems?: Array<{ label: string; value: string }>;
  supporterTierConfirmed?: boolean;
  terms?: ProjectTerm[];
  milestones?: ProjectMilestone[];
};

// Application Draft Types
export type ApplicationDraft = {
  overview: {
    name: string;
    links: string[];
    price: string;
  };
  description: {
    summary: string;
    content: string;
  };
  milestones: Array<{
    title: string;
    price: string;
    deadline: string; // yyyy-MM-dd
    summary: string;
    description: string;
  }>;
};
