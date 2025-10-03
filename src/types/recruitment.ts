import { Control, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import type { LinkInput, ProgramStatus } from './types.generated';
import { FormValues } from '@/components/program/program-form/program-form';
import { LabelValueProps } from './common';

export interface ProgramFormData {
  id?: string;
  programName: string;
  price?: string;
  description: string;
  summary: string;
  currency: string;
  deadline?: string;
  keywords: string[];
  links?: LinkInput[];
  network: string;
  validators: string[];
  image?: File;
  visibility: 'public' | 'restricted' | 'private';
  builders?: string[];
  status: ProgramStatus;
}

export type OnSubmitProgramFunc = (data: ProgramFormData) => void;

export interface RecruitmentFormProps {
  isEdit?: boolean;
  onSubmitProgram: OnSubmitProgramFunc;
  createLoading?: boolean;
}

export interface ProgramOverviewProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  extraErrors: {
    keyword: boolean;
    deadline: boolean;
    validator: boolean;
    links: boolean;
    invalidLink: boolean;
  };
  keywords: string[];
  setValue: UseFormSetValue<FormValues>;
  imageError: string | null;
  setImageError: React.Dispatch<React.SetStateAction<string | null>>;
  network?: string;
  setNetwork: React.Dispatch<React.SetStateAction<string | undefined>>;
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  deadline?: Date;
  setDeadline: React.Dispatch<React.SetStateAction<Date | undefined>>;
  selectedValidators: string[];
  setSelectedValidators: React.Dispatch<React.SetStateAction<string[]>>;
  selectedValidatorItems: LabelValueProps[];
  setSelectedValidatorItems: React.Dispatch<React.SetStateAction<LabelValueProps[]>>;
  selectedImage?: File;
  isEdit?: boolean;
  control: Control<FormValues, any, FormValues>;
}
