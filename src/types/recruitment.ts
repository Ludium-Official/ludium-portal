import type { Control, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import type { LabelValueProps, VisibilityProps } from './common';
import type {
  ApplicationStatusV2,
  ContractV2,
  MilestoneV2,
  ProgramStatusV2,
  UserV2,
} from './types.generated';

export interface ProgramFormData {
  id?: string;
  title: string;
  description: string;
  skills: string[];
  deadline?: Date;
  visibility: VisibilityProps;
  networkId: number;
  price: string;
  token_id: number;
  status?: ProgramStatusV2;
  pastStatus?: ProgramStatusV2;
  txResult?: {
    txHash: `0x${string}`;
    programId: number | null;
  };
  contractId?: string;
  invitedMembers?: string[];
}

export type OnSubmitProgramFunc = (data: ProgramFormData) => void;

export interface ProgramFormRef {
  submitDraft: () => void;
  submitPublish: () => void;
}

export interface RecruitmentFormProps {
  isEdit?: boolean;
  onSubmitProgram: OnSubmitProgramFunc;
  createLoading?: boolean;
  formRef?: React.RefObject<ProgramFormRef | null>;
}

export interface programFormProps {
  register: UseFormRegister<ProgramFormData>;
  errors: FieldErrors<ProgramFormData>;
  setValue: UseFormSetValue<ProgramFormData>;
}
export interface ProgramOverviewProps extends programFormProps {
  keywords: string[];
  imageError: string | null;
  setImageError: React.Dispatch<React.SetStateAction<string | null>>;
  network?: string;
  currency: string;
  deadline?: Date;
  validators: string[];
  selectedValidatorItems: LabelValueProps[];
  setSelectedValidatorItems: React.Dispatch<React.SetStateAction<LabelValueProps[]>>;
  selectedImage?: File;
  isEdit?: boolean;
  control: Control<ProgramFormData, any, any>;
}

export interface ProgramDetailProps extends programFormProps {
  description: string;
}

export interface builderProps {
  nickname?: string | null;
  walletAddress?: string;
  image?: string | null;
  email?: string | null;
}

export interface RecruitmentProgram {
  id: string;
  title?: string;
  description?: string;
  skills?: string[];
  deadline?: string;
  createdAt?: string;
  budgetType?: string;
  network?: string | null;
  price?: string | null;
  currency?: string | null;
  visibility?: string;
  builders?: builderProps[];
  status?: string;
  applicantCount?: string;
  sponsor?: builderProps;
}

export interface RecruitmentApplicant {
  id: string;
  appliedDate?: string;
  picked?: boolean;
  chatroomMessageId?: string | null;
  applicationId?: string | null;
  programId?: string | null;
  userInfo: {
    userId?: string | null;
    image?: string | null;
    nickname?: string | null;
    email?: string | null;
    cv?: string | null;
    location?: string | null;
    hourlyRate?: string | null;
    star?: string | null;
    role?: string | null;
    skills?: string[] | null;
    tools?: string[] | null;
  };
}

export interface ContractInformation {
  programInfo: {
    id: string;
    title: string;
    sponsor: UserV2 | null;
    networkId: number | null;
    tokenId: string | null;
    price: string | null;
    deadline?: string | null;
  };
  applicationInfo: {
    id: string;
    applicant: UserV2 | null;
    status: ApplicationStatusV2 | null;
    chatRoomId: string | null;
  };
  contractSnapshot?: ContractV2 | null;
}

export interface ContractFormProps {
  programTitle: string;
  milestones: MilestoneV2[];
  sponsor: UserV2;
  applicant: UserV2;
  totalPrice: number;
  tokenId: number | null;
}

export interface MilestoneCardProps {
  milestone: MilestoneV2 & { isCompleted?: boolean };
  onClick: (milestone: MilestoneV2) => void;
  isCompleted?: boolean;
}

export interface ApplicationSidebarProps {
  activeMilestones: MilestoneV2[];
  completedMilestones: MilestoneV2[];
  files: any[];
  contracts: any[];
  isSponsor: boolean;
  isHandleMakeNewMilestone: boolean;
  onMilestoneClick: (milestone: MilestoneV2) => void;
  onNewMilestoneClick: () => void;
  onContractClick: (contract: any) => void;
}

export interface MilestoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMilestone: MilestoneV2 | null;
  setSelectedMilestone: (milestone: MilestoneV2 | null) => void;
  isNewMilestoneMode: boolean;
  setIsNewMilestoneMode: (mode: boolean) => void;
  activeMilestones: MilestoneV2[];
  completedMilestones: MilestoneV2[];
  onRefetch: () => void;
  isSponsor: boolean;
  isHandleMakeNewMilestone: boolean;
  contractInformation: ContractInformation;
  existingContract?: {
    onchainContractId?: number | null;
    applicantId?: number | null;
  } | null;
  onchainProgramId?: number | null;
  allApplicationsData?: any;
  contract?: any;
  tokenDecimals?: number;
}
