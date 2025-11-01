import { useUserV2Query } from "@/apollo/queries/user-v2.generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  type ChatMessage,
  loadInitialMessages,
  loadMoreMessages as loadMoreMessagesFromFirebase,
  sendMessage,
  subscribeToNewMessages,
} from "@/lib/firebase-chat";
import { useAuth } from "@/lib/hooks/use-auth";
import type { ApplicationV2, ProgramV2 } from "@/types/types.generated";
import {
  type DocumentData,
  Timestamp as FirestoreTimestamp,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MessageItemProps {
  message: ChatMessage;
  timestamp: Timestamp;
  applicant?: {
    id?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    profileImage?: string | null;
  };
}

function MessageItem({ message, timestamp, applicant }: MessageItemProps) {
  const shouldUseApplicant = applicant && applicant.id === message.senderId;

  const { data: userData } = useUserV2Query({
    variables: { id: message.senderId },
    skip: !message.senderId || shouldUseApplicant,
  });

  let senderName: string;
  let senderImage: string;

  if (shouldUseApplicant && applicant) {
    const fullName = `${applicant.firstName || ""} ${
      applicant.lastName || ""
    }`.trim();
    // firstName과 lastName이 없으면 이메일 사용
    senderName = fullName || applicant.email || "Unknown";
    senderImage = applicant.profileImage || "";
  } else {
    const user = userData?.userV2;
    const fullName =
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : "";
    // firstName과 lastName이 없으면 이메일 사용
    senderName = fullName || user?.email || "Unknown";
    senderImage = user?.profileImage || "";
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex gap-3 items-start">
      <Avatar className="h-10 w-10">
        <AvatarImage src={senderImage} />
        <AvatarFallback className="text-sm">
          {getInitials(senderName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-slate-700">
            {senderName}
          </span>
          <span className="text-xs text-slate-400">
            {timestamp.toDate().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="rounded-lg px-4 py-2 bg-[#F8F5FA] text-slate-900 w-fit">
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ChatBox({
  selectedMessage,
  program,
}: {
  selectedMessage: ApplicationV2;
  program?: ProgramV2 | null;
}) {
  const totalMessages = 50;

  const { userId } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [oldestDoc, setOldestDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [newestTimestamp, setNewestTimestamp] = useState<Timestamp | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevchatRoomId = useRef<string>("");
  const chatRoomId = selectedMessage.id;

  useEffect(() => {
    if (!chatRoomId) return;

    if (prevchatRoomId.current === chatRoomId) return;

    prevchatRoomId.current = chatRoomId;
    setIsLoading(true);
    setMessages([]);
    setHasMore(true);
    setOldestDoc(null);
    setNewestTimestamp(null);

    loadInitialMessages(chatRoomId, totalMessages)
      .then(({ messages: initialMessages, oldestDoc: doc }) => {
        setMessages(initialMessages);

        if (doc) {
          setOldestDoc(doc);
        }

        if (initialMessages.length > 0) {
          const newest = initialMessages[initialMessages.length - 1];
          setNewestTimestamp(newest.timestamp);
        } else {
          setNewestTimestamp(FirestoreTimestamp.now());
        }

        if (initialMessages.length < totalMessages) {
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error("❌ Error loading initial messages:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [chatRoomId]);

  useEffect(() => {
    if (!chatRoomId || !newestTimestamp) return;

    const unsubscribe = subscribeToNewMessages(
      chatRoomId,
      newestTimestamp,
      (newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        setNewestTimestamp(newMsg.timestamp);
      },
      (error) => {
        console.error("❌ Realtime subscription error:", error);
      }
    );

    return () => unsubscribe();
  }, [chatRoomId, newestTimestamp]);

  const loadMoreMessages = async () => {
    if (!chatRoomId || !oldestDoc || loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      const { messages: olderMessages, oldestDoc: newOldestDoc } =
        await loadMoreMessagesFromFirebase(
          chatRoomId,
          oldestDoc,
          totalMessages
        );

      if (olderMessages.length === 0) {
        setHasMore(false);
        return;
      }

      setMessages((prev) => [...olderMessages, ...prev]);

      if (newOldestDoc) {
        setOldestDoc(newOldestDoc);
      }

      if (olderMessages.length < totalMessages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("❌ Error loading more messages:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !userId) {
      return;
    }

    setIsSending(true);

    try {
      await sendMessage(chatRoomId || "", newMessage, userId);
      setNewMessage("");
    } catch (error) {
      console.error("❌ Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  const getDateLabel = (timestamp: Timestamp) => {
    const messageDate = timestamp.toDate();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isSameDay = (date1: Date, date2: Date) =>
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();

    if (isSameDay(messageDate, today)) {
      return "Today";
    } else if (isSameDay(messageDate, yesterday)) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const shouldShowDateLabel = (index: number) => {
    if (index === 0) return true;
    if (!messages[index].timestamp || !messages[index - 1].timestamp)
      return false;

    const currentDate = messages[index].timestamp.toDate();
    const prevDate = messages[index - 1].timestamp.toDate();

    return (
      currentDate.getFullYear() !== prevDate.getFullYear() ||
      currentDate.getMonth() !== prevDate.getMonth() ||
      currentDate.getDate() !== prevDate.getDate()
    );
  };

  const applicant = selectedMessage.applicant;

  const sponsorFullName =
    userId === selectedMessage.applicant?.id
      ? `${program?.sponsor?.firstName || ""} ${
          program?.sponsor?.lastName || ""
        }`.trim()
      : "";

  const applicantFullName = `${applicant?.firstName || ""} ${
    applicant?.lastName || ""
  }`.trim();

  const fullName =
    userId === selectedMessage.applicant?.id
      ? sponsorFullName || program?.sponsor?.email || "Unknown"
      : applicantFullName || applicant?.email || "Unknown";

  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0]?.toUpperCase() || "??";
  };

  const initials =
    userId === selectedMessage.applicant?.id
      ? getInitials(sponsorFullName || program?.sponsor?.email || "")
      : getInitials(applicantFullName || applicant?.email || "");

  return (
    <div className="flex flex-col min-h-[600px] h-full">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3 px-4 bg-slate-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={applicant?.profileImage || ""} alt={fullName} />
            <AvatarFallback className="text-sm font-semibold">
              {initials || "??"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="font-bold text-lg">{fullName}</h3>
            <p className="text-sm text-muted-foreground">
              {userId === selectedMessage.applicant?.id
                ? program?.sponsor?.organizationName
                : applicant?.organizationName}
            </p>
          </div>
        </div>
        {program?.sponsor?.id === userId && (
          <Button className="mr-4 px-8 bg-primary">Hire</Button>
        )}
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col"
      >
        {isLoading && messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && hasMore && messages.length > 0 && (
          <div className="text-center pb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadMoreMessages}
              disabled={loadingMore}
              className="text-xs"
            >
              {loadingMore ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading...
                </span>
              ) : (
                "Load older messages"
              )}
            </Button>
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            No messages yet. Start the conversation!
          </div>
        )}

        {messages.map((message, index) => (
          <div key={message.id}>
            {message.timestamp && shouldShowDateLabel(index) && (
              <div className="flex items-center justify-center my-4">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="px-4 text-xs font-medium text-slate-500 bg-white">
                  {getDateLabel(message.timestamp)}
                </span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>
            )}

            {message.timestamp && (
              <MessageItem
                message={message}
                timestamp={message.timestamp}
                applicant={selectedMessage.applicant || undefined}
              />
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t bg-slate-3">
        <div className="flex gap-2 items-end">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            disabled={isSending}
            rows={1}
            className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] max-h-[120px] overflow-y-auto"
            style={{
              height: "auto",
              minHeight: "40px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
          <Button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            size="icon"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
