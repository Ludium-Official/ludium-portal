import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { coinbaseWallet } from "@rainbow-me/rainbowkit/wallets";
import { useMemo } from "react";
import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";

export function useWagmiConfig() {
  const projectId = import.meta.env.VITE_PUBLIC_CDP_PROJECT_ID ?? "";
  if (!projectId) {
    const providerErrMessage =
      "To connect to all Wallets you need to provide a VITE_PUBLIC_CDP_PROJECT_ID env variable";
    throw new Error(providerErrMessage);
  }

  return useMemo(() => {
    const connectors = connectorsForWallets(
      [
        {
          groupName: "Recommended Wallet",
          wallets: [coinbaseWallet],
        },
      ],
      {
        appName: "Ludium",
        projectId,
      }
    );

    const wagmiConfig = createConfig({
      chains: [base, baseSepolia],
      multiInjectedProviderDiscovery: false,
      connectors,
      ssr: true,
      transports: {
        [base.id]: http(),
        [baseSepolia.id]: http(),
      },
    });

    return wagmiConfig;
  }, [projectId]);
}
