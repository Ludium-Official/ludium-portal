import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { mockRecruitmentMessages } from '@/mock/recruitment-messages';
import ApplicationChat from '@/pages/programs/details/application-chat';
import { useState } from 'react';
import MessageListItem from './message-list-item';

const RecruitmentMessage: React.FC = () => {
  const [messages] = useState(mockRecruitmentMessages);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    messages[0]?.id || null,
  );

  const selectedMessage = messages.find((msg) => msg.id === selectedMessageId);

  return (
    <div className="flex gap-4 h-[calc(100vh-200px)]">
      <Card className="w-[25%] overflow-y-auto py-4">
        <CardContent className="px-2 space-y-2">
          {messages.map((message) => (
            <MessageListItem
              key={message.id}
              message={message}
              isSelected={selectedMessageId === message.id}
              onClick={() => setSelectedMessageId(message.id)}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="flex flex-row gap-2 w-full p-0">
        <div className="py-5 pr-0 pl-2 w-full">
          {selectedMessage ? (
            <div className="h-full overflow-hidden">
              <ApplicationChat messageId={selectedMessage.id} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a message to view conversation
            </div>
          )}
        </div>

        <div className="px-0 w-[40%]">
          {selectedMessage ? (
            <div className="h-full p-4 bg-[#FBF5FF] overflow-y-auto rounded-r-xl space-y-3">
              <Accordion type="multiple" className="bg-white rounded-lg">
                <AccordionItem value="file" className="px-3 border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-medium text-sm">File</span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-3">
                    <div className="space-y-3">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Resume</p>
                        <p className="font-medium text-sm">resume.pdf</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Portfolio</p>
                        <p className="font-medium text-sm">portfolio_link.url</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="contract" className="px-3 border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-medium text-sm">Contract</span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-3">
                    <div className="space-y-3">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Contract Document</p>
                        <p className="font-medium text-sm">contract_signed.pdf</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Status</p>
                        <p className="font-medium text-sm text-green-600">Signed</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion
                type="multiple"
                defaultValue={['milestone', 'completed']}
                className="bg-white rounded-lg"
              >
                <AccordionItem value="milestone" className="px-3 border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-medium text-sm">Milestone</span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span>Oct 15, 2025</span>
                      </div>
                      <div>
                        <p className="text-sm">Complete UI/UX design and wireframes</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span>Oct 15, 2025</span>
                      </div>
                      <div>
                        <p className="text-sm">Complete UI/UX design and wireframes</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="completed" className="px-3 border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-medium text-sm">Completed</span>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3 pb-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span>Oct 15, 2025</span>
                      </div>
                      <div>
                        <p className="text-sm">Implement frontend and backend features</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="h-full p-4 bg-gray-50 rounded-lg border flex items-center justify-center text-sm text-muted-foreground text-center">
              Applicant details will appear here
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RecruitmentMessage;
