import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import SwappedFiatOnramp from './swapped-fiat-onramp';

const SwappedExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Example wallet address - in real implementation, this would come from the user's connected wallet
  const exampleWalletAddress = '0x742D35Cc6634C0532925a3b8D4020E03dE3C8c';

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Swapped Fiat On-Ramp Example</h1>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Buy Crypto with Fiat</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <SwappedFiatOnramp
            currencyCode="ETH"
            walletAddress={exampleWalletAddress}
            onClose={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">How to use:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Click the "Buy Crypto with Fiat" button above</li>
          <li>Enter the amount in USD you want to spend</li>
          <li>Click "Continue to Payment"</li>
          <li>Complete the purchase in the iframe</li>
        </ol>

        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Integration Notes:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Make sure your backend is running on localhost:4000</li>
            <li>Ensure SWAPPED_PUBLIC_KEY and SWAPPED_SECRET_KEY are set in your environment</li>
            <li>Replace the example wallet address with the actual user's wallet address</li>
            <li>You can customize the currency code (ETH, BTC, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SwappedExample;
