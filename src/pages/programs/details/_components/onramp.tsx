// components/CoinbaseOnrampButton.tsx
import { initOnRamp } from "@coinbase/cbpay-js";
import React, { useEffect, useRef } from "react";

interface CoinbaseOnrampButtonProps {
  address: string; // 지갑 주소
  asset?: "ETH" | "USDC" | "BTC"; // 선택 자산 (기본: ETH)
}

const CoinbaseOnrampButton: React.FC<CoinbaseOnrampButtonProps> = ({
  address,
  asset = "ETH",
}) => {
  const onrampInstance = useRef<any | null>(null);

  useEffect(() => {
    const initializeOnramp = async () => {
      initOnRamp(
        {
          appId: import.meta.env.VITE_PUBLIC_CDP_PROJECT_ID,
          widgetParameters: {
            addresses: {
              [address]: ["base"],
            },
            assets: [asset],
          },
          experienceLoggedIn: "popup",
          experienceLoggedOut: "popup",
          closeOnExit: true,
          closeOnSuccess: true,
          onSuccess: () => {
            console.log("✅ 구매 성공");
          },
          onExit: () => {
            console.log("❌ 위젯 종료");
          },
          onEvent: (event) => {
            console.log("📩 이벤트:", event);
          },
        },
        (error, instance) => {
          if (error) {
            console.error("Coinbase Onramp 초기화 오류:", error);
            return;
          }
          onrampInstance.current = instance;
        }
      );
    };

    initializeOnramp();
  }, [address, asset]);

  const handleClick = () => {
    if (onrampInstance.current) {
      onrampInstance.current.open();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
    >
      Buy {asset} with Coinbase
    </button>
  );
};

export default CoinbaseOnrampButton;
