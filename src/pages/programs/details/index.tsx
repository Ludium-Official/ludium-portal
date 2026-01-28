import MobileBackHeader from '@/components/common/mobile-back-header';
import Container from '@/components/layout/container';
import ProgramDetailPanel from '@/components/recruitment/overview/program-detail-panel';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';

const DetailsPage: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className={cn('bg-white rounded-2xl px-6 py-4 w-full', isMobile && 'p-0')}>
      <MobileBackHeader title="Program Overview" backLink="/programs/recruitment" />
      <Container className="px-4 py-8">
        <ProgramDetailPanel />
      </Container>
    </div>
  );
};

export default DetailsPage;
