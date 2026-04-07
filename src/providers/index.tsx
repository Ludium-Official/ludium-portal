import client from '@/apollo/client';
import { NetworksProvider } from '@/contexts/networks-context';
import { AuthProvider } from '@/providers/auth-provider';
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { BrowserRouter } from 'react-router';
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  creditCoin3Mainnet,
  eduChain,
  eduChainTestnet,
  sepolia,
} from 'viem/chains';
import type { AppKitNetwork } from '@reown/appkit/networks';

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

const metadata = {
  name: 'Ludium',
  description: 'Ludium Portal',
  url: 'https://portal.ludium.world',
  icons: ['https://portal.ludium.world/favicon.ico'],
};

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  baseSepolia as AppKitNetwork,
  base as AppKitNetwork,
  eduChain as AppKitNetwork,
  eduChainTestnet as AppKitNetwork,
  arbitrum as AppKitNetwork,
  arbitrumSepolia as AppKitNetwork,
  sepolia as AppKitNetwork,
  creditCoin3Mainnet as AppKitNetwork,
];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false,
    socials: ['google', 'farcaster'],
    email: false,
  },
});

const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <NetworksProvider>{children}</NetworksProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default Providers;
