import { useNetworksV2Query } from "@/apollo/queries/networks-v2.generated";
import { useSmartContractsV2Query } from "@/apollo/queries/smart-contracts-v2.generated";
import { useTokensV2Query } from "@/apollo/queries/tokens-v2.generated";
import { createContext, useContext, useMemo, type ReactNode } from "react";

export type TokenInfo = {
  id: string;
  chainInfoId: number;
  tokenName: string;
  tokenAddress: string;
};

export type SmartContractInfo = {
  id: string;
  chainInfoId: number;
  address: string;
  name: string;
};

export type NetworkWithTokens = {
  id: string;
  chainId: number;
  chainName: string;
  mainnet: boolean;
  exploreUrl?: string | null;
  tokens: TokenInfo[];
};

interface NetworksContextType {
  networks: NetworkWithTokens[];
  contracts: SmartContractInfo[];
  loading: boolean;
  error: boolean;
  getNetworkById: (
    id: number | null | undefined
  ) => NetworkWithTokens | undefined;
  getTokenById: (id: number | null | undefined) =>
    | {
        id: string;
        chainInfoId: number;
        tokenName: string;
        tokenAddress: string;
      }
    | undefined;
  getContractByNetworkId: (
    networkId: number | null | undefined
  ) => SmartContractInfo | undefined;
}

const NetworksContext = createContext<NetworksContextType | undefined>(
  undefined
);

export function NetworksProvider({ children }: { children: ReactNode }) {
  const {
    data: networksData,
    loading: networksLoading,
    error: networksError,
  } = useNetworksV2Query();

  const {
    data: tokensData,
    loading: tokensLoading,
    error: tokensError,
  } = useTokensV2Query();

  const {
    data: contractsData,
    loading: contractsLoading,
    error: contractsError,
  } = useSmartContractsV2Query({
    variables: {
      pagination: { limit: 1000, offset: 0 },
    },
  });

  const networksWithTokens = useMemo<NetworkWithTokens[]>(() => {
    if (!networksData?.networksV2?.data || !tokensData?.tokensV2?.data) {
      return [];
    }

    const networks = networksData.networksV2.data;
    const tokens = tokensData.tokensV2.data;

    return networks
      .map((network) => {
        const networkTokens = tokens
          .filter((token) => token.chainInfoId === Number(network.id))
          .map((token) => ({
            id: token.id!,
            chainInfoId: token.chainInfoId!,
            tokenName: token.tokenName!,
            tokenAddress: token.tokenAddress!,
          }));

        return {
          id: network.id!,
          chainId: network.chainId!,
          chainName: network.chainName!,
          mainnet: network.mainnet!,
          exploreUrl: network.exploreUrl,
          tokens: networkTokens,
        };
      })
      .filter((network) => network.tokens.length > 0);
  }, [networksData, tokensData]);

  const contracts = useMemo<SmartContractInfo[]>(() => {
    if (!contractsData?.smartContractsV2?.data) {
      return [];
    }

    return contractsData.smartContractsV2.data.map((contract) => ({
      id: contract.id!,
      chainInfoId: contract.chainInfoId!,
      address: contract.address!,
      name: contract.name!,
    }));
  }, [contractsData]);

  const getNetworkById = (id: number | null | undefined) => {
    if (!id) return undefined;
    return networksWithTokens.find((network) => Number(network.id) === id);
  };

  const getTokenById = (id: number | null | undefined) => {
    if (!id) return undefined;
    for (const network of networksWithTokens) {
      const token = network.tokens.find((token) => Number(token.id) === id);
      if (token) return token;
    }
    return undefined;
  };

  const getContractByNetworkId = (networkId: number | null | undefined) => {
    if (!networkId) return undefined;
    return contracts.find((contract) => contract.chainInfoId === networkId);
  };

  const value = {
    networks: networksWithTokens,
    contracts,
    loading: networksLoading || tokensLoading || contractsLoading,
    error: !!(networksError || tokensError || contractsError),
    getNetworkById,
    getTokenById,
    getContractByNetworkId,
  };

  return (
    <NetworksContext.Provider value={value}>
      {children}
    </NetworksContext.Provider>
  );
}

export function useNetworks() {
  const context = useContext(NetworksContext);
  if (context === undefined) {
    throw new Error("useNetworks must be used within a NetworksProvider");
  }
  return context;
}
