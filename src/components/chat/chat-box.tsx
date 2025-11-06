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
  getNewMessages,
  type Unsubscribe,
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
import { Loader2, Send, X, Paperclip, File } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ContractModal } from '@/components/recruitment/contract/contract-modal';

const messageFormSchema = z.object({
  message: z.string().optional(),
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

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
            {message.text && (
              <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
            )}
            {message.files && message.files.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/10 rounded p-2">
                    {file.type.startsWith('image/') ? (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={file.url}
                          alt={file.name}
                          className="max-w-[200px] max-h-[200px] object-contain rounded"
                        />
                      </a>
                    ) : (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:underline"
                      >
                        <File className="w-4 h-4" />
                        <span>{file.name}</span>
                        <span className="text-xs opacity-70">({formatFileSize(file.size)})</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
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
              <>
                {message.text && (
                  <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                )}
                {message.files && message.files.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {file.type.startsWith('image/') ? (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={file.url}
                              alt={file.name}
                              className="max-w-[200px] max-h-[200px] object-contain rounded"
                            />
                          </a>
                        ) : (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm hover:underline"
                          >
                            <File className="w-4 h-4" />
                            <span>{file.name}</span>
                            <span className="text-xs opacity-70">
                              ({formatFileSize(file.size)})
                            </span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<{ file: File; preview: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevchatRoomId = useRef<string>('');
  const newestTimestampRef = useRef<Timestamp | null>(null);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const chatRoomId = selectedMessage.chatroomMessageId;

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: '',
    },
  });

  useEffect(() => {
    // Create previews for image files
    const previews = selectedFiles
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    setFilePreviews(previews);

    // Cleanup preview URLs
    return () => {
      previews.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [selectedFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      return newFiles;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  useEffect(() => {
    if (!chatRoomId) return;

    if (prevchatRoomId.current === chatRoomId) return;

    prevchatRoomId.current = chatRoomId;
    setIsLoading(true);
    setMessages([]);
    setHasMore(true);
    setOldestDoc(null);
    newestTimestampRef.current = null;

    // Cleanup previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    loadInitialMessages(chatRoomId, totalMessages)
      .then(({ messages: initialMessages, oldestDoc: doc }) => {
        setMessages(initialMessages);

        if (doc) {
          setOldestDoc(doc);
        }

        if (initialMessages.length > 0) {
          const newest = initialMessages[initialMessages.length - 1];
          const timestamp = newest.timestamp;
          newestTimestampRef.current = timestamp;
        } else {
          const now = FirestoreTimestamp.now();
          newestTimestampRef.current = now;
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

  // 실시간 구독 + 폴링 백업 하이브리드 방식
  useEffect(() => {
    if (!chatRoomId || !newestTimestampRef.current) return;

    // Cleanup previous subscription if exists
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    // 실시간 구독 설정
    const unsubscribe = subscribeToNewMessages(
      chatRoomId,
      newestTimestampRef.current,
      (newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        newestTimestampRef.current = newMsg.timestamp;
        lastActivityRef.current = Date.now(); // 실시간 메시지 받음
      },
      (error) => {
        console.error('❌ Realtime subscription error:', error);
      },
    );

    unsubscribeRef.current = unsubscribe;

    // 폴링 백업: 30초 동안 실시간 메시지가 없으면 폴링으로 확인
    const pollingInterval = setInterval(async () => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;

      // 30초 이상 실시간 메시지가 없으면 폴링으로 확인
      if (timeSinceLastActivity > 30000 && newestTimestampRef.current) {
        try {
          const newMessages = await getNewMessages(chatRoomId, newestTimestampRef.current);

          if (newMessages.length > 0) {
            setMessages((prev) => {
              const existingIds = new Set(prev.map((m) => m.id));
              const uniqueNewMessages = newMessages.filter((m) => !existingIds.has(m.id));

              if (uniqueNewMessages.length === 0) return prev;

              return [...prev, ...uniqueNewMessages];
            });

            const latestMessage = newMessages[newMessages.length - 1];
            newestTimestampRef.current = latestMessage.timestamp;
            lastActivityRef.current = Date.now();
          }
        } catch (error) {
          console.error('❌ Error polling new messages:', error);
        }
      }
    }, 10000); // 10초마다 체크

    pollingIntervalRef.current = pollingInterval;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [chatRoomId]);

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
    if ((!data.message?.trim() && selectedFiles.length === 0) || !userId) {
      return;
    }

    setIsSending(true);

    try {
      const messageId = await sendMessage(
        chatRoomId || '',
        data.message?.trim() || '',
        userId,
        selectedFiles.length > 0 ? selectedFiles : undefined,
      );

      // Optimistic update: Add the message to local state immediately
      const newMessage: ChatMessage = {
        id: messageId,
        chatRoomId: chatRoomId || '',
        text: data.message?.trim() || '',
        senderId: userId,
        timestamp: FirestoreTimestamp.now(),
        ...(selectedFiles.length > 0 && {
          files: selectedFiles.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file), // Temporary URL until real one loads
            type: file.type,
            size: file.size,
          })),
        }),
      };

      setMessages((prev) => [...prev, newMessage]);
      newestTimestampRef.current = newMessage.timestamp;

      form.reset();
      setSelectedFiles([]);
      setFilePreviews([]);
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

  // 메시지 목록이 업데이트되면 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

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
            {/* File Previews */}
            {selectedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => {
                  const preview = filePreviews.find((p) => p.file === file);
                  return (
                    <div
                      key={index}
                      className="relative inline-block bg-white rounded-lg border p-2 max-w-[150px]"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {preview ? (
                        <img
                          src={preview.preview}
                          alt={file.name}
                          className="w-full h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <File className="w-8 h-8 text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex gap-2 items-end">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <Button type="button" variant="outline" size="icon" asChild>
                  <div>
                    <Paperclip className="w-4 h-4" />
                  </div>
                </Button>
              </label>
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
                disabled={
                  isSending || (!form.watch('message')?.trim() && selectedFiles.length === 0)
                }
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
