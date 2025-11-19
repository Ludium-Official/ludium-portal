import { useContractsByApplicationV2Query } from '@/apollo/queries/contracts-by-application-v2.generated';
import { useGetMilestonesV2Query } from '@/apollo/queries/milestones-v2.generated';
import { useGetProgramV2Query } from '@/apollo/queries/program-v2.generated';
import { useApplicationsByProgramV2Query } from '@/apollo/queries/applications-by-program-v2.generated';
import { ChatBox } from '@/components/chat/chat-box';
import { ContractModal } from '@/components/recruitment/contract/contract-modal';
import { HireButton } from '@/components/recruitment/hire-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChatMessageFile, getAllFiles, getLatestMessage } from '@/lib/firebase-chat';
import { useAuth } from '@/lib/hooks/use-auth';
import { fromUTCString } from '@/lib/utils';
import type { ContractInformation } from '@/types/recruitment';
import { ApplicationStatusV2, MilestoneStatusV2, type MilestoneV2 } from '@/types/types.generated';
import type { Timestamp } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useNetworks } from '@/contexts/networks-context';
import MessageListItem from './message-list-item';
import { MilestoneModal } from './milestone-modal';
import { ApplicationSidebar } from './application-sidebar';

const RecruitmentMessage: React.FC<{}> = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const { networks: networksWithTokens } = useNetworks();

  const { data } = useApplicationsByProgramV2Query({
    variables: {
      query: {
        programId: id || '',
      },
    },
    skip: !id,
  });

  const applications = data?.applicationsByProgramV2?.data || [];

  const isSponsor = useMemo(
    () => applications[0]?.program?.sponsor?.id === userId,
    [applications, userId],
  );
  const hasMessageIdRoom = useMemo(
    () => applications.filter((application) => application.chatroomMessageId),
    [applications],
  );

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneV2 | null>(null);
  const [isNewMilestoneMode, setIsNewMilestoneMode] = useState(true);
  const [latestMessages, setLatestMessages] = useState<
    Record<string, { text: string; timestamp: Timestamp; senderId: string; isFile: boolean }>
  >({});
  const [files, setFiles] = useState<ChatMessageFile[]>([]);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  useEffect(() => {
    if (hasMessageIdRoom.length > 0 && hasMessageIdRoom[0].chatroomMessageId) {
      const firstChatroomId = hasMessageIdRoom[0].chatroomMessageId;
      const isSelectedValid =
        selectedMessageId &&
        hasMessageIdRoom.find((app) => app.chatroomMessageId === selectedMessageId);
      if (!isSelectedValid) {
        setSelectedMessageId(firstChatroomId);
      }
    }
  }, [isSponsor, hasMessageIdRoom, selectedMessageId]);

  const selectedApplication = hasMessageIdRoom.find(
    (applicant) => applicant.chatroomMessageId === selectedMessageId,
  );

  const { data: programData } = useGetProgramV2Query({
    variables: { id: selectedApplication?.program?.id || '' },
    skip: !selectedApplication?.program?.id,
  });

  const { data: milestonesData, refetch: refetchMilestones } = useGetMilestonesV2Query({
    variables: {
      query: {
        applicantId: selectedApplication?.applicant?.id,
        programId: selectedApplication?.program?.id,
      },
    },
    skip: !selectedApplication?.applicant?.id || !selectedApplication?.program?.id,
  });

  const { data: contractsData } = useContractsByApplicationV2Query({
    variables: {
      applicationId: Number(selectedApplication?.id) || 0,
      pagination: { limit: 1000, offset: 0 },
    },
    skip: !selectedApplication?.id,
  });

  const contracts =
    contractsData?.contractsByApplicationV2?.data
      ?.filter((contract) => contract.onchainContractId)
      .sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return 0;
      }) || [];

  const program = programData?.programV2;
  const allMilestones = milestonesData?.milestonesV2?.data || [];

  const filteredMilestones = isSponsor
    ? allMilestones
    : allMilestones.filter(
        (m) =>
          m.status === MilestoneStatusV2.InProgress || m.status === MilestoneStatusV2.Completed,
      );

  const sortedMilestones = [...filteredMilestones].sort((a, b) => {
    const aIsDraft = (a as any).status === MilestoneStatusV2.Draft;
    const bIsDraft = (b as any).status === MilestoneStatusV2.Draft;

    if (aIsDraft && !bIsDraft) return 1;
    if (!aIsDraft && bIsDraft) return -1;

    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;

    const aDate = fromUTCString(a.deadline);
    const bDate = fromUTCString(b.deadline);
    if (!aDate || !bDate) return 0;
    return aDate.getTime() - bDate.getTime();
  });

  const activeMilestones = sortedMilestones.filter((m) => !(m as any).isCompleted);
  const completedMilestones = sortedMilestones.filter((m) => (m as any).isCompleted);

  const contractInformation: ContractInformation = {
    title: selectedApplication?.program?.title || '',
    applicationId: selectedApplication?.id || '',
    programId: selectedApplication?.program?.id || '',
    sponsor: selectedApplication?.program?.sponsor || null,
    applicant: selectedApplication?.applicant || null,
    networkId: selectedApplication?.program?.networkId || null,
    chatRoomId: selectedApplication?.chatroomMessageId || null,
    applicationStatus: selectedApplication?.status || null,
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0]?.toUpperCase() || '??';
  };

  const handleMilestoneClick = (milestone: MilestoneV2) => {
    setSelectedMilestone(milestone);
    setIsNewMilestoneMode(false);
    setIsMilestoneModalOpen(true);
  };

  const handleNewMilestoneClick = () => {
    setSelectedMilestone(null);
    setIsNewMilestoneMode(true);
    setIsMilestoneModalOpen(true);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchLatestMessages = async () => {
        const messagePromises = hasMessageIdRoom.map(async (application) => {
          if (!application.chatroomMessageId) return null;
          const { message, timestamp, senderId, isFile } = await getLatestMessage(
            application.chatroomMessageId,
          );
          if (message && timestamp && senderId) {
            return {
              chatroomMessageId: application.chatroomMessageId,
              text: message.text,
              timestamp,
              senderId,
              isFile,
            };
          }
          return null;
        });

        const results = await Promise.all(messagePromises);
        const messagesMap: Record<
          string,
          {
            text: string;
            timestamp: Timestamp;
            senderId: string;
            isFile: boolean;
          }
        > = {};

        results.forEach((result) => {
          if (result && result.chatroomMessageId) {
            messagesMap[result.chatroomMessageId] = {
              text: result.text,
              timestamp: result.timestamp,
              senderId: result.senderId,
              isFile: result.isFile,
            };
          }
        });

        setLatestMessages(messagesMap);
      };

      if (hasMessageIdRoom.length > 0) {
        fetchLatestMessages();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [hasMessageIdRoom]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchFiles = async () => {
        if (selectedApplication?.chatroomMessageId) {
          const allFiles = await getAllFiles(selectedApplication.chatroomMessageId);
          setFiles(allFiles);
        } else {
          setFiles([]);
        }
      };

      fetchFiles();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedApplication?.chatroomMessageId]);

  const currentNetwork = networksWithTokens.find(
    (network) => Number(network.id) === contractInformation.networkId,
  );

  const isHandleMakeNewMilestone = useMemo(() => {
    if (contractInformation.applicationStatus === ApplicationStatusV2.PendingSignature) {
      return false;
    }

    if (filteredMilestones.length === 0) {
      return true;
    }

    const allDeadlinesPassed = filteredMilestones.every((milestone) => {
      if (!milestone.deadline) return false;
      const deadline = fromUTCString(milestone.deadline);
      if (!deadline) return false;
      return deadline.getTime() <= new Date().getTime();
    });

    return !allDeadlinesPassed;
  }, [contractInformation, filteredMilestones]);

  const isUnderReviewMilestone = useMemo(() => {
    const isUnderReviewMilestones =
      filteredMilestones.filter((m) => m.status === MilestoneStatusV2.UnderReview).length > 0;

    return (
      isUnderReviewMilestones &&
      contractInformation.applicationStatus !== ApplicationStatusV2.PendingSignature
    );
  }, [filteredMilestones, contractInformation.applicationStatus]);

  return (
    <div className="flex gap-4 h-[calc(100vh-200px)]">
      {isSponsor && (
        <Card className="gap-3 w-[25%] overflow-y-auto py-5">
          <CardHeader className="px-5">
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="px-5 space-y-2">
            {hasMessageIdRoom.map((applicant) => {
              const latestMessage = applicant.chatroomMessageId
                ? latestMessages[applicant.chatroomMessageId]
                : null;
              return (
                <MessageListItem
                  key={applicant.chatroomMessageId}
                  message={applicant}
                  isSelected={selectedMessageId === applicant.chatroomMessageId}
                  onClick={() => setSelectedMessageId(applicant.chatroomMessageId || null)}
                  latestMessageText={
                    latestMessage?.isFile ? '📂 File uploaded' : (latestMessage?.text ?? null)
                  }
                  latestMessageTimestamp={latestMessage?.timestamp || null}
                  latestMessageSenderId={latestMessage?.senderId || null}
                  currentUserId={userId || null}
                />
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card className="flex flex-row gap-2 w-full p-0">
        <div className="pt-5 pb-1 pr-0 pl-2 w-full flex flex-col">
          {selectedApplication ? (
            <>
              <div className="flex items-center justify-between border-b pb-4 px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        userId === selectedApplication.applicant?.id
                          ? program?.sponsor?.profileImage || ''
                          : selectedApplication.applicant?.profileImage || ''
                      }
                      alt={
                        userId === selectedApplication.applicant?.id
                          ? `${program?.sponsor?.firstName || ''} ${
                              program?.sponsor?.lastName || ''
                            }`.trim() ||
                            program?.sponsor?.email ||
                            'Unknown'
                          : `${selectedApplication.applicant?.firstName || ''} ${
                              selectedApplication.applicant?.lastName || ''
                            }`.trim() ||
                            selectedApplication.applicant?.email ||
                            'Unknown'
                      }
                    />
                    <AvatarFallback className="text-sm font-semibold">
                      {userId === selectedApplication.applicant?.id
                        ? getInitials(
                            `${program?.sponsor?.firstName || ''} ${
                              program?.sponsor?.lastName || ''
                            }`.trim() ||
                              program?.sponsor?.email ||
                              '',
                          )
                        : getInitials(
                            `${selectedApplication.applicant?.firstName || ''} ${
                              selectedApplication.applicant?.lastName || ''
                            }`.trim() ||
                              selectedApplication.applicant?.email ||
                              '',
                          )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-lg">
                      {userId === selectedApplication.applicant?.id
                        ? `${program?.sponsor?.firstName || ''} ${
                            program?.sponsor?.lastName || ''
                          }`.trim() ||
                          program?.sponsor?.email ||
                          'Unknown'
                        : `${selectedApplication.applicant?.firstName || ''} ${
                            selectedApplication.applicant?.lastName || ''
                          }`.trim() ||
                          selectedApplication.applicant?.email ||
                          'Unknown'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {userId === selectedApplication.applicant?.id
                        ? program?.sponsor?.organizationName
                        : selectedApplication.applicant?.organizationName}
                    </p>
                  </div>
                </div>
                {program?.sponsor?.id === userId && (
                  <HireButton
                    contractInformation={contractInformation}
                    disabled={!isUnderReviewMilestone}
                  />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatBox selectedMessage={selectedApplication} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a message to view conversation
            </div>
          )}
        </div>

        <div className="px-0 w-[40%]">
          {selectedApplication ? (
            <ApplicationSidebar
              activeMilestones={activeMilestones}
              completedMilestones={completedMilestones}
              files={files}
              contracts={contracts}
              isSponsor={isSponsor}
              isHandleMakeNewMilestone={isHandleMakeNewMilestone}
              onMilestoneClick={handleMilestoneClick}
              onNewMilestoneClick={handleNewMilestoneClick}
              onContractClick={(contract) => {
                setSelectedContract(contract);
                setIsContractModalOpen(true);
              }}
            />
          ) : (
            <div className="h-full p-4 bg-gray-50 rounded-lg border flex items-center justify-center text-sm text-muted-foreground text-center">
              Applicant details will appear here
            </div>
          )}
        </div>
      </Card>

      <MilestoneModal
        open={isMilestoneModalOpen}
        onOpenChange={setIsMilestoneModalOpen}
        selectedMilestone={selectedMilestone}
        setSelectedMilestone={setSelectedMilestone}
        isNewMilestoneMode={isNewMilestoneMode}
        setIsNewMilestoneMode={setIsNewMilestoneMode}
        activeMilestones={activeMilestones}
        completedMilestones={completedMilestones}
        applicantId={selectedApplication?.applicant?.id || ''}
        programId={selectedApplication?.program?.id || ''}
        onRefetch={refetchMilestones}
        isSponsor={isSponsor}
        isHandleMakeNewMilestone={isHandleMakeNewMilestone}
        currentNetwork={currentNetwork}
      />

      {selectedContract && (
        <ContractModal
          open={isContractModalOpen}
          onOpenChange={setIsContractModalOpen}
          contractInformation={contractInformation}
          assistantId={undefined}
          readOnly={true}
          contractSnapshot={selectedContract}
        />
      )}
    </div>
  );
};

export default RecruitmentMessage;
