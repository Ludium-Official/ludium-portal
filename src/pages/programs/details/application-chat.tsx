import { useApplicationQuery } from '@/apollo/queries/application.generated';
import { useProgramQuery } from '@/apollo/queries/program.generated';
import { ChatBox } from '@/components/chat/chat-box';
import { useParams } from 'react-router';

function ApplicationChat() {
  const { id, applicationId } = useParams();

  const { data } = useApplicationQuery({
    variables: {
      id: applicationId ?? '',
    },
    skip: !applicationId,
  });

  const { data: programData } = useProgramQuery({
    variables: {
      id: id ?? '',
    },
  });

  const program = programData?.program;

  return (
    <div>
      <div className="mt-8">
        <h3 className="flex items-end mb-4">
          <span className="p-2 border-b border-b-primary font-medium text-sm">Communication</span>
          <span className="block border-b w-full" />
        </h3>
        <ChatBox
          applicationId={applicationId ?? ''}
          sponsor={program?.creator}
          builder={data?.application?.applicant}
        />
      </div>
    </div>
  );
}

export default ApplicationChat;
