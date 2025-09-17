import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import notify from '@/lib/notify';
import { useGenerateSwappedUrlMutation } from '@/apollo/mutation/generate-swapped-url.generated';

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
  const [signedUrl, setSignedUrl] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [processingInvestment, setProcessingInvestment] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

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

    try {
      await generateSwappedUrl({
        variables: {
          currencyCode,
          walletAddress,
          amount,
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
    setIsPolling(false); // Stop any SSE connections

    try {
      await onSuccess();
      notify('Investment completed successfully!', 'success');
      if (onClose) {
        onClose();
      }
    } catch (error) {
      notify('Investment failed. Please try again.', 'error');
      setPaymentCompleted(false);
    } finally {
      setProcessingInvestment(false);
    }
  };

  // Real-time payment status using SSE (Server-Sent Events)
  useEffect(() => {
    if (!orderId || paymentCompleted) return;

    setIsPolling(true);
    console.log(`🔄 Starting SSE connection for orderId: ${orderId}`);

    const listenForPaymentUpdates = (orderId: string) => {
      const eventSource = new EventSource(`http://localhost:4000/swapped/events/${orderId}`);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📡 결제 상태 업데이트:', data);

          if (data.status === 'completed') {
            console.log('✅ 결제 완료! 컨트랙트 호출하세요');
            setIsPolling(false);
            eventSource.close();
            // Call contract (handleInvest)
            handlePaymentComplete();
          } else if (data.status === 'failed' || data.status === 'cancelled') {
            console.log('❌ 결제 실패/취소:', data.status);
            setIsPolling(false);
            eventSource.close();
            notify(`Payment ${data.status}. Please try again.`, 'error');
          } else if (data.status === 'connected') {
            console.log('🔗 SSE 연결 성공:', data.message);
          }
        } catch (error) {
          console.error('SSE 메시지 파싱 오류:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE 연결 오류:', error);
        setIsPolling(false);
        eventSource.close();

        // SSE 실패 시 수동 완료 안내
        notify(
          'Real-time connection failed. Please complete payment and click the manual button below.',
          'error',
        );
      };

      eventSource.onopen = () => {
        console.log('🔗 SSE 연결 성공');
      };

      return eventSource;
    };

    // 폴링 fallback 제거 - 백엔드에 payment status 조회 API가 없음

    // Start SSE connection after iframe loads
    const startDelay = setTimeout(() => {
      const eventSource = listenForPaymentUpdates(orderId);

      // Cleanup function
      return () => {
        if (eventSource) {
          eventSource.close();
        }
        setIsPolling(false);
      };
    }, 3000); // Reduced delay for faster response

    return () => {
      clearTimeout(startDelay);
      setIsPolling(false);
    };
  }, [orderId, paymentCompleted]);

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
            {processingInvestment ? 'Processing Investment...' : 'Investment Complete!'}
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
                  🔗 Connected to real-time payment updates. Your investment will proceed
                  automatically when payment completes.
                </span>
              </div>
            </div>
          )}

          <iframe
            src={signedUrl}
            width="100%"
            height="600"
            style={{ border: 'none' }}
            title="Swapped Investment Payment"
            className="block"
          />

          {/* Manual fallback button */}
          <div className="text-center">
            <Button onClick={handlePaymentComplete} variant="outline" className="mt-2">
              I've completed the payment manually
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwappedInvestment;
