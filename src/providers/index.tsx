import client from "@/apollo/client";
import { useWagmiConfig } from "@/lib/wagmi";
import { AuthProvider } from "@/providers/auth-provider";
import { ApolloProvider } from "@apollo/client";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { PrivyProvider } from "@privy-io/react-auth";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { BrowserRouter } from "react-router";
import { WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";

function Providers({ children }: { children: React.ReactNode }) {
  const wagmiConfig = useWagmiConfig();

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <WagmiProvider config={wagmiConfig}>
            <OnchainKitProvider
              apiKey={import.meta.env.VITE_PUBLIC_ONCHAINKIT_API_KEY}
              projectId={import.meta.env.VITE_PUBLIC_CDP_PROJECT_ID}
              config={{
                paymaster: import.meta.env
                  .VITE_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT,
              }}
              chain={baseSepolia}
            >
              <RainbowKitProvider modalSize="compact">
                <PrivyProvider
                  appId="cmare6bts00k6le0l9n3qr8hl"
                  clientId="client-WY6LKBzKgt7WLgXufJE6wLHyENUq5eTDoeqtE5vXbdKrG"
                  config={{
                    appearance: { walletList: ["coinbase_wallet"] },
                    externalWallets: {
                      coinbaseWallet: {
                        connectionOptions: "smartWalletOnly",
                      },
                    },
                    loginMethods: ["farcaster", "google", "wallet"],
                    embeddedWallets: {
                      createOnLogin: "all-users",
                    },
                    defaultChain: baseSepolia,
                  }}
                >
                  {children}
                </PrivyProvider>
              </RainbowKitProvider>
            </OnchainKitProvider>
          </WagmiProvider>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default Providers;
