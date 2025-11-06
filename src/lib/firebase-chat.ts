import { db } from '@/lib/firebase';
import {
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
  type Unsubscribe,
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  where,
} from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
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

export async function sendMessage(
  chatRoomId: string,
  text: string,
  senderId: string,
): Promise<string> {
  const messageData = {
    chatRoomId,
    text: text.trim(),
    senderId,
    timestamp: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'chats'), messageData);
  return docRef.id;
}

export function subscribeToNewMessages(
  chatRoomId: string,
  afterTimestamp: Timestamp,
  onNewMessage: (message: ChatMessage) => void,
  onError?: (error: Error) => void,
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
        if (change.type === 'added') {
          const newMsg = {
            id: change.doc.id,
            ...change.doc.data(),
          } as ChatMessage;
          onNewMessage(newMsg);
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

export async function getLatestMessage(
  chatRoomId: string,
): Promise<{ message: ChatMessage | null; timestamp: Timestamp | null; senderId: string | null }> {
  if (!chatRoomId) {
    return { message: null, timestamp: null, senderId: null };
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
      return { message: null, timestamp: null, senderId: null };
    }

    const doc = snapshot.docs[0];
    const message = {
      id: doc.id,
      ...doc.data(),
    } as ChatMessage;

    return { message, timestamp: message.timestamp, senderId: message.senderId };
  } catch (error) {
    console.error('❌ Error getting latest message:', error);
    return { message: null, timestamp: null, senderId: null };
  }
}
