import client from '@/apollo/client';
import { AuthProvider } from '@/providers/auth-provider';
import { ApolloProvider } from '@apollo/client';
import { PrivyProvider } from '@privy-io/react-auth';
import { SmartWalletsProvider } from '@privy-io/react-auth/smart-wallets';
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

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <PrivyProvider
            appId={import.meta.env.VITE_PRIVY_APP_ID}
            config={{
              defaultChain: baseSepolia,
              supportedChains: [
                baseSepolia,
                base,
                eduChain,
                eduChainTestnet,
                arbitrum,
                arbitrumSepolia,
                sepolia,
                creditCoin3Mainnet,
              ],
              embeddedWallets: {
                createOnLogin: 'users-without-wallets',
              },
              loginMethods: ['farcaster', 'google', 'wallet'],
              externalWallets: {
                walletConnect: { enabled: true },
              },
              appearance: {
                walletList: ['metamask', 'coinbase_wallet'],
              },
            }}
          >
            <SmartWalletsProvider>{children}</SmartWalletsProvider>
          </PrivyProvider>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default Providers;
