import { Input } from '@/components/ui/input';
import { HTMLInputTypeAttribute } from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

interface InputLabelProps {
  labelId: string;
  title: string;
  isPrimary: boolean;
  isError?: FieldError | boolean;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  register?: UseFormRegister<any>;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  children?: any;
}

const InputLabel: React.FC<InputLabelProps> = ({
  labelId,
  title,
  isPrimary = false,
  isError,
  placeholder,
  type = 'text',
  register,
  children,
  className,
  onChange,
  onKeyDown,
}) => {
  return (
    <label htmlFor={labelId} className={`space-y-2 block mb-10 ${className}`}>
      <p className="text-sm font-medium">
        {title}
        {isPrimary && <span className="ml-1 text-primary">*</span>}
      </p>
      <div>
        <Input
          id={labelId}
          type={type}
          placeholder={placeholder}
          className="h-10"
          onKeyDown={onKeyDown}
          {...(register
            ? register(labelId, {
                required: true,
                onChange: onChange,
              })
            : {})}
        />
        {children}
      </div>
      {isError && <span className="text-destructive text-sm block">{title} is required</span>}
    </label>
  );
};

export default InputLabel;
