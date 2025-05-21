import client from "@/apollo/client";
import { AuthProvider } from "@/providers/auth-provider";
import { ApolloProvider } from "@apollo/client";
import { PrivyProvider } from "@privy-io/react-auth";
import { BrowserRouter } from "react-router";
import { base, baseSepolia, eduChain, eduChainTestnet } from "viem/chains";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <PrivyProvider
            appId={import.meta.env.VITE_PRIVY_APP_ID}
            config={{
              defaultChain: baseSepolia,
              supportedChains: [baseSepolia, base, eduChain, eduChainTestnet],
              embeddedWallets: {
                createOnLogin: "all-users",
              },
              loginMethods: ["farcaster", "google"],
            }}
          >
            {children}
          </PrivyProvider>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default Providers;
