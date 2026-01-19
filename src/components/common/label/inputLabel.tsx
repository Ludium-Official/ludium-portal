import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';
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
  titleClassName,
  onChange,
  onKeyDown,
  disabled,
  isTextarea,
}) => {
  const isMobile = useIsMobile();

  return (
    <label htmlFor={labelId} className={cn('space-y-2 block', className, isMobile && 'w-full')}>
      {title && (
        <p className={`text-sm font-medium ${titleClassName}`}>
          {title}
          {isPrimary && <span className="ml-[2px] text-red-500">*</span>}
        </p>
      )}
      <div className={cn(inputWrapperClassName, isMobile && 'text-sm')}>
        {isTextarea ? (
          <Textarea
            disabled={disabled}
            id={labelId}
            placeholder={placeholder}
            className={cn(`h-10 ${inputClassName}`, isMobile && 'text-sm')}
            {...(register
              ? register(labelId, {
                  required: true,
                  onChange: onChange,
                })
              : {})}
          />
        ) : (
          <Input
            disabled={disabled}
            id={labelId}
            type={type}
            placeholder={placeholder}
            className={cn(`h-10 ${inputClassName}`, isMobile && 'text-sm')}
            onKeyDown={onKeyDown}
            {...(type === 'file' || !register
              ? { onChange }
              : register(labelId, {
                  required: true,
                  onChange: onChange,
                }))}
          />
        )}
        {children}
      </div>
      {isError && <span className="text-destructive text-sm block">{title} is required</span>}
    </label>
  );
};

export default InputLabel;
