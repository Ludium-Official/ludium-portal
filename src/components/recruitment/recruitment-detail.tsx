import ArbitrumIcon from '@/assets/icons/crypto/arbitrum';
import BaseIcon from '@/assets/icons/crypto/base';
import CreditcoinIcon from '@/assets/icons/crypto/creditcoin';
import EduIcon from '@/assets/icons/crypto/edu';
import EtcIcon from '@/assets/icons/crypto/etc';
import EthIcon from '@/assets/icons/crypto/eth';
import UsdcIcon from '@/assets/icons/crypto/usdc';
import UsdtIcon from '@/assets/icons/crypto/usdt';
import { mockRecruitmentPrograms } from '@/mock/recruitment-programs';

interface RecruitmentDetailProps {
  id: string;
}

const RecruitmentDetail: React.FC<RecruitmentDetailProps> = ({ id }) => {
  const recruitment = mockRecruitmentPrograms.find((item) => item.id === id);

  if (!recruitment) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-500">Recruitment not found</div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    under_review: '#9CA3AF',
    declined: '#EF4444',
    draft: '#60A5FA',
    open: '#4ADE80',
    closed: '#7E7E7E',
  };
  const dotColor = statusColors[recruitment.status] || '#7E7E7E';

  const createdAt = new Date(recruitment.createdAt);
  const formattedCreatedAt = createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const deadline = new Date(recruitment.deadline);
  const formattedDeadline = deadline.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const tokenIcons: Record<string, React.FC<any>> = {
    EDU: EduIcon,
    USDT: UsdtIcon,
    USDC: UsdcIcon,
    ETH: EthIcon,
    ARB: ArbitrumIcon,
    BASE: BaseIcon,
    CTC: CreditcoinIcon,
    ETC: EtcIcon,
  };

  const TokenIcon = recruitment.currency ? tokenIcons[recruitment.currency.toUpperCase()] : null;

  const formattedPrice =
    recruitment.price && Number.parseInt(recruitment.price).toLocaleString('en-US');

  return (
    <div className="bg-white rounded-2xl p-10">
      {/* Status and Created At */}
      <div className="flex items-center justify-between mb-6">
        <div className="inline-flex items-center gap-2 bg-[#18181B0A] rounded-[50px] px-[10px] py-[5px]">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: dotColor }} />
          <span className="capitalize font-bold">{recruitment.status}</span>
        </div>
        <div className="text-sm text-gray-500">Posted on {formattedCreatedAt}</div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{recruitment.title}</h1>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section - Description */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
          <div className="prose max-w-none">
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: recruitment.description }}
            />
          </div>

          {/* Skills */}
          {recruitment.skills && recruitment.skills.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {recruitment.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Info */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 space-y-6">
            {/* Price */}
            <div>
              <div className="text-sm text-gray-500 mb-2">Price</div>
              {recruitment.budgetType === 'negotiable' ? (
                <div className="font-bold text-lg">Negotiable</div>
              ) : recruitment.price && recruitment.currency ? (
                <div className="flex items-center gap-3 font-bold text-lg">
                  {formattedPrice}{' '}
                  <div className="flex items-center gap-2">
                    {TokenIcon ? <TokenIcon size={20} /> : null}
                    {recruitment.currency}
                  </div>
                </div>
              ) : (
                <div className="font-bold text-lg">-</div>
              )}
            </div>

            {/* Deadline */}
            <div>
              <div className="text-sm text-gray-500 mb-2">Deadline</div>
              <div className="font-bold text-lg">{formattedDeadline}</div>
            </div>

            {/* Applicants */}
            <div>
              <div className="text-sm text-gray-500 mb-2">Applicants</div>
              <div className="font-bold text-lg">{recruitment.applicantCount}</div>
            </div>

            {/* Network */}
            {recruitment.network && (
              <div>
                <div className="text-sm text-gray-500 mb-2">Network</div>
                <div className="font-bold text-lg capitalize">
                  {recruitment.network.replace(/-/g, ' ')}
                </div>
              </div>
            )}

            {/* Visibility */}
            <div>
              <div className="text-sm text-gray-500 mb-2">Visibility</div>
              <div className="font-bold text-lg capitalize">{recruitment.visibility}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentDetail;
