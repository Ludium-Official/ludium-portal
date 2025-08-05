import ArbitrumIcon from '@/assets/icons/crypto/arbitrum';
import BaseIcon from '@/assets/icons/crypto/base';
import EduIcon from '@/assets/icons/crypto/edu';

// Simple Ethereum icon component for Sepolia
const EthereumIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0L2 8L8 10.8L14 8L8 0Z" fill="#627EEA" />
    <path d="M8 10.8L2 8L8 16L14 8L8 10.8Z" fill="#627EEA" opacity="0.6" />
  </svg>
);

export const currencies = [
  {
    code: 'sepolia',
    icon: <EthereumIcon />,
    display: 'Sepolia',
    isTestnet: true,
  },
  {
    code: 'educhain',
    icon: <EduIcon />,
    display: 'EDUChain',
    isTestnet: false,
  },
  {
    code: 'educhain-testnet',
    icon: <EduIcon />,
    display: 'EDUChain Testnet',
    isTestnet: true,
  },
  { code: 'base', icon: <BaseIcon />, display: 'Base', isTestnet: false },
  {
    code: 'base-sepolia',
    icon: <BaseIcon />,
    display: 'Base Sepolia',
    isTestnet: true,
  },
  {
    code: 'arbitrum',
    icon: <ArbitrumIcon />,
    display: 'Arbitrum',
    isTestnet: false,
  },
  {
    code: 'arbitrum-sepolia',
    icon: <ArbitrumIcon />,
    display: 'Arbitrum Sepolia',
    isTestnet: true,
  },
];
