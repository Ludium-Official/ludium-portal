import { useApplicationQuery } from "@/apollo/queries/application.generated";
import { useProgramQuery } from "@/apollo/queries/program.generated";
import { ChatBox } from "@/components/chat/chat-box";
import { useParams } from "react-router";

function ApplicationChat() {
  const { id, applicationId } = useParams();

  const { data } = useApplicationQuery({
    variables: {
      id: applicationId ?? "",
    },
    skip: !applicationId,
  });

  const { data: programData } = useProgramQuery({
    variables: {
      id: id ?? "",
    },
  });

  const program = programData?.program;

  return (
    <ChatBox
      applicationId={applicationId ?? ""}
      sponsor={program?.creator}
      builder={data?.application?.applicant}
    />
  );
}

export default ApplicationChat;
