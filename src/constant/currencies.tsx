import ArbitrumIcon from "@/assets/icons/crypto/arbitrum";
import BaseIcon from "@/assets/icons/crypto/base";
import CoreDaoIcon from "@/assets/icons/crypto/coredao";
import EduIcon from "@/assets/icons/crypto/edu";

import EthIcon from "@/assets/icons/crypto/eth";
import UsdcIcon from "@/assets/icons/crypto/usdc";
import UsdtIcon from "@/assets/icons/crypto/usdt";

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
  {
    code: "arbitrum",
    icon: <ArbitrumIcon />,
    display: "Arbitrum",
    isTestnet: false,
  },
  {
    code: "arbitrum-sepolia",
    icon: <ArbitrumIcon />,
    display: "Arbitrum Sepolia",
    isTestnet: true,
  },
  {
    code: "coredao",
    icon: <CoreDaoIcon />,
    display: "CoreDAO",
    isTestnet: false,
  },
  {
    code: "coredao-testnet",
    icon: <CoreDaoIcon />,
    display: "CoreDAO Testnet",
    isTestnet: true,
  },
];

export const currencyIcons = {
  EDU: <EduIcon />,
  USDT: <UsdtIcon />,
  USDC: <UsdcIcon />,
  ETH: <EthIcon />,
};
