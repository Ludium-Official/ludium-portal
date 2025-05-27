import Notifications from "@/components/notifications";

import { useProfileQuery } from "@/apollo/queries/profile.generated";
import ChainContract from "@/lib/contract";
import { useAuth } from "@/lib/hooks/use-auth";
import { useContract } from "@/lib/hooks/use-contract";
import notify from "@/lib/notify";
import { commaNumber, reduceString } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import NetworkSelector from "../network-selector";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

function Header() {
  const {
    user,
    authenticated,
    login: privyLogin,
    logout: privyLogout,
  } = usePrivy();
  const { login: authLogin, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const [network, setNetwork] = useState("educhain");
  const [balances, setBalances] = useState<
    { name: string; amount: bigint | null }[]
  >([]);

  const { data: profileData } = useProfileQuery({
    fetchPolicy: "network-only",
  });

  const walletInfo = user?.wallet;

  const login = async () => {
    try {
      const googleInfo = user?.google;
      const farcasterInfo = user?.farcaster;

      const loginType = (() => {
        const types = {
          google: googleInfo,
          farcaster: farcasterInfo,
        };

        return (
          (Object.keys(types) as Array<keyof typeof types>).find(
            (key) => types[key]
          ) || "wallet"
        );
      })();

      privyLogin();

      if (user && walletInfo) {
        await authLogin({
          email: googleInfo?.email || null,
          walletAddress: walletInfo.address,
          loginType,
        });
      }
    } catch (error) {
      notify("Failed to login", "error");
      console.error("Failed to login:", error);
    }
  };

  const logout = async () => {
    try {
      authLogout();
      privyLogout();

      notify("Successfully logged out", "success");
      navigate("/");
    } catch (error) {
      notify("Error logging out", "error");
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    if (authenticated && user) {
      login();
    }
  }, [user]);

  const callTokenBalance = async (
    contract: ChainContract,
    tokenAddress: string,
    walletAddress: string
  ): Promise<bigint | null> => {
    try {
      const balance = await contract.getAmount(tokenAddress, walletAddress);

      return balance as bigint; // Ensure the returned value is cast to bigint
    } catch (error) {
      console.error("Error fetching token balance:", error);
      return null;
    }
  };

  const contract = useContract(network);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!authenticated || !walletInfo?.address) return;

      const tokenAddresses = {
        base: {
          usdt: "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2",
          usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        },
        "base-sepolia": {
          usdt: "0x73b4a58138cccbda822df9449feda5eac6669ebd",
          usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        },
        educhain: {
          usdt: "0x7277cc818e3f3ffbb169c6da9cc77fc2d2a34895",
          usdc: "0x836d275563bab5e93fd6ca62a95db7065da94342",
        },
        "educhain-testnet": {
          usdt: "0x3BfB66999C22c0189B0D837D12D5A4004844EC12",
          usdc: "0xe7ffE105F7dC49F2ff4412D5c6E8f3C3d1ABc317",
        },
      };

      // @ts-ignore
      const { usdt, usdc } = tokenAddresses[network] || {};

      const [usdtBalance, usdcBalance, nativeBalance] = await Promise.all([
        callTokenBalance(contract, usdt, walletInfo.address),
        callTokenBalance(contract, usdc, walletInfo.address),
        contract.getBalance(walletInfo.address),
      ]);

      setBalances([
        { name: "Native", amount: nativeBalance },
        { name: "USDT", amount: usdtBalance },
        { name: "USDC", amount: usdcBalance },
      ]);
    };

    fetchBalances();
  }, [authenticated, walletInfo, network]);

  return (
    <header className="flex justify-between items-center px-10 py-[14px] border-b">
      <div />

      <div className="flex gap-2">
        {authenticated && <Notifications />}
        <div>
          {!authenticated && (
            <Button
              className="bg-[#B331FF] hover:bg-[#B331FF]/90 h-fit"
              onClick={login}
            >
              Login
            </Button>
          )}
          {authenticated && (
            <Dialog>
              <DialogTrigger>
                <Button
                  className="bg-[#B331FF] hover:bg-[#B331FF]/90 h-fit"
                  onClick={() => console.log("open")}
                >
                  {profileData?.profile?.organizationName ??
                    reduceString(walletInfo?.address || "", 6, 6)}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center text-[20px] font-bold">
                    Profile
                  </DialogTitle>
                  <DialogDescription className="flex flex-col gap-4 mt-5">
                    <div className="border border-[#E9E9E9] rounded-[10px] p-5">
                      <div className="flex items-center justify-between mb-3 text-[16px] font-bold">
                        Balance
                        <div>
                          <NetworkSelector
                            value={network}
                            onValueChange={setNetwork}
                            className="min-w-[120px] h-10"
                          />
                        </div>
                      </div>
                      <div>
                        {balances.map((balance) => {
                          return (
                            <div key={balance.name} className="mb-2">
                              {balance.name}:{" "}
                              {balance.amount !== null
                                ? commaNumber(
                                    ethers.utils.formatUnits(
                                      balance.amount,
                                      balance.name === "Native" ? 18 : 6
                                    )
                                  )
                                : "Fetching..."}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="border border-[#E9E9E9] rounded-[10px] p-5">
                      <div className="mb-3 text-[16px] font-bold">Account</div>
                      <div
                        className="cursor-pointer hover:underline"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            walletInfo?.address || ""
                          );
                          notify("Copied address!", "success");
                        }}
                      >
                        {reduceString(walletInfo?.address || "", 8, 8)}
                      </div>
                    </div>
                    <Button onClick={logout}>Logout</Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
