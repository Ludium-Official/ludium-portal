import { useParams } from 'react-router';
import { HackathonDetailView } from './_components/hackathon-detail-view';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';

const HackathonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();

  return (
    <div className={cn('bg-white rounded-2xl w-full', isMobile ? 'px-0 py-4' : 'px-10 py-5')}>
      <HackathonDetailView id={id ?? ''} />
    </div>
  );
};

export default HackathonPage;
