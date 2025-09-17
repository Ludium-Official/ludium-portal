import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import notify from "@/lib/notify";
import { useGenerateSwappedUrlMutation } from "@/apollo/mutation/generate-swapped-url.generated";
import { usePrivy } from "@privy-io/react-auth";

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
  const { user } = usePrivy();
  const [signedUrl, setSignedUrl] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [processingInvestment, setProcessingInvestment] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  const [generateSwappedUrl, { loading, error }] =
    useGenerateSwappedUrlMutation({
      onCompleted: (data) => {
        if (data?.generateSwappedUrl?.signedUrl) {
          setSignedUrl(data.generateSwappedUrl.signedUrl);
        }
      },
      onError: (error) => {
        notify(error.message || "Failed to generate signed URL", "error");
      },
    });

  const handleGenerateUrl = async () => {
    if (!amount || !walletAddress) {
      notify("Amount and wallet address are required", "error");
      return;
    }

    if (!user?.id) {
      notify("User authentication required", "error");
      return;
    }

    try {
      await generateSwappedUrl({
        variables: {
          currencyCode,
          walletAddress,
          amount,
          userId: user.id,
        },
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
    setIsPolling(false); // Stop any SSE connections

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

  // Payment status polling using REST API
  useEffect(() => {
    if (paymentCompleted || !user?.id) return;

    setIsPolling(true);

    const pollPaymentStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:4000/swapped/status/${user.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data, status } = await response.json();

        if (
          status === "success" &&
          data.data?.order_status === "order_broadcasted"
        ) {
          setIsPolling(false);
          handlePaymentComplete();
        } else if (data.data?.order_status === "order_cancelled") {
          notify("Order failed. Please try again.", "error");
          setIsPolling(false);
          notify(
            `Payment ${data.data.order_status}. Please try again.`,
            "error"
          );
        } else if (data.data.order_status === "payment_pending") {
          console.log("⏳ Order Pending:", data.data);
        }
      } catch (error) {
        console.error("Order Error:", error);
      }
    };

    // Start polling after iframe loads
    const startDelay = setTimeout(() => {
      pollPaymentStatus();

      const pollInterval = setInterval(pollPaymentStatus, 5000);

      // Cleanup function
      return () => {
        clearInterval(pollInterval);
        setIsPolling(false);
      };
    }, 5000);

    return () => {
      clearTimeout(startDelay);
      setIsPolling(false);
    };
  }, [paymentCompleted, user?.id]);

  return (
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
        <div className="space-y-4">
          {isPolling && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-700">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  🔗 Connected to real-time payment updates. Your investment
                  will proceed automatically when payment completes.
                </span>
              </div>
            </div>
          )}

          <iframe
            src={signedUrl}
            width="100%"
            height="600"
            style={{ border: "none" }}
            title="Swapped Investment Payment"
            className="block"
          />

          {/* Manual fallback button */}
          <div className="text-center">
            <Button
              onClick={handlePaymentComplete}
              variant="outline"
              className="mt-2"
            >
              I've completed the payment manually
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwappedInvestment;
