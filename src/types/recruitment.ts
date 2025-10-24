import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import type { RecruitmentStatus } from "./types.generated";
import { LabelValueProps, VisibilityProps } from "./common";

export interface ProgramFormData {
  id?: string;
  programTitle: string;
  price?: string;
  description: string;
  currency: string;
  deadline?: Date;
  skills: string[];
  network?: string;
  visibility?: VisibilityProps;
  builders?: string[];
  status?: RecruitmentStatus;
  budget?: string;
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
  setSelectedValidatorItems: React.Dispatch<
    React.SetStateAction<LabelValueProps[]>
  >;
  selectedImage?: File;
  isEdit?: boolean;
  control: Control<ProgramFormData, any, any>;
}

export interface ProgramDetailProps extends programFormProps {
  description: string;
}

export interface builderProps {
  first_name?: string | null;
  last_name?: string | null;
  wallet_address?: string;
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
