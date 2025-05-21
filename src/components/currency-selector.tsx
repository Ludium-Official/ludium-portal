// import EtcIcon from "@/assets/icons/crypto/etc"
import EduIcon from "@/assets/icons/crypto/edu";
import EthIcon from "@/assets/icons/crypto/eth";
import UsdtIcon from "@/assets/icons/crypto/usdt";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useMemo, useState } from "react";

export const eduCurrencies = [
  { code: "EDU", icon: <EduIcon /> },
  { code: "ETH", icon: <EthIcon /> },
  { code: "USDT", icon: <UsdtIcon /> },
];

export const baseCurrencies = [
  { code: "ETH", icon: <EthIcon /> },
  { code: "USDT", icon: <UsdtIcon /> },
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
  const [selectedCurrency, setSelectedCurrency] = useState(value ?? "ETH");

  const displayCurrencies = useMemo(() => {
    if (network === "base" || network === "base-sepolia") {
      return baseCurrencies;
    }

    return eduCurrencies;
  }, [network]);

  useEffect(() => {
    onValueChange?.(selectedCurrency);
  }, [selectedCurrency]);

  useEffect(() => {
    value && value !== selectedCurrency && setSelectedCurrency(value);
  }, [value]);

  const currWithIcon = displayCurrencies.find(
    (c) => c.code === selectedCurrency
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button className={className}>
          {currWithIcon?.icon} {currWithIcon?.code}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {displayCurrencies.map((c) => (
          <DropdownMenuItem
            onClick={() => setSelectedCurrency(c.code)}
            key={c.code}
          >
            {c.icon} {c.code}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CurrencySelector;
