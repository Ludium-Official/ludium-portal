import { useContractsByApplicationV2Query } from '@/apollo/queries/contracts-by-application-v2.generated';
import { useUserV2Query } from '@/apollo/queries/user-v2.generated';
import contractLogo from '@/assets/icons/contract.svg';
import ludiumAssignmentLogo from '@/assets/ludium-assignment.svg';
import { ContractModal } from '@/components/recruitment/contract/contract-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import {
  type ChatMessage,
  type Unsubscribe,
  loadInitialMessages,
  loadMoreMessages as loadMoreMessagesFromFirebase,
  sendMessage,
  subscribeToContractMessages,
  subscribeToNewMessages,
} from '@/lib/firebase-chat';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import { cn, getUserDisplayName } from '@/lib/utils';
import type { ContractInformation } from '@/types/recruitment';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type DocumentData,
  Timestamp as FirestoreTimestamp,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore';
import { File, FolderOpen, Image as ImageIcon, Loader2, Paperclip, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import * as z from 'zod';

const messageFormSchema = z.object({
  message: z.string().optional(),
});

type MessageFormData = z.infer<typeof messageFormSchema>;

interface MessageItemProps {
  message: ChatMessage;
  timestamp: Timestamp;
  contractInformation: ContractInformation;
}

function MessageItem({ message, timestamp, contractInformation }: MessageItemProps) {
  const { userId } = useAuth();

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const { programInfo, applicationInfo } = contractInformation;
  const shouldUseApplicant =
    applicationInfo.applicant && applicationInfo.applicant.id === message.senderId;
  const isMyMessage = userId === message.senderId;
  const isLudiumAssistant = Number(message.senderId) <= 0;
  const isUserSponsor = userId === programInfo.sponsor?.id;
  const isUserBuilder = userId === applicationInfo.applicant?.id;

  const { data: contractsData } = useContractsByApplicationV2Query({
    variables: {
      applicationId: Number(applicationInfo.id) || 0,
      pagination: { limit: 1000, offset: 0 },
    },
    skip: !applicationInfo.id,
  });

  const latestContract = contractsData?.contractsByApplicationV2?.data
    ?.filter((contract) => contract.onchainContractId != null)
    .sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (a.createdAt && !b.createdAt) return -1;
      if (!a.createdAt && b.createdAt) return 1;
      return 0;
    })[0];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const { data: userData } = useUserV2Query({
    variables: { id: message.senderId },
    skip: !message.senderId || shouldUseApplicant || isMyMessage,
  });

  let senderName = '';
  let senderImage = '';

  if (!isMyMessage) {
    if (shouldUseApplicant && applicationInfo.applicant) {
      const fullName = getUserDisplayName(
        applicationInfo.applicant.nickname,
        applicationInfo.applicant.email,
      );
      senderName = fullName;
      senderImage = applicationInfo.applicant.profileImage || '';
    } else {
      const user = userData?.userV2;
      const fullName = getUserDisplayName(user?.nickname, user?.email);
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

          <div className="flex flex-col items-end space-y-2">
            {message.text && (
              <div className="rounded-lg px-4 py-2 bg-primary-light w-fit">
                <p className="text-sm whitespace-pre-wrap break-words">
                  {!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(message.text) ? (
                    message.text
                  ) : (
                    <Link
                      to={message.text}
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      {message.text}
                    </Link>
                  )}
                </p>
              </div>
            )}
            {message.files && message.files.length > 0 && (
              <div className="flex flex-col items-end space-y-2">
                {message.files.map((file, index) => (
                  <Link
                    key={index}
                    to={file.url}
                    target="_blank"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:bg-slate-50 transition-colors w-fit"
                  >
                    {file.type.startsWith('image/') ? (
                      <div className="w-10 h-10 rounded-full bg-[#F2F2F2] flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-5 h-5 text-gray-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#F2F2F2] flex items-center justify-center flex-shrink-0">
                        <FolderOpen className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="max-w-[300px] text-sm font-semibold text-gray-800 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                    </div>
                  </Link>
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
      {message.senderId !== '0' && (
        <Avatar className="h-10 w-10">
          <AvatarImage src={isLudiumAssistant ? ludiumAssignmentLogo : senderImage} />
          <AvatarFallback className="text-sm">{getInitials(senderName)}</AvatarFallback>
        </Avatar>
      )}

      <div className="flex flex-col flex-1">
        {message.senderId !== '0' && (
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
        )}

        <div className="space-y-2">
          {message.senderId === '0' && (
            <div className="flex justify-center w-full italic mt-3">
              <p className="text-sm text-[#7C7C7C]">{message.text}</p>
            </div>
          )}
          {message.senderId === '-1' || message.senderId === '-2' ? (
            (message.senderId === '-1' && isUserBuilder) ||
            (message.senderId === '-2' && isUserSponsor) ? (
              <div
                className={cn(
                  'rounded-lg px-4 py-2 bg-[#F8F5FA] text-slate-900 w-fit max-w-[70%]',
                  isLudiumAssistant && 'py-4 bg-white border border-primary',
                  !message.is_active && 'opacity-50',
                )}
              >
                <div>
                  <img src={contractLogo} alt="contract" className="mb-3" />
                  <div className="font-bold text-lg">Employment Contract</div>
                  <div className={cn('mt-1 text-sm', message.is_active && 'mb-5')}>
                    {message.senderId === '-1'
                      ? 'The sponsor has sent you a contract. Review the terms and complete your signature to confirm the agreement.'
                      : 'The builder has signed the contract. Complete your final signature to confirm the agreement.'}
                  </div>
                  {message.is_active && (
                    <Button
                      variant="purple"
                      className="w-full"
                      onClick={() => setIsContractModalOpen(true)}
                    >
                      View Contract
                    </Button>
                  )}
                </div>
                <ContractModal
                  open={isContractModalOpen}
                  onOpenChange={setIsContractModalOpen}
                  contractInformation={{
                    programInfo: {
                      id: programInfo.id || '',
                      title: programInfo.title || '',
                      sponsor: programInfo.sponsor || null,
                      networkId: programInfo.networkId || null,
                      tokenId: programInfo.tokenId || null,
                      price: programInfo.price || null,
                    },
                    applicationInfo: {
                      id: applicationInfo.id || '',
                      applicant: applicationInfo.applicant || null,
                      status: applicationInfo.status || null,
                      chatRoomId: applicationInfo.chatRoomId || null,
                    },
                    contractSnapshot: latestContract
                      ? {
                          ...latestContract,
                          onchainContractId: latestContract.onchainContractId ?? undefined,
                        }
                      : undefined,
                  }}
                  assistantId={message.senderId}
                  readOnly={!message.is_active}
                  isChatBox={true}
                />
              </div>
            ) : (
              <div
                className={cn(
                  'rounded-lg px-4 py-2 bg-[#F8F5FA] text-slate-900 w-fit max-w-[70%]',
                  isLudiumAssistant && 'py-4 bg-white border border-primary',
                )}
              >
                <p className="text-sm text-slate-600">
                  {message.senderId === '-1'
                    ? 'The contract has been sent. The builder is reviewing and signing it. Please wait.'
                    : "You've signed the contract. Please wait for the sponsor to complete the final signature to activate the agreement."}
                </p>
              </div>
            )
          ) : (
            <>
              {message.senderId !== '0' && message.text && (
                <div
                  className={cn(
                    'rounded-lg px-4 py-2 bg-[#F8F5FA] text-slate-900 w-fit max-w-[70%]',
                    isLudiumAssistant && 'py-4 bg-white border border-primary',
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(message.text) ? (
                      message.text
                    ) : (
                      <Link
                        to={message.text}
                        target="_blank"
                        className="text-blue-500 hover:underline"
                      >
                        {message.text}
                      </Link>
                    )}
                  </p>
                </div>
              )}
              {message.files && message.files.length > 0 && (
                <div className="space-y-2">
                  {message.files.map((file, index) => (
                    <Link
                      key={index}
                      to={file.url}
                      target="_blank"
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-slate-50 transition-colors w-fit"
                    >
                      {file.type.startsWith('image/') ? (
                        <div className="w-10 h-10 rounded-full bg-[#F2F2F2] flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-5 h-5 text-gray-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#F2F2F2] flex items-center justify-center flex-shrink-0">
                          <FolderOpen className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="max-w-[300px] text-sm font-semibold text-gray-800 truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChatBox({
  contractInformation,
}: {
  contractInformation: ContractInformation;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevchatRoomId = useRef<string>('');
  const newestTimestampRef = useRef<Timestamp | null>(null);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const contractUnsubscribeRef = useRef<Unsubscribe | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const chatRoomId = contractInformation.applicationInfo.chatRoomId;

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: '',
    },
  });

  useEffect(() => {
    const previews = selectedFiles
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    setFilePreviews(previews);

    return () => {
      previews.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [selectedFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
    const MAX_FILE_SIZE = 50 * 1024 * 1024;

    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    files.forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;

      if (file.size > maxSize) {
        invalidFiles.push(file);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      const fileType = invalidFiles[0].type.startsWith('image/') ? 'Image' : 'File';
      const maxSize = invalidFiles[0].type.startsWith('image/') ? '10MB' : '50MB';
      notify(`${fileType} is too heavy. Maximum upload size is ${maxSize}.`, 'error');
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }

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
          lastActivityRef.current = Date.now();
        } else {
          const now = FirestoreTimestamp.now();
          newestTimestampRef.current = now;
          lastActivityRef.current = Date.now();
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
    if (!chatRoomId) return;

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    if (contractUnsubscribeRef.current) {
      contractUnsubscribeRef.current();
      contractUnsubscribeRef.current = null;
    }

    if (!newestTimestampRef.current) return;

    const unsubscribe = subscribeToNewMessages(
      chatRoomId,
      newestTimestampRef.current,
      (newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        newestTimestampRef.current = newMsg.timestamp;
        lastActivityRef.current = Date.now();
      },
      (error) => {
        console.error('❌ Realtime subscription error:', error);
      },
      (updatedMsg) => {
        setMessages((prev) => prev.map((m) => (m.id === updatedMsg.id ? updatedMsg : m)));
        lastActivityRef.current = Date.now();
      },
    );

    const contractUnsubscribe = subscribeToContractMessages(
      chatRoomId,
      (updatedMsg) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === updatedMsg.id && m.is_active !== updatedMsg.is_active ? updatedMsg : m,
          ),
        );
        lastActivityRef.current = Date.now();
      },
      (error) => {
        console.error('❌ Contract message subscription error:', error);
      },
    );

    unsubscribeRef.current = unsubscribe;
    contractUnsubscribeRef.current = contractUnsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      if (contractUnsubscribeRef.current) {
        contractUnsubscribeRef.current();
        contractUnsubscribeRef.current = null;
      }
    };
  }, [chatRoomId, messages.length]);

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

      const newMessage: ChatMessage = {
        id: messageId,
        chatRoomId: chatRoomId || '',
        text: data.message?.trim() || '',
        senderId: userId,
        timestamp: FirestoreTimestamp.now(),
        ...(selectedFiles.length > 0 && {
          files: selectedFiles.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),
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

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
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

  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
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
          <div className="flex-1 flex justify-center mt-5 text-muted-foreground text-sm italic">
            The chat has been created. Start by greeting the builder and sharing project details.
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
                contractInformation={contractInformation}
              />
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {chatRoomId && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSendMessage)} className="p-4 border-t bg-slate-3">
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
                        ref={textareaRef}
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
