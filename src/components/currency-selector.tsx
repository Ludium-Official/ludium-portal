import EduIcon from '@/assets/icons/crypto/edu';
import EthIcon from '@/assets/icons/crypto/eth';
import UsdcIcon from '@/assets/icons/crypto/usdc';
import UsdtIcon from '@/assets/icons/crypto/usdt';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useMemo, useState } from 'react';

export const eduCurrencies = [
  { code: 'EDU', icon: <EduIcon /> },
  { code: 'USDT', icon: <UsdtIcon /> },
  { code: 'USDC', icon: <UsdcIcon /> },
];

export const baseCurrencies = [
  { code: 'ETH', icon: <EthIcon /> },
  { code: 'USDT', icon: <UsdtIcon /> },
  { code: 'USDC', icon: <UsdcIcon /> },
];

export const arbitrumCurrencies = [
  { code: 'ETH', icon: <EthIcon /> },
  { code: 'USDT', icon: <UsdtIcon /> },
  { code: 'USDC', icon: <UsdcIcon /> },
];

function CurrencySelector({
  className,
  value,
  onValueChange,
  network,
  disabled,
}: {
  className: string;
  value?: string | null;
  onValueChange?: (value: string) => void;
  network: string;
  disabled?: boolean;
}) {
  const [selectedCurrency, setSelectedCurrency] = useState(value ?? '');

  const displayCurrencies = useMemo(() => {
    if (network === 'base' || network === 'base-sepolia') {
      return baseCurrencies;
    }
    if (network === 'arbitrum' || network === 'arbitrum-sepolia') {
      return arbitrumCurrencies;
    }

    return eduCurrencies;
  }, [network]);

  useEffect(() => {
    onValueChange?.(selectedCurrency);
  }, [selectedCurrency]);

  useEffect(() => {
    setSelectedCurrency(displayCurrencies[0].code);
  }, [displayCurrencies]);

  const currWithIcon = displayCurrencies.find((c) => c.code === selectedCurrency);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button className={className}>
          {currWithIcon?.icon} {currWithIcon?.code}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {displayCurrencies.map((c) => (
          <DropdownMenuItem onClick={() => setSelectedCurrency(c.code)} key={c.code}>
            {c.icon} {c.code}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CurrencySelector;
