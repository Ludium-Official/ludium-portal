import contractLogo from '@/assets/icons/contract.svg';
import ludiumAssignmentLogo from '@/assets/ludium-assignment.svg';
import { useUserV2Query } from '@/apollo/queries/user-v2.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import {
  type ChatMessage,
  loadInitialMessages,
  loadMoreMessages as loadMoreMessagesFromFirebase,
  sendMessage,
  subscribeToNewMessages,
} from '@/lib/firebase-chat';
import { useAuth } from '@/lib/hooks/use-auth';
import { cn, getUserDisplayName } from '@/lib/utils';
import type { ApplicationV2 } from '@/types/types.generated';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type DocumentData,
  Timestamp as FirestoreTimestamp,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore';
import { Loader2, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ContractModal } from '@/components/recruitment/contract/contract-modal';

const messageFormSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

type MessageFormData = z.infer<typeof messageFormSchema>;

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
  application: ApplicationV2;
}

function MessageItem({ message, timestamp, applicant, application }: MessageItemProps) {
  const { userId } = useAuth();
  const shouldUseApplicant = applicant && applicant.id === message.senderId;
  const isMyMessage = userId === message.senderId;
  const isLudiumAssistant = Number(message.senderId) < 0;
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const { data: userData } = useUserV2Query({
    variables: { id: message.senderId },
    skip: !message.senderId || shouldUseApplicant || isMyMessage,
  });

  let senderName: string = '';
  let senderImage: string = '';

  if (!isMyMessage) {
    if (shouldUseApplicant && applicant) {
      const fullName = getUserDisplayName(applicant.firstName, applicant.lastName, applicant.email);
      senderName = fullName;
      senderImage = applicant.profileImage || '';
    } else {
      const user = userData?.userV2;
      const fullName = getUserDisplayName(user?.firstName, user?.lastName, user?.email);
      senderName = fullName;
      senderImage = user?.profileImage || '';
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isMyMessage) {
    return (
      <div className="flex gap-3 items-start justify-end">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-400">
              {timestamp.toDate().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="rounded-lg px-4 py-2 bg-primary text-primary-foreground w-fit">
            <p className="text-sm">{message.text}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      <Avatar className="h-10 w-10">
        <AvatarImage src={isLudiumAssistant ? ludiumAssignmentLogo : senderImage} />
        <AvatarFallback className="text-sm">{getInitials(senderName)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-slate-700">
            {isLudiumAssistant ? 'Ludium Assistant' : senderName}
          </span>
          <span className="text-xs text-slate-400">
            {timestamp.toDate().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <div
          className={cn(
            'rounded-lg px-4 py-2 bg-[#F8F5FA] text-slate-900 w-fit max-w-[70%]',
            isLudiumAssistant && 'py-4 bg-white border border-primary',
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.senderId === '-1' || message.senderId === '-2' ? (
              <>
                <div>
                  <img src={contractLogo} alt="contract" className="mb-3" />
                  <div className="font-bold text-lg">Employment Contract</div>
                  <div className="mt-1 mb-5 font-semibold">
                    {message.senderId === '-1'
                      ? 'Sponser sent a contract for review and signature.'
                      : 'Builder sent a contract for review and signature.'}
                  </div>
                  <Button
                    variant="lightPurple"
                    className="w-full"
                    onClick={() => setIsContractModalOpen(true)}
                  >
                    View Contract
                  </Button>
                </div>
                <ContractModal
                  open={isContractModalOpen}
                  onOpenChange={setIsContractModalOpen}
                  contractInformation={{
                    title: application.program?.title || '',
                    programId: application.program?.id || '',
                    sponsor: application.program?.sponsor || null,
                    applicant: application.applicant || null,
                    networkId: application.program?.networkId || null,
                    chatRoomId: application.chatroomMessageId || null,
                  }}
                  assistantId={message.senderId}
                />
              </>
            ) : (
              message.text
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ChatBox({
  selectedMessage,
}: {
  selectedMessage: ApplicationV2;
}) {
  const totalMessages = 50;

  const { userId } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [oldestDoc, setOldestDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [newestTimestamp, setNewestTimestamp] = useState<Timestamp | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevchatRoomId = useRef<string>('');
  const chatRoomId = selectedMessage.chatroomMessageId;

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: '',
    },
  });

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
        console.error('❌ Error loading initial messages:', error);
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
        console.error('❌ Realtime subscription error:', error);
      },
    );

    return () => unsubscribe();
  }, [chatRoomId, newestTimestamp]);

  const loadMoreMessages = async () => {
    if (!chatRoomId || !oldestDoc || loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      const { messages: olderMessages, oldestDoc: newOldestDoc } =
        await loadMoreMessagesFromFirebase(chatRoomId, oldestDoc, totalMessages);

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
      console.error('❌ Error loading more messages:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSendMessage = async (data: MessageFormData) => {
    if (!data.message.trim() || !userId) {
      return;
    }

    setIsSending(true);

    try {
      await sendMessage(chatRoomId || '', data.message, userId);
      form.reset();
    } catch (error) {
      console.error('❌ Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(handleSendMessage)();
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
      return 'Today';
    } else if (isSameDay(messageDate, yesterday)) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString([], {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const shouldShowDateLabel = (index: number) => {
    if (index === 0) return true;
    if (!messages[index].timestamp || !messages[index - 1].timestamp) return false;

    const currentDate = messages[index].timestamp.toDate();
    const prevDate = messages[index - 1].timestamp.toDate();

    return (
      currentDate.getFullYear() !== prevDate.getFullYear() ||
      currentDate.getMonth() !== prevDate.getMonth() ||
      currentDate.getDate() !== prevDate.getDate()
    );
  };

  return (
    <div className="flex flex-col min-h-[600px] h-full">
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
                'Load older messages'
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
                application={selectedMessage}
              />
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {chatRoomId && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSendMessage)} className="p-4 border-t bg-slate-3">
            <div className="flex gap-2 items-end">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <textarea
                        {...field}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message... (Shift+Enter for new line)"
                        disabled={isSending}
                        rows={1}
                        className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] max-h-[120px] overflow-y-auto w-full"
                        style={{
                          height: 'auto',
                          minHeight: '40px',
                        }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSending || !form.watch('message')?.trim()}
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
        </Form>
      )}
    </div>
  );
}
