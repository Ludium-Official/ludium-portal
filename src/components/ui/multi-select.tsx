import { type VariantProps, cva } from 'class-variance-authority';
import { CheckIcon, ChevronDown, XIcon } from 'lucide-react';

import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
  'm-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300',
  {
    variants: {
      variant: {
        default: 'border-foreground/10 text-foreground bg-card hover:bg-card/80',
        secondary:
          'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        inverted: 'inverted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
  }[];

  defaultItems?: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void;

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;
  selectedItems?: {
    label: string;
    value: string;
  }[];
  setSelectedItems?: React.Dispatch<
    React.SetStateAction<
      {
        label: string;
        value: string;
      }[]
    >
  >;

  inputValue?: string;
  setInputValue?: React.Dispatch<React.SetStateAction<string | undefined>>;
  loading?: boolean;
  emptyText?: string;

  singleSelect?: boolean;
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      defaultItems = [],
      placeholder = 'Select options',
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      value,
      inputValue,
      setInputValue,
      loading,
      emptyText = 'No result found.',
      selectedItems,
      setSelectedItems,
      singleSelect = false,
      ...props
    },
    ref,
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    React.useEffect(() => {
      setSelectedValues(value as string[]);
    }, [value]);

    const toggleOption = (value: string, label: string) => {
      if (singleSelect) {
        const newSelectedValues = selectedValues?.includes(value)
          ? selectedValues.filter((val) => val !== value)
          : [value];
        setSelectedValues(newSelectedValues);
        setSelectedItems?.(newSelectedValues.map((val) => ({ value: val, label })));
        onValueChange(newSelectedValues);
        return;
      }
      const newSelectedValues = selectedValues?.includes(value)
        ? selectedValues.filter((val) => val !== value)
        : [...selectedValues, value];

      const newSelectedItems = selectedValues?.includes(value)
        ? selectedItems?.filter((val) => val.value !== value)
        : [...(selectedItems ?? []), { value, label }];
      setSelectedValues(newSelectedValues);
      setSelectedItems?.(newSelectedItems ?? []);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      setSelectedItems?.([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const toggleAll = () => {
      if (selectedValues?.length === options?.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        setSelectedValues(allValues);
        setSelectedItems?.(options);
        onValueChange(allValues);
      }
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              'flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-white hover:bg-inherit [&_svg]:pointer-events-auto',
              className,
            )}
          >
            {(selectedItems?.length ?? selectedValues.length) > 0 ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-wrap items-center">
                  {(selectedItems ?? selectedValues)?.slice(0, maxCount).map((item) => {
                    const option = !selectedItems?.length
                      ? options.find((o) => o.value === item)
                      : (item as {
                          label: string;
                          value: string;
                        });
                    // const IconComponent = option?.icon;
                    return (
                      <Badge
                        key={option?.value}
                        className={cn(multiSelectVariants({ variant }))}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {/* {IconComponent && <IconComponent className="h-4 w-4 mr-2" />} */}
                        {option?.label}
                      </Badge>
                    );
                  })}
                  {(selectedItems?.length ?? 0) > maxCount && (
                    <Badge
                      className={cn(
                        'bg-transparent text-foreground border-foreground/1 hover:bg-transparent',
                        multiSelectVariants({ variant }),
                      )}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      {`+ ${selectedValues?.length - maxCount} more`}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    className="h-4 mx-2 cursor-pointer text-muted-foreground"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClear();
                    }}
                  />
                  <Separator orientation="vertical" className="flex min-h-6 h-full" />
                  <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full mx-auto">
                <span className="text-sm text-muted-foreground mx-3">{placeholder}</span>
                <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command
            filter={(value, search) => {
              if (!search) return 1;
              if (selectedValues.includes(value)) return 1;
              const label = options.find((option) => option.value === value)?.label;
              return label?.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
            }}
          >
            <CommandInput
              value={inputValue}
              onValueChange={setInputValue}
              placeholder="Search..."
            />
            <CommandEmpty className="px-3 py-6 text-sm text-center">
              {loading ? 'Loading...' : emptyText}
            </CommandEmpty>
            <CommandList>
              <CommandGroup>
                {options?.length > 0 && !inputValue && (
                  <CommandItem key="all" onSelect={toggleAll} className="cursor-pointer">
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-gray-dark',
                        selectedValues?.length === options?.length
                          ? 'bg-gray-dark text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <span>(Select All)</span>
                  </CommandItem>
                )}

                {selectedItems
                  ?.filter((option) => {
                    if (!inputValue) return true;
                    return option?.label?.toLowerCase().includes(inputValue.toLowerCase());
                  })
                  .map((option) => {
                    // const option = options.find(o => o.value === opt)
                    // const isSelected = selectedValues?.includes(option.value);
                    return (
                      <CommandItem
                        value={option?.value}
                        key={option?.value}
                        onSelect={() => toggleOption(option?.value ?? '', option?.label ?? '')}
                        className="cursor-pointer"
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-gray-dark',
                            // isSelected
                            //   ?
                            'bg-gray-dark text-primary-foreground',
                            // :
                            // 'opacity-50 [&_svg]:invisible',
                          )}
                        >
                          <CheckIcon className="h-4 w-4" />
                        </div>
                        <span>{option?.label}</span>
                      </CommandItem>
                    );
                  })}
                {options
                  .filter((o) => !selectedValues.includes(o.value))
                  .map((option) => {
                    // const isSelected = selectedValues?.includes(option.value);
                    return (
                      <CommandItem
                        value={option.value}
                        key={option.value}
                        onSelect={() => toggleOption(option.value, option.label)}
                        className="cursor-pointer"
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-gray-dark',
                            // isSelected
                            // ? 'bg-gray-dark text-primary-foreground'
                            // :
                            'opacity-50 [&_svg]:invisible',
                          )}
                        >
                          <CheckIcon className="h-4 w-4" />
                        </div>
                        {option.icon && (
                          <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{option.label}</span>
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

MultiSelect.displayName = 'MultiSelect';
