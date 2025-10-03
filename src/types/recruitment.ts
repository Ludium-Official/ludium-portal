import { Control, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import type { LinkInput, ProgramStatus } from './types.generated';
import { LabelValueProps, VisibilityProps } from './common';

export interface ProgramFormData {
  id?: string;
  programName: string;
  price?: string;
  description: string;
  summary: string;
  currency: string;
  deadline?: Date;
  keywords: string[];
  links?: LinkInput[] | string[];
  network?: string;
  validators: string[];
  image?: File;
  visibility?: VisibilityProps;
  builders?: string[];
  status?: ProgramStatus;
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
