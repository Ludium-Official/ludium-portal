import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { ApplicationV2 } from '@/types/types.generated';

interface MessageListItemProps {
  message: ApplicationV2;
  isSelected?: boolean;
  onClick?: () => void;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message, isSelected, onClick }) => {
  const { applicant } = message;
  const fullName = `${applicant?.firstName || ''} ${applicant?.lastName || ''}`.trim();
  const initials = `${applicant?.firstName?.[0] || ''}${
    applicant?.lastName?.[0] || ''
  }`.toUpperCase();

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-colors hover:bg-gray-50',
        isSelected && 'bg-[#F8F5FA]',
      )}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={applicant?.profileImage || ''} alt={fullName} />
        <AvatarFallback className="text-sm font-semibold">{initials || '??'}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h4 className="mb-1 font-semibold text-gray-900 truncate">{fullName}</h4>
        <p className="text-sm text-gray-600 truncate">last message..</p>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {/* {formatDate(applicant.messageDate)} */}
          Last message date..
        </span>
      </div>
    </div>
  );
};

export default MessageListItem;
