export interface WalletBalance {
  name: string;
  amount: bigint | null;
  decimal: number;
}

export interface WalletCardProps {
  className?: string;
}
