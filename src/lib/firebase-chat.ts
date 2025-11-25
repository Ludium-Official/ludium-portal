import { db, storage } from '@/lib/firebase';
import {
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
  type Unsubscribe,
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';

export type { Unsubscribe };
import { getDownloadURL, getMetadata, listAll, ref, uploadBytes } from 'firebase/storage';

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

export async function loadInitialMessages(
  chatRoomId: string,
  limitCount = 50,
): Promise<{
  messages: ChatMessage[];
  oldestDoc: QueryDocumentSnapshot<DocumentData> | null;
}> {
  const messagesRef = collection(db, 'chats');
  const q = query(
    messagesRef,
    where('chatRoomId', '==', chatRoomId),
    orderBy('timestamp', 'desc'),
    limit(limitCount),
  );

  const snapshot = await getDocs(q);

  const messages = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .reverse() as ChatMessage[];

  const oldestDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

  return { messages, oldestDoc };
}

export async function loadMoreMessages(
  chatRoomId: string,
  oldestDoc: QueryDocumentSnapshot<DocumentData>,
  limitCount = 50,
): Promise<{
  messages: ChatMessage[];
  oldestDoc: QueryDocumentSnapshot<DocumentData> | null;
}> {
  const messagesRef = collection(db, 'chats');
  const q = query(
    messagesRef,
    where('chatRoomId', '==', chatRoomId),
    orderBy('timestamp', 'desc'),
    startAfter(oldestDoc),
    limit(limitCount),
  );

  const snapshot = await getDocs(q);

  const messages = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .reverse() as ChatMessage[];

  const newOldestDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

  return { messages, oldestDoc: newOldestDoc };
}

export async function uploadFile(
  chatRoomId: string,
  file: File,
): Promise<{ name: string; url: string; type: string; size: number }> {
  const timestamp = Date.now();
  const fileName = `${chatRoomId}/${timestamp}_${file.name}`;
  const storageRef = ref(storage, `chat-files/${fileName}`);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return {
    name: file.name,
    url: downloadURL,
    type: file.type,
    size: file.size,
  };
}

export async function sendMessage(
  chatRoomId: string,
  text: string,
  senderId: string,
  files?: File[],
): Promise<string> {
  let uploadedFiles: ChatMessageFile[] | undefined;

  if (files && files.length > 0) {
    uploadedFiles = await Promise.all(files.map((file) => uploadFile(chatRoomId, file)));
  }

  const messageData = {
    chatRoomId,
    text: text.trim() || '',
    senderId,
    timestamp: serverTimestamp(),
    is_active: true,
    ...(uploadedFiles && uploadedFiles.length > 0 && { files: uploadedFiles }),
  };

  const docRef = await addDoc(collection(db, 'chats'), messageData);
  return docRef.id;
}

/**
 * 특정 시간 이후의 새 메시지를 가져옵니다 (폴링 방식용)
 */
export async function getNewMessages(
  chatRoomId: string,
  afterTimestamp: Timestamp,
): Promise<ChatMessage[]> {
  const messagesRef = collection(db, 'chats');
  const q = query(
    messagesRef,
    where('chatRoomId', '==', chatRoomId),
    where('timestamp', '>', afterTimestamp),
    orderBy('timestamp', 'asc'),
  );

  const snapshot = await getDocs(q);

  const messages = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatMessage[];

  return messages;
}

export function subscribeToNewMessages(
  chatRoomId: string,
  afterTimestamp: Timestamp,
  onNewMessage: (message: ChatMessage) => void,
  onError?: (error: Error) => void,
  onMessageUpdate?: (message: ChatMessage) => void,
): Unsubscribe {
  const messagesRef = collection(db, 'chats');
  const q = query(
    messagesRef,
    where('chatRoomId', '==', chatRoomId),
    where('timestamp', '>', afterTimestamp),
    orderBy('timestamp', 'asc'),
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const msg = {
          id: change.doc.id,
          ...change.doc.data(),
        } as ChatMessage;

        if (change.type === 'added') {
          onNewMessage(msg);
        } else if (change.type === 'modified' && onMessageUpdate) {
          onMessageUpdate(msg);
        }
      });
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error('❌ Snapshot error:', error);
      }
    },
  );

  return unsubscribe;
}

export async function getLatestMessage(chatRoomId: string): Promise<{
  message: ChatMessage | null;
  timestamp: Timestamp | null;
  senderId: string | null;
  isFile: boolean;
}> {
  if (!chatRoomId) {
    return { message: null, timestamp: null, senderId: null, isFile: false };
  }

  try {
    const messagesRef = collection(db, 'chats');
    const q = query(
      messagesRef,
      where('chatRoomId', '==', chatRoomId),
      orderBy('timestamp', 'desc'),
      limit(1),
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { message: null, timestamp: null, senderId: null, isFile: false };
    }

    const doc = snapshot.docs[0];
    const message = {
      id: doc.id,
      ...doc.data(),
    } as ChatMessage;

    return {
      message,
      timestamp: message.timestamp,
      senderId: message.senderId,
      isFile: Array.isArray(message.files) && message.files.length > 0,
    };
  } catch (error) {
    console.error('❌ Error getting latest message:', error);
    return { message: null, timestamp: null, senderId: null, isFile: false };
  }
}

export async function getAllFiles(chatRoomId: string): Promise<ChatMessageFile[]> {
  if (!chatRoomId) {
    return [];
  }

  try {
    const folderRef = ref(storage, `chat-files/${chatRoomId}/`);
    const result = await listAll(folderRef);

    const filePromises = result.items.map(async (itemRef) => {
      const metadata = await getMetadata(itemRef);
      const downloadURL = await getDownloadURL(itemRef);

      const timestampMatch = itemRef.name.match(/^(\d+)_(.+)$/);
      const timestamp = timestampMatch ? Number.parseInt(timestampMatch[1], 10) : 0;
      const originalName = timestampMatch ? timestampMatch[2] : itemRef.name;

      return {
        name: originalName,
        url: downloadURL,
        type: metadata.contentType || 'application/octet-stream',
        size: metadata.size,
        timestamp,
      } as ChatMessageFile & { timestamp: number };
    });

    const allFiles = await Promise.all(filePromises);

    return allFiles
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .map(({ timestamp, ...file }) => file);
  } catch (error) {
    console.error('❌ Error getting all files from Storage:', error);
    return [];
  }
}

/**
 * 특정 채팅방의 계약 관련 메시지들을 비활성화합니다
 * @param chatRoomId 채팅방 ID
 * @param senderIds 비활성화할 senderId 배열 (기본값: ['-1', '-2'])
 */
export async function deactivateContractMessages(
  chatRoomId: string,
  senderIds: string[] = ['-1', '-2'],
): Promise<void> {
  if (!chatRoomId) {
    return;
  }

  try {
    const messagesRef = collection(db, 'chats');
    const q = query(
      messagesRef,
      where('chatRoomId', '==', chatRoomId),
      where('senderId', 'in', senderIds),
    );

    const snapshot = await getDocs(q);

    const updatePromises = snapshot.docs.map((docSnapshot) => {
      const messageRef = doc(db, 'chats', docSnapshot.id);
      return updateDoc(messageRef, { is_active: false });
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('❌ Error deactivating contract messages:', error);
    throw error;
  }
}
