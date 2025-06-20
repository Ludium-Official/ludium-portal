import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { currencies } from '@/constant/currencies';
import { getCurrency, mainnetDefaultNetwork } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

function NetworkSelector({
  className,
  value,
  onValueChange,
  disabled,
}: {
  className: string;
  value?: string | null;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}) {
  const [selectedCurrency, setSelectedCurrency] = useState(value || mainnetDefaultNetwork);

  useEffect(() => {
    onValueChange?.(selectedCurrency);
  }, [selectedCurrency]);

  useEffect(() => {
    value && value !== selectedCurrency && setSelectedCurrency(value);
  }, [value]);

  const currWithIcon = getCurrency(selectedCurrency);
  const separateCurrencies = currencies.filter((currency) => {
    if (import.meta.env.VITE_VERCEL_ENVIRONMENT === 'mainnet') {
      return !currency.isTestnet;
    }

    return currency.isTestnet;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button className={className}>
          <span className='flex items-center gap-2'>
            {currWithIcon?.icon} {currWithIcon?.display}
          </span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {separateCurrencies.map((c) => (
          <DropdownMenuItem key={c.code} onClick={() => setSelectedCurrency(c.code)}>
            {c.icon} {c.display}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NetworkSelector;
