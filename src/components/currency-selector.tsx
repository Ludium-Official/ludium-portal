import BtcIcon from "@/assets/icons/crypto/btc"
import EtcIcon from "@/assets/icons/crypto/etc"
import EthIcon from "@/assets/icons/crypto/eth"
import UsdtIcon from "@/assets/icons/crypto/usdt"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export const currencies = [
  { code: 'ETH', icon: <EthIcon /> },
  { code: 'ETC', icon: <EtcIcon /> },
  { code: 'USDT', icon: <UsdtIcon /> },
  { code: 'BTC', icon: <BtcIcon /> },
]

function CurrencySelector({ className, value, onValueChange, disabled }: { className: string, value?: string | null, onValueChange?: (value: string) => void, disabled?: boolean }) {

  const [selectedCurrency, setSelectedCurrency] = useState(value ?? 'ETH')

  useEffect(() => {
    onValueChange?.(selectedCurrency)
  }, [selectedCurrency])

  useEffect(() => {
    value && value !== selectedCurrency && setSelectedCurrency(value)
  }, [value])

  const currWithIcon = currencies.find(c => c.code === selectedCurrency);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}><Button className={className}>{currWithIcon?.icon} {currWithIcon?.code}</Button></DropdownMenuTrigger>
      <DropdownMenuContent>
        {currencies.map(c => (
          <DropdownMenuItem onClick={() => setSelectedCurrency(c.code)} key={c.code}>{c.icon} {c.code}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CurrencySelector