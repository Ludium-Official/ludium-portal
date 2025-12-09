import type { Timestamp } from 'firebase/firestore';

export interface ChatMessageFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
  files?: ChatMessageFile[];
  is_active?: boolean;
}
