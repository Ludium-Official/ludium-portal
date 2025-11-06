import { db, storage } from "@/lib/firebase";
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
} from "firebase/firestore";

export type { Unsubscribe };
import {
  getDownloadURL,
  ref,
  uploadBytes,
  listAll,
  getMetadata,
} from "firebase/storage";

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
}

export async function loadInitialMessages(
  chatRoomId: string,
  limitCount = 50
): Promise<{
  messages: ChatMessage[];
  oldestDoc: QueryDocumentSnapshot<DocumentData> | null;
}> {
  const messagesRef = collection(db, "chats");
  const q = query(
    messagesRef,
    where("chatRoomId", "==", chatRoomId),
    orderBy("timestamp", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);

  const messages = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .reverse() as ChatMessage[];

  const oldestDoc =
    snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

  return { messages, oldestDoc };
}

export async function loadMoreMessages(
  chatRoomId: string,
  oldestDoc: QueryDocumentSnapshot<DocumentData>,
  limitCount = 50
): Promise<{
  messages: ChatMessage[];
  oldestDoc: QueryDocumentSnapshot<DocumentData> | null;
}> {
  const messagesRef = collection(db, "chats");
  const q = query(
    messagesRef,
    where("chatRoomId", "==", chatRoomId),
    orderBy("timestamp", "desc"),
    startAfter(oldestDoc),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);

  const messages = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .reverse() as ChatMessage[];

  const newOldestDoc =
    snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

  return { messages, oldestDoc: newOldestDoc };
}

export async function uploadFile(
  chatRoomId: string,
  file: File
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
  files?: File[]
): Promise<string> {
  let uploadedFiles: ChatMessageFile[] | undefined;

  if (files && files.length > 0) {
    uploadedFiles = await Promise.all(
      files.map((file) => uploadFile(chatRoomId, file))
    );
  }

  const messageData = {
    chatRoomId,
    text: text.trim() || "",
    senderId,
    timestamp: serverTimestamp(),
    ...(uploadedFiles && uploadedFiles.length > 0 && { files: uploadedFiles }),
  };

  const docRef = await addDoc(collection(db, "chats"), messageData);
  return docRef.id;
}

/**
 * 특정 시간 이후의 새 메시지를 가져옵니다 (폴링 방식용)
 */
export async function getNewMessages(
  chatRoomId: string,
  afterTimestamp: Timestamp
): Promise<ChatMessage[]> {
  const messagesRef = collection(db, "chats");
  const q = query(
    messagesRef,
    where("chatRoomId", "==", chatRoomId),
    where("timestamp", ">", afterTimestamp),
    orderBy("timestamp", "asc")
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
  onError?: (error: Error) => void
): Unsubscribe {
  const messagesRef = collection(db, "chats");
  const q = query(
    messagesRef,
    where("chatRoomId", "==", chatRoomId),
    where("timestamp", ">", afterTimestamp),
    orderBy("timestamp", "asc")
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
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
        console.error("❌ Snapshot error:", error);
      }
    }
  );

  return unsubscribe;
}

export async function getLatestMessage(chatRoomId: string): Promise<{
  message: ChatMessage | null;
  timestamp: Timestamp | null;
  senderId: string | null;
}> {
  if (!chatRoomId) {
    return { message: null, timestamp: null, senderId: null };
  }

  try {
    const messagesRef = collection(db, "chats");
    const q = query(
      messagesRef,
      where("chatRoomId", "==", chatRoomId),
      orderBy("timestamp", "desc"),
      limit(1)
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

    return {
      message,
      timestamp: message.timestamp,
      senderId: message.senderId,
    };
  } catch (error) {
    console.error("❌ Error getting latest message:", error);
    return { message: null, timestamp: null, senderId: null };
  }
}

export async function getAllFiles(
  chatRoomId: string
): Promise<ChatMessageFile[]> {
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
      const timestamp = timestampMatch ? parseInt(timestampMatch[1], 10) : 0;
      const originalName = timestampMatch ? timestampMatch[2] : itemRef.name;

      return {
        name: originalName,
        url: downloadURL,
        type: metadata.contentType || "application/octet-stream",
        size: metadata.size,
        timestamp,
      } as ChatMessageFile & { timestamp: number };
    });

    const allFiles = await Promise.all(filePromises);

    return allFiles
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .map(({ timestamp, ...file }) => file);
  } catch (error) {
    console.error("❌ Error getting all files from Storage:", error);
    return [];
  }
}
