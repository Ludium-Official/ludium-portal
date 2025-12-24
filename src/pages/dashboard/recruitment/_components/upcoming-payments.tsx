import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNetworks } from '@/contexts/networks-context';
import { commaNumber, dDay, fromUTCString, getCurrencyIcon, getInitials } from '@/lib/utils';
import { UpcomingPayment } from '@/types/types.generated';
import dayjs from 'dayjs';

interface UpcomingPaymentsProps {
  upcomingPayments: UpcomingPayment[];
}

export const UpcomingPayments: React.FC<UpcomingPaymentsProps> = ({ upcomingPayments }) => {
  const { getTokenById } = useNetworks();

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h2 className="text-base font-semibold mb-1">Upcoming Payments</h2>
      <p className="text-sm text-slate-500 mb-6">Payments due within 7 days</p>
      <div className="flex flex-col gap-3">
        {upcomingPayments.length === 0 && (
          <div className="flex items-center justify-center border border-gray-200 rounded-lg py-6 text-base text-slate-500">
            No upcoming payments
          </div>
        )}
        {upcomingPayments.length > 0 &&
          upcomingPayments.map((upcomingPayment, idx) => (
            <div
              key={`${idx}-${upcomingPayment.builder?.nickname}`}
              className="bg-gray-50 p-[10px] rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={upcomingPayment.builder?.profileImage || undefined} />
                  <AvatarFallback className="text-xs bg-gray-100">
                    {getInitials(upcomingPayment.builder?.nickname || '')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-gray-900">
                  {upcomingPayment.builder?.nickname}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {upcomingPayment.payment?.map((payment, idx) => {
                  const token = getTokenById(Number(payment.tokenId));
                  const dueLabel = dDay(fromUTCString(payment.deadline) || new Date());
                  const formattedDate = dayjs(payment.deadline).format('DD.MMM.YYYY');

                  return (
                    <div
                      key={`${idx}-${payment.deadline}`}
                      className="flex items-center justify-between text-xs text-gray-500"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 border border-gray-200 rounded-full font-semibold">
                          {dueLabel}
                        </span>
                        {formattedDate}
                      </div>
                      <div className="flex items-center gap-1 font-semibold">
                        <span>{commaNumber(payment.payout || 0)}</span>
                        <span className="flex items-center gap-1 [&_svg]:w-4 [&_svg]:h-4">
                          {getCurrencyIcon(token?.tokenName)}
                          {token?.tokenName}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UpcomingPayments;
