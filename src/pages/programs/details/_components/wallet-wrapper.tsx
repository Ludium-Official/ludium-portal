import { Button } from "@/components/ui/button";
import {
  Address,
  EthBalance,
  Identity,
  Name,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
} from "@coinbase/onchainkit/wallet";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useDisconnect } from "wagmi";

type WalletWrapperParams = {
  text?: string;
  className?: string;
  onConnect?: () => void;
};
export default function WalletWrapper({
  className,
  text,
  onConnect,
}: WalletWrapperParams) {
  const navigate = useNavigate();
  const { disconnect, connectors } = useDisconnect();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDisconnect = useCallback(() => {
    connectors.map((connector) => disconnect({ connector }));
    setIsDropdownOpen(false);
  }, [disconnect, connectors]);

  return (
    <>
      <Wallet>
        <ConnectWallet text={text} className={className} onConnect={onConnect}>
          <Name
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="mx-[16px] my-[8px] text-[14px]"
          />
        </ConnectWallet>
        {isDropdownOpen && (
          <WalletDropdown
            className="bg-white min-w-[250px] mt-2"
            classNames={{ container: "justify-start" }}
          >
            <Identity
              className="px-4 pt-3 pb-2 text-[14px]"
              hasCopyAddressOnClick={true}
            >
              <Address className="flex flex-col" />
              <EthBalance />
            </Identity>
            <button
              className="cursor-pointer border-none px-[29px] py-3 text-[14px] text-start"
              onClick={() => {
                navigate("/profile");
                setIsDropdownOpen(false);
              }}
            >
              Profile
            </button>
            <Button className="m-3 px-5 py-2" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </WalletDropdown>
        )}
      </Wallet>
    </>
  );
}
