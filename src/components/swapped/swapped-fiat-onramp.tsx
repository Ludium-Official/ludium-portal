import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";

interface SwappedFiatOnrampProps {
  currencyCode?: string;
  walletAddress: string;
  onClose?: () => void;
}

const SwappedFiatOnramp: React.FC<SwappedFiatOnrampProps> = ({
  currencyCode = "ETH",
  walletAddress,
  onClose,
}) => {
  const [amount, setAmount] = useState("");
  const [signedUrl, setSignedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSignedUrl = async () => {
    if (!amount || !walletAddress) {
      setError("Amount and wallet address are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:4000/generate-swapped-sign",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currencyCode,
            walletAddress,
            amount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate signed URL");
      }

      const data = await response.json();
      setSignedUrl(data.signedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const resetForm = () => {
    setAmount("");
    setSignedUrl("");
    setError("");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Fiat On-Ramp</h2>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            )}
          </div>

          {!signedUrl ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={currencyCode}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="text"
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet">Wallet Address</Label>
                <Input
                  id="wallet"
                  value={walletAddress}
                  disabled
                  className="bg-gray-100 text-sm"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                  {error}
                </div>
              )}

              <Button
                onClick={generateSignedUrl}
                disabled={loading || !amount || !walletAddress}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Complete Your Purchase
                </h3>
                <Button variant="outline" onClick={resetForm}>
                  Back
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={signedUrl}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  title="Swapped Fiat On-Ramp"
                  className="block"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SwappedFiatOnramp;
