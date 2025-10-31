import type { Control, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import type { LabelValueProps, VisibilityProps } from './common';
import type { ProgramStatusV2 } from './types.generated';

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
  txResult?: {
    txHash: `0x${string}`;
    programId: number | null;
  };
  contractId?: string;
  invitedMembers?: string[];
}

export type OnSubmitProgramFunc = (data: ProgramFormData) => void;

export interface RecruitmentFormProps {
  isEdit?: boolean;
  onSubmitProgram: OnSubmitProgramFunc;
  createLoading?: boolean;
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
  firstName?: string | null;
  lastName?: string | null;
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
  sponser?: builderProps;
}

export interface RecruitmentApplicant {
  id: string;
  appliedDate?: string;
  picked?: boolean;
  userInfo: {
    userId?: string | null;
    image?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    summary?: string | null;
    location?: string | null;
    hourlyRate?: string | null;
    star?: string | null;
    role?: string | null;
    skills?: string[] | null;
    tools?: string[] | null;
  };
}
