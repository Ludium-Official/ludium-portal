import type { HTMLInputTypeAttribute, ReactNode } from 'react';
import type { Control, FieldError, UseFormRegister } from 'react-hook-form';

export interface InputLabelProps {
  labelId: string;
  title?: string;
  subTitle?: string;
  isPrimary?: boolean;
  isError?: FieldError | boolean;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  register?: UseFormRegister<any>;
  control?: Control<any>;
  className?: string;
  titleClassName?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  disabled?: boolean;
  isTextarea?: boolean;
}

export interface handleImageProps {
  file?: File;
  setImageError: (value: string | null) => void;
  setValue: (name: 'image', value: File | undefined) => void;
}
