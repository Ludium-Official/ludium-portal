import ArbitrumIcon from "@/assets/icons/crypto/arbitrum";
import BaseIcon from "@/assets/icons/crypto/base";
import CreditCoinIcon from "@/assets/icons/crypto/creditcoin";
import EduChainIcon from "@/assets/icons/crypto/edu";
import EthIcon from "@/assets/icons/crypto/eth";
import UsdcIcon from "@/assets/icons/crypto/usdc";
import UsdtIcon from "@/assets/icons/crypto/usdt";

export const networkIcons: Record<string, React.ReactNode> = {
  base: <BaseIcon size={20} />,
  "base-sepolia": <BaseIcon size={20} />,
  arbitrum: <ArbitrumIcon size={20} />,
  "arbitrum-sepolia": <ArbitrumIcon size={20} />,
  educhain: <EduChainIcon size={20} />,
  "educhain-testnet": <EduChainIcon size={20} />,
  creditcoin: <CreditCoinIcon size={20} />,
};

export const tokenIcons: Record<string, React.ReactNode> = {
  USDT: (
    <span className="text-green-600">
      <UsdtIcon size={20} />
    </span>
  ),
  USDC: (
    <span className="text-blue-600">
      <UsdcIcon size={20} />
    </span>
  ),
  EDU: <EduChainIcon size={20} />,
  ETH: (
    <span>
      <EthIcon size={20} />
    </span>
  ),
};

export function getNetworkIcon(chainName: string): React.ReactNode {
  // Try to match by chainName (e.g., "Base", "Arbitrum")
  const lowerName = chainName.toLowerCase();

  if (lowerName.includes("base")) return networkIcons["base"];
  if (lowerName.includes("arbitrum")) return networkIcons["arbitrum"];
  if (lowerName.includes("edu")) return networkIcons["educhain"];
  if (lowerName.includes("credit")) return networkIcons["creditcoin"];

  return null;
}

export function getTokenIcon(tokenName: string): React.ReactNode {
  return tokenIcons[tokenName] || null;
}

export function getNetworkDisplayName(chainName: string): string {
  const lowerName = chainName.toLowerCase();

  if (lowerName === "educhain-testnet" || lowerName === "educhain testnet") {
    return "EduChain Testnet";
  }
  if (lowerName === "educhain") {
    return "EduChain";
  }
  if (lowerName === "arbitrum-sepolia" || lowerName === "arbitrum sepolia") {
    return "Arbitrum Sepolia";
  }
  if (lowerName === "arbitrum") {
    return "Arbitrum";
  }
  if (lowerName === "base-sepolia" || lowerName === "base sepolia") {
    return "Base Sepolia";
  }
  if (lowerName === "base") {
    return "Base";
  }
  if (lowerName === "creditcoin") {
    return "Creditcoin";
  }

  return chainName
    .split(/[-\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
