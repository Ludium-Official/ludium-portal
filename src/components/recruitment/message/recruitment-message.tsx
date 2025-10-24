import { mockRecruitmentMessages } from "@/mock/recruitment-messages";
import ApplicationChat from "@/pages/programs/details/application-chat";
import { useState } from "react";
import MessageListItem from "./message-list-item";

const RecruitmentMessage: React.FC = () => {
  const [messages] = useState(mockRecruitmentMessages);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    messages[0]?.id || null
  );

  const selectedMessage = messages.find((msg) => msg.id === selectedMessageId);

  return (
    <div className="flex gap-4 h-[calc(100vh-200px)]">
      <div className="w-[23%] overflow-y-auto">
        <div className="space-y-2">
          {messages.map((message) => (
            <MessageListItem
              key={message.id}
              message={message}
              isSelected={selectedMessageId === message.id}
              onClick={() => setSelectedMessageId(message.id)}
            />
          ))}
        </div>
      </div>

      <div className="w-[51%]">
        {selectedMessage ? (
          <div className="h-full overflow-hidden">
            <ApplicationChat />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a message to view conversation
          </div>
        )}
      </div>

      <div className="w-[23%]">
        {selectedMessage ? (
          <div className="h-full p-4 bg-gray-50 rounded-lg border overflow-y-auto">
            <h4 className="font-semibold mb-4">Applicant Details</h4>
            <div className="text-sm space-y-3">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Name</p>
                <p className="font-medium">
                  {selectedMessage.userInfo.firstName}{" "}
                  {selectedMessage.userInfo.lastName}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">User ID</p>
                <p className="font-medium text-xs break-all">
                  {selectedMessage.userInfo.userId}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">
                  Applied Date
                </p>
                <p className="font-medium text-xs">
                  {selectedMessage.appliedDate}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full p-4 bg-gray-50 rounded-lg border flex items-center justify-center text-sm text-muted-foreground text-center">
            Applicant details will appear here
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruitmentMessage;
