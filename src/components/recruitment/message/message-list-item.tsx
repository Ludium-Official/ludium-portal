import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ludiumAssignmentLogo from '@/assets/ludium-assignment.svg';
import { cn, getUserInitialName, getUserDisplayName } from '@/lib/utils';
import type { ApplicationV2 } from '@/types/types.generated';
import type { Timestamp } from 'firebase/firestore';

interface MessageListItemProps {
  message: ApplicationV2;
  isSelected?: boolean;
  onClick?: () => void;
  latestMessageText?: string | null;
  latestMessageTimestamp?: Timestamp | null;
  latestMessageSenderId?: string | null;
  currentUserId?: string | null;
}

const MessageListItem: React.FC<MessageListItemProps> = ({
  message,
  isSelected,
  onClick,
  latestMessageText,
  latestMessageTimestamp,
  latestMessageSenderId,
  currentUserId,
}) => {
  const { applicant } = message;
  const fullName = getUserDisplayName(applicant?.firstName, applicant?.lastName, applicant?.email);
  const initials = getUserInitialName(applicant?.firstName, applicant?.lastName, applicant?.email);

  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const getDisplayText = () => {
    if (latestMessageSenderId === '-1' || latestMessageSenderId === '-2') {
      return (
        <div className="flex items-center gap-1">
          <img src={ludiumAssignmentLogo} alt="Ludium Assignment" className="w-4 h-4" />
          Ludium Assistant Message
        </div>
      );
    }

    if (!latestMessageText) return 'No messages yet';

    if (latestMessageSenderId === currentUserId) {
      return latestMessageText;
    }

    return latestMessageText;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 py-4 px-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50',
        isSelected && 'bg-[#F8F5FA]',
      )}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={applicant?.profileImage || ''} alt={fullName} />
        <AvatarFallback className="text-sm font-semibold">{initials || '??'}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h4 className="mb-1 font-semibold text-gray-900 truncate">{fullName}</h4>
        <p className="max-w-[200px] text-sm text-gray-600 truncate">{getDisplayText()}</p>
        {latestMessageTimestamp && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDate(latestMessageTimestamp)}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageListItem;
