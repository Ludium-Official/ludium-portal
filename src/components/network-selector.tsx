import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getNetworkDisplayName, getNetworkIcon } from '@/constant/network-icons';
import type { NetworkWithTokens } from '@/contexts/networks-context';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

function NetworkSelector({
  className,
  value,
  onValueChange,
  disabled,
  networks = [],
  loading = false,
}: {
  className: string;
  value?: string | null;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  networks?: NetworkWithTokens[];
  loading?: boolean;
}) {
  const [selectedNetworkId, setSelectedNetworkId] = useState(value);

  // Sync with parent value only when it actually changes
  useEffect(() => {
    if (value !== undefined && value !== null && String(value) !== String(selectedNetworkId)) {
      setSelectedNetworkId(value);
    }
  }, [value]);

  // Set default network based on environment (only once when networks load)
  useEffect(() => {
    if (
      (!value || value === '0') &&
      (!selectedNetworkId || selectedNetworkId === '0') &&
      networks &&
      networks.length > 0
    ) {
      const isMainnet = import.meta.env.VITE_VERCEL_ENVIRONMENT === 'mainnet';
      const defaultNetwork = networks.find((network) =>
        isMainnet
          ? network.chainName.toLowerCase().includes('educhain') && network.mainnet
          : network.chainName.toLowerCase().includes('educhain') && !network.mainnet,
      );

      if (defaultNetwork) {
        onValueChange?.(defaultNetwork.id);
      }
    }
  }, [networks]);

  const selectedNetwork = networks?.find((n) => n.id === selectedNetworkId);

  const filteredNetworks = networks?.filter((network) => {
    if (import.meta.env.VITE_VERCEL_ENVIRONMENT === 'mainnet') {
      return network.mainnet;
    }
    return !network.mainnet;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled || loading}>
        <Button className={`${className} hover:bg-white`}>
          <span className="flex items-center gap-2">
            {loading ? (
              'Loading...'
            ) : selectedNetwork ? (
              <>
                {getNetworkIcon(selectedNetwork.chainName)}
                {getNetworkDisplayName(selectedNetwork.chainName)}
              </>
            ) : (
              'Select Network'
            )}
          </span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {filteredNetworks?.map((network) => (
          <DropdownMenuItem
            key={network.id}
            onClick={() => {
              onValueChange?.(network.id);
            }}
          >
            <span className="flex items-center gap-2">
              {getNetworkIcon(network.chainName)}
              {getNetworkDisplayName(network.chainName)}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NetworkSelector;
