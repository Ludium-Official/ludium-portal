import { useGenerateSwappedUrlMutation } from '@/apollo/mutation/generate-swapped-url.generated';
import { useGetSwappedStatusQuery } from '@/apollo/queries/get-swapped-status.generated';
import notify from '@/lib/notify';
import { usePrivy } from '@privy-io/react-auth';
import { CheckCircle, Loader2 } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';

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
  currencyCode = 'ETH',
  walletAddress,
  amount,
  onSuccess,
  onClose,
  disabled = false,
}) => {
  const { user } = usePrivy();
  const [signedUrl, setSignedUrl] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [processingInvestment, setProcessingInvestment] = useState(false);

  const realAmount = useMemo(() => {
    const numericAmount = Number.parseFloat(amount);
    if (isNaN(numericAmount)) return amount;

    const amountWithFee = numericAmount * 1.01;
    return amountWithFee.toFixed(2);
  }, [amount]);

  const [generateSwappedUrl, { loading, error }] = useGenerateSwappedUrlMutation({
    onCompleted: (data) => {
      if (data?.generateSwappedUrl?.signedUrl) {
        setSignedUrl(data.generateSwappedUrl.signedUrl);
      }
    },
    onError: (error) => {
      notify(error.message || 'Failed to generate signed URL', 'error');
    },
  });

  const handleGenerateUrl = async () => {
    if (!amount || !walletAddress) {
      notify('Amount and wallet address are required', 'error');
      return;
    }

    if (!user?.id) {
      notify('User authentication required', 'error');
      return;
    }

    try {
      await generateSwappedUrl({
        variables: {
          currencyCode,
          walletAddress,
          amount: realAmount,
          userId: user.id,
        },
      });
    } catch (err) {
      console.error('Failed to generate URL:', err);
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
      notify('Funding completed successfully!', 'success');
      if (onClose) {
        onClose();
      }
    } catch (error) {
      notify('Funding failed. Please try again.', 'error');
      setPaymentCompleted(false);
    } finally {
      setProcessingInvestment(false);
    }
  };

  // Payment status polling using GraphQL
  const {
    data: statusData,
    startPolling,
    stopPolling,
  } = useGetSwappedStatusQuery({
    variables: { userId: user?.id || '' },
    skip: !user?.id || paymentCompleted,
    errorPolicy: 'ignore',
  });

  useEffect(() => {
    if (paymentCompleted || !user?.id) return;

    // Start polling after iframe loads
    const startDelay = setTimeout(() => {
      startPolling(5000); // Poll every 5 seconds
    }, 5000);

    return () => {
      clearTimeout(startDelay);
      stopPolling();
    };
  }, [paymentCompleted, user?.id, startPolling, stopPolling]);

  useEffect(() => {
    if (!statusData?.getSwappedStatus) return;

    const { status, data, message } = statusData.getSwappedStatus;

    if (!data) {
      console.log('⏳ No data yet, status:', status, 'message:', message);
      return;
    }

    try {
      const responseData = typeof data === 'string' ? JSON.parse(data) : data;
      const { data: orderData, success } = responseData || {};

      console.log('📡 Parsed data:', { success, orderData, message });

      if (success && orderData?.order_status === 'order_broadcasted') {
        stopPolling();
        handlePaymentComplete();
      } else if (orderData?.order_status === 'order_cancelled') {
        stopPolling();
        notify(`Payment ${orderData?.order_status}. Please try again.`, 'error');
      } else if (orderData?.order_status === 'payment_pending') {
        console.log('⏳ Order Pending:', orderData);
      } else if (status === 'waiting') {
        console.log('⏳ Order Waiting:', message);
      } else if (!success) {
        console.log('❌ API Error:', responseData?.message);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw data:', data);
    }
  }, [statusData, stopPolling, handlePaymentComplete]);

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
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error.message}</div>
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
              'Continue to Payment'
            )}
          </Button>
        </div>
      ) : paymentCompleted ? (
        <div className="space-y-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h3 className="text-lg font-semibold">
            {processingInvestment ? 'Processing Funding...' : 'Funding Complete!'}
          </h3>
          {processingInvestment && (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing your funding on the blockchain...
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <iframe
            src={signedUrl}
            width="100%"
            height="600"
            style={{ border: 'none' }}
            title="Swapped Funding Payment"
            className="block"
          />
        </div>
      )}
    </div>
  );
};

export default SwappedInvestment;
