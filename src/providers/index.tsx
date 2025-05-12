import client from "@/apollo/client";
import { useWagmiConfig } from "@/lib/wagmi";
import { AuthProvider } from "@/providers/auth-provider";
import { ApolloProvider } from "@apollo/client";
import { OnchainKitProvider } from "@coinbase/onchainkit";
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
                {children}
              </RainbowKitProvider>
            </OnchainKitProvider>
          </WagmiProvider>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default Providers;
