import { Input } from '@/components/ui/input';
import type { InputLabelProps } from '@/types/input';
import { useFieldArray } from 'react-hook-form';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

const MultipleInputLabel: React.FC<InputLabelProps> = ({
  labelId,
  title,
  subTitle,
  isPrimary = false,
  isError,
  placeholder,
  type = 'text',
  register,
  control,
  children,
  inputWrapperClassName,
  inputClassName,
  className,
  onChange,
  onKeyDown,
  disabled,
}) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: labelId,
  });

  useEffect(() => {
    if (fields.length === 0) {
      append('');
    }
  }, [fields.length, append]);

  return (
    <label htmlFor={labelId} className={`space-y-2 block ${className}`}>
      {title && (
        <p className="text-sm font-medium">
          {title}
          {isPrimary && <span className="ml-1 text-primary">*</span>}
        </p>
      )}
      {subTitle && <span className="block text-gray-text text-sm">{subTitle}</span>}
      <div className={`space-y-2 ${inputWrapperClassName}`}>
        {fields.map((field, idx) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              disabled={disabled}
              id={labelId}
              type={type}
              placeholder={placeholder}
              className={`h-10 ${inputClassName}`}
              onKeyDown={onKeyDown}
              {...(register
                ? register(`${labelId}.${idx}`, {
                    required: true,
                    onChange: onChange,
                  })
                : {})}
            />
            {idx !== 0 && <X className="cursor-pointer" onClick={() => remove(idx)} />}
          </div>
        ))}
        {children}
      </div>
      <Button
        onClick={() => append('')}
        type="button"
        variant="outline"
        size="sm"
        className="rounded-[6px]"
      >
        Add {title}
      </Button>
      {isError && <span className="text-destructive text-sm block">{title} is required</span>}
    </label>
  );
};

export default MultipleInputLabel;
