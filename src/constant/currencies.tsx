import ArbitrumIcon from '@/assets/icons/crypto/arbitrum';
import BaseIcon from '@/assets/icons/crypto/base';
import EduIcon from '@/assets/icons/crypto/edu';

export const currencies = [
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
