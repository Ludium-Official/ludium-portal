'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { LabelValueProps } from '@/types/common';

interface SearchSelectProps {
  options: LabelValueProps[];
  placeholder?: string;
  value?: string;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  inputValue?: string;
  setInputValue?: React.Dispatch<React.SetStateAction<string | undefined>>;
  emptyText?: string;
  loading?: boolean;
}

export function SearchSelect({
  options,
  placeholder = 'Select',
  value,
  setValue,
  inputValue,
  setInputValue,
  emptyText = 'No result found.',
  loading,
}: SearchSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <Tag <select> doesn't fit the functionality, I need a button>
          role="combobox"
          aria-expanded={open}
          className="flex w-full h-10 justify-between "
        >
          {value ? (
            options.find((option) => option.value === value)?.label
          ) : (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full max-w-[586px] p-0">
        <Command
          filter={(value, search) => {
            if (!search) return 1;
            const label = options.find((option) => option.value === value)?.label;
            return label?.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput value={inputValue} onValueChange={setInputValue} placeholder="Search..." />
          <CommandList>
            <CommandEmpty className="p-4">{loading ? 'Loading...' : emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const value = options.find((option) => option.value === currentValue)?.value;
                    setValue(value ?? '');
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
