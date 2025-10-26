import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface MessageListItemProps {
  message: {
    id: string;
    appliedDate: string;
    lastMessage: string;
    userInfo: {
      userId: string;
      image?: string;
      firstName?: string;
      lastName?: string;
    };
  };
  isSelected?: boolean;
  onClick?: () => void;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message, isSelected, onClick }) => {
  const { userInfo, lastMessage, appliedDate } = message;
  const fullName = `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim();
  const initials = `${userInfo.firstName?.[0] || ''}${userInfo.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 border',
        isSelected ? 'bg-blue-50 border-primary' : 'bg-white border-gray-200',
      )}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={userInfo.image || ''} alt={fullName} />
        <AvatarFallback className="text-sm font-semibold">{initials || '??'}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h4 className="mb-1 font-semibold text-gray-900 truncate">{fullName}</h4>
        <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(appliedDate)}
        </span>
      </div>
    </div>
  );
};

export default MessageListItem;
