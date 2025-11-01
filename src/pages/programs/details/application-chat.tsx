import { ChatBox } from "@/components/chat/chat-box";
import type { ApplicationV2, ProgramV2 } from "@/types/types.generated";

function ApplicationChat({
  selectedMessage,
  program,
}: {
  selectedMessage: ApplicationV2;
  program?: ProgramV2 | null;
}) {
  return <ChatBox selectedMessage={selectedMessage} program={program} />;
}

export default ApplicationChat;
