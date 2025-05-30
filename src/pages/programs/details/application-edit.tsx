import { useApplicationQuery } from '@/apollo/queries/application.generated';
import { useParams } from 'react-router';

function ApplicationEdit() {
  const { applicationId } = useParams();
  const { data: applicationData } = useApplicationQuery({
    variables: {
      id: applicationId ?? '',
    },
  });
  console.log('🚀 ~ ApplicationEdit ~ applicationData:', applicationData);

  return <div></div>;
}

export default ApplicationEdit;
