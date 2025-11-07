import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getTokenIcon } from '@/constant/network-icons';
import type { TokenInfo } from '@/contexts/networks-context';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

function CurrencySelector({
  className,
  value,
  onValueChange,
  tokens,
  disabled,
}: {
  className: string;
  value?: string | null;
  onValueChange?: (value: string) => void;
  tokens: TokenInfo[];
  disabled?: boolean;
}) {
  const [selectedTokenId, setSelectedTokenId] = useState(value ?? '');

  useEffect(() => {
    if (value !== undefined && value !== null && String(value) !== String(selectedTokenId)) {
      setSelectedTokenId(value);
    }
  }, [value]);

  useEffect(() => {
    if (tokens.length > 0) {
      const isValid = tokens.some((t) => t.id === selectedTokenId);
      if (!isValid) {
        const nativeToken = tokens.find((t) => t.tokenAddress === ethers.constants.AddressZero);

        const defaultToken = nativeToken || tokens[0];
        onValueChange?.(defaultToken.id);
      }
    }
  }, [tokens]);

  const selectedToken = tokens.find((t) => t.id === selectedTokenId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled || tokens.length === 0}>
        <Button className={className}>
          {selectedToken ? (
            <>
              {getTokenIcon(selectedToken.tokenName)} {selectedToken.tokenName}
            </>
          ) : (
            'Select Token'
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
        {tokens.map((token) => (
          <DropdownMenuItem
            key={token.id}
            onClick={() => {
              onValueChange?.(token.id);
            }}
          >
            <span className="flex items-center gap-2">
              {getTokenIcon(token.tokenName)} {token.tokenName}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CurrencySelector;
