import { ChatBox } from '@/components/chat/chat-box';

interface ApplicationChatProps {
  messageId?: string;
}

function ApplicationChat({ messageId }: ApplicationChatProps = {}) {
  const chatRoomId = messageId || '';

  return <ChatBox chatRoomId={chatRoomId} />;
}

export default ApplicationChat;
