import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import notify from "@/lib/notify";
import { useGenerateSwappedUrlMutation } from "@/apollo/mutation/generate-swapped-url.generated";

interface SwappedInvestmentProps {
  currencyCode?: string;
  walletAddress: string;
  amount: string; // USD amount from selectedTier
  onSuccess: () => Promise<void>; // handleInvest function
  onClose?: () => void;
  disabled?: boolean;
  autoStart?: boolean; // Automatically start the API call
}

const SwappedInvestment: React.FC<SwappedInvestmentProps> = ({
  currencyCode = "ETH",
  walletAddress,
  amount,
  onSuccess,
  onClose,
  disabled = false,
}) => {
  const [signedUrl, setSignedUrl] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [processingInvestment, setProcessingInvestment] = useState(false);
  
  const [generateSwappedUrl, { loading, error }] = useGenerateSwappedUrlMutation({
    onCompleted: (data) => {
      if (data?.generateSwappedUrl?.signedUrl) {
        setSignedUrl(data.generateSwappedUrl.signedUrl);
      }
    },
    onError: (error) => {
      notify(error.message || "Failed to generate signed URL", "error");
    }
  });

  const handleGenerateUrl = async () => {
    if (!amount || !walletAddress) {
      notify("Amount and wallet address are required", "error");
      return;
    }

    try {
      await generateSwappedUrl({
        variables: {
          currencyCode,
          walletAddress,
          amount,
        }
      });
    } catch (err) {
      console.error("Failed to generate URL:", err);
    }
  };

  useEffect(() => {
    if (!signedUrl && !loading && !error) {
      handleGenerateUrl();
    }
  }, [signedUrl, loading, error]);

  const handlePaymentComplete = async () => {
    setPaymentCompleted(true);
    setProcessingInvestment(true);

    try {
      await onSuccess();
      notify("Investment completed successfully!", "success");
      if (onClose) {
        onClose();
      }
    } catch (error) {
      notify("Investment failed. Please try again.", "error");
      setPaymentCompleted(false);
    } finally {
      setProcessingInvestment(false);
    }
  };

  // Listen for payment completion (this is a simplified approach)
  useEffect(() => {
    if (signedUrl) {
      const handleMessage = (event: MessageEvent) => {
        // Listen for messages from the iframe
        if (event.origin === "https://widget.swapped.com") {
          if (event.data.type === "PAYMENT_SUCCESS") {
            handlePaymentComplete();
          }
        }
      };

      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }
  }, [signedUrl]);

  return (
    <div className="p-6">
      <div className="space-y-4">
        {loading && !signedUrl ? (
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <p>Preparing your payment...</p>
          </div>
        ) : !signedUrl && !paymentCompleted ? (
          <div className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                {error.message}
              </div>
            )}
            <Button
              onClick={handleGenerateUrl}
              disabled={loading || !amount || !walletAddress || disabled}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Payment Link...
                </>
              ) : (
                "Continue to Payment"
              )}
            </Button>
          </div>
        ) : paymentCompleted ? (
          <div className="space-y-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold">
              {processingInvestment
                ? "Processing Investment..."
                : "Investment Complete!"}
            </h3>
            {processingInvestment && (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing your investment on the blockchain...
              </div>
            )}
          </div>
        ) : (
          <iframe
            src={signedUrl}
            width="100%"
            height="600"
            style={{ border: "none" }}
            title="Swapped Investment Payment"
            className="block"
            sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation"
          />
        )}
      </div>
    </div>
  );
};

export default SwappedInvestment;
