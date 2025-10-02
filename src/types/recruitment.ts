import { type LinkInput, type ProgramStatus } from './types.generated';

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
