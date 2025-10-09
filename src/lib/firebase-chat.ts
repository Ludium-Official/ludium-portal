import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  where,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentData,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  applicationId: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

export async function loadInitialMessages(
  applicationId: string,
  limitCount: number = 50,
): Promise<{
  messages: ChatMessage[];
  oldestDoc: QueryDocumentSnapshot<DocumentData> | null;
}> {
  const messagesRef = collection(db, 'chats');
  const q = query(
    messagesRef,
    where('applicationId', '==', applicationId),
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
  applicationId: string,
  oldestDoc: QueryDocumentSnapshot<DocumentData>,
  limitCount: number = 50,
): Promise<{
  messages: ChatMessage[];
  oldestDoc: QueryDocumentSnapshot<DocumentData> | null;
}> {
  const messagesRef = collection(db, 'chats');
  const q = query(
    messagesRef,
    where('applicationId', '==', applicationId),
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
  applicationId: string,
  text: string,
  senderId: string,
): Promise<string> {
  const messageData = {
    applicationId,
    text: text.trim(),
    senderId,
    timestamp: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'chats'), messageData);
  return docRef.id;
}

export function subscribeToNewMessages(
  applicationId: string,
  afterTimestamp: Timestamp,
  onNewMessage: (message: ChatMessage) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const messagesRef = collection(db, 'chats');
  const q = query(
    messagesRef,
    where('applicationId', '==', applicationId),
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
