import { Input } from '@/components/ui/input';
import type { InputLabelProps } from '@/types/input';

const InputLabel: React.FC<InputLabelProps> = ({
  labelId,
  title,
  isPrimary = false,
  isError,
  placeholder,
  type = 'text',
  register,
  children,
  inputWrapperClassName,
  inputClassName,
  className,
  onChange,
  onKeyDown,
  disabled,
}) => {
  return (
    <label htmlFor={labelId} className={`space-y-2 block ${className}`}>
      {title && (
        <p className="text-sm font-medium">
          {title}
          {isPrimary && <span className="ml-1 text-primary">*</span>}
        </p>
      )}
      <div className={inputWrapperClassName}>
        <Input
          disabled={disabled}
          id={labelId}
          type={type}
          placeholder={placeholder}
          className={`h-10 ${inputClassName}`}
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
