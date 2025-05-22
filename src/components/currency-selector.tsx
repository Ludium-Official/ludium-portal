import EduIcon from '@/assets/icons/crypto/edu';
import EthIcon from '@/assets/icons/crypto/eth';
import UsdtIcon from '@/assets/icons/crypto/usdt';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';

export const currencies = [
  { code: 'EDU', icon: <EduIcon /> },
  { code: 'ETH', icon: <EthIcon /> },
  { code: 'USDT', icon: <UsdtIcon /> },
];

function CurrencySelector({
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
  const [selectedCurrency, setSelectedCurrency] = useState(value ?? 'ETH');

  useEffect(() => {
    onValueChange?.(selectedCurrency);
  }, [selectedCurrency]);

  useEffect(() => {
    value && value !== selectedCurrency && setSelectedCurrency(value);
  }, [value]);

  const currWithIcon = currencies.find((c) => c.code === selectedCurrency);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button className={className}>
          {currWithIcon?.icon} {currWithIcon?.code}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {currencies.map((c) => (
          <DropdownMenuItem onClick={() => setSelectedCurrency(c.code)} key={c.code}>
            {c.icon} {c.code}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CurrencySelector;
