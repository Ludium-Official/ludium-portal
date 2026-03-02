import { useParams } from 'react-router';
import { HackathonDetailView } from './_components/hackathon-detail-view';

const HackathonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="bg-white rounded-2xl px-10 py-5 w-full">
      <HackathonDetailView id={id ?? ''} />
    </div>
  );
};

export default HackathonPage;
