import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { InputLabelProps } from "@/types/input";

const InputLabel: React.FC<InputLabelProps> = ({
  labelId,
  title,
  isPrimary = false,
  isError,
  placeholder,
  type = "text",
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
  return (
    <label htmlFor={labelId} className={`space-y-3 block ${className}`}>
      {title && (
        <p className={`text-sm font-medium ${titleClassName}`}>
          {title}
          {isPrimary && <span className="ml-1 text-primary">*</span>}
        </p>
      )}
      <div className={inputWrapperClassName}>
        {isTextarea ? (
          <Textarea
            disabled={disabled}
            id={labelId}
            placeholder={placeholder}
            className={`h-10 ${inputClassName}`}
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
            className={`h-10 ${inputClassName}`}
            onKeyDown={onKeyDown}
            {...(type === "file" || !register
              ? { onChange }
              : register(labelId, {
                  required: true,
                  onChange: onChange,
                }))}
          />
        )}
        {children}
      </div>
      {isError && (
        <span className="text-destructive text-sm block">
          {title} is required
        </span>
      )}
    </label>
  );
};

export default InputLabel;
