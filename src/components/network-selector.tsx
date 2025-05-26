// import EtcIcon from "@/assets/icons/crypto/etc"
import BaseIcon from "@/assets/icons/crypto/base";
import EduIcon from "@/assets/icons/crypto/edu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export const currencies = [
  {
    code: "educhain",
    icon: <EduIcon />,
    display: "EDUChain",
    isTestnet: false,
  },
  {
    code: "educhain-testnet",
    icon: <EduIcon />,
    display: "EDUChain Testnet",
    isTestnet: true,
  },
  { code: "base", icon: <BaseIcon />, display: "Base", isTestnet: false },
  {
    code: "base-sepolia",
    icon: <BaseIcon />,
    display: "Base Sepolia",
    isTestnet: true,
  },
];

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
  const [selectedCurrency, setSelectedCurrency] = useState(value ?? "educhain");

  useEffect(() => {
    onValueChange?.(selectedCurrency);
  }, [selectedCurrency]);

  useEffect(() => {
    value && value !== selectedCurrency && setSelectedCurrency(value);
  }, [value]);

  const currWithIcon = currencies.find((c) => c.code === selectedCurrency);
  const separateCurrencies = currencies.filter((currency) => {
    if (import.meta.env.VITE_VERCEL_ENVIRONMENT === "mainnet") {
      return !currency.isTestnet;
    }

    return currency;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button className={className}>
          {currWithIcon?.icon} {currWithIcon?.display}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {separateCurrencies.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => setSelectedCurrency(c.code)}
          >
            {c.icon} {c.display}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NetworkSelector;
