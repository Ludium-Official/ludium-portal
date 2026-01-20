import { useThreadQuery } from '@/apollo/queries/thread.generated';
import { useTopViewedArticlesQuery } from '@/apollo/queries/top-viewed-articles.generated';
import TrendingArticles from '@/components/community/trending-articles';
import Container from '@/components/layout/container';
import { ArrowLeftIcon, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import ThreadItem from '../_components/thread-item';
import { Thread } from '@/types/types.generated';
import { ShareButton } from '@/components/ui/share-button';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';

const ThreadDetailsPage = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  const trendingPlaceholderRef = useRef<HTMLDivElement | null>(null);
  const [trendingLeft, setTrendingLeft] = useState<number | null>(null);
  const [isFixed, setIsFixed] = useState(false);

  const {
    data: threadData,
    loading: threadLoading,
    refetch,
  } = useThreadQuery({
    variables: { id: id! },
    skip: !id,
  });

  const { data: trendingData } = useTopViewedArticlesQuery();

  const thread = threadData?.thread as Thread | undefined;
  const trendingArticles = trendingData?.topViewedArticles ?? [];

  useEffect(() => {
    const findScrollContainer = (): Element | null => {
      const radixViewport = document.querySelector('[data-radix-scroll-area-viewport]');
      if (radixViewport) return radixViewport;

      let element = trendingPlaceholderRef.current?.parentElement;
      while (element) {
        const style = window.getComputedStyle(element);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          return element;
        }
        element = element.parentElement;
      }
      return null;
    };

    const scrollContainer = findScrollContainer();

    const updatePosition = () => {
      if (trendingPlaceholderRef.current) {
        const rect = trendingPlaceholderRef.current.getBoundingClientRect();
        setTrendingLeft(rect.left);
      }
    };

    const handleScroll = () => {
      const threshold = 12;

      if (trendingPlaceholderRef.current) {
        const rect = trendingPlaceholderRef.current.getBoundingClientRect();
        setTrendingLeft(rect.left);
        setIsFixed(rect.top <= threshold);
      }
    };

    updatePosition();

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    window.addEventListener('resize', updatePosition);

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  if (threadLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Thread not found</p>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen', isMobile && 'bg-white')}>
      <Container className={cn('max-w-[1000px] px-6 py-10', isMobile && 'w-full px-4 py-5')}>
        <div className="flex gap-7">
          <div className="flex-1">
            <div
              className={cn(
                'bg-white rounded-md border border-gray-200',
                isMobile && 'border-none',
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-between pt-5 pb-4 px-8',
                  isMobile && 'px-0 pt-0 pb-3',
                )}
              >
                <Link
                  to="/community/threads"
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border hover:bg-gray-100',
                    isMobile && 'w-8 h-8',
                  )}
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                </Link>
                <ShareButton className="text-sm" />
              </div>
              <ThreadItem
                thread={thread}
                onThreadUpdated={() => {
                  refetch();
                }}
                isDetailPage={true}
              />
            </div>
          </div>

          {!isMobile && (
            <div ref={trendingPlaceholderRef} className="w-[280px] flex-shrink-0">
              {!isFixed && <TrendingArticles articles={trendingArticles} />}
            </div>
          )}
        </div>
      </Container>

      {!isMobile && isFixed && trendingLeft !== null && (
        <div className="fixed top-3 w-[280px] mt-2" style={{ left: trendingLeft }}>
          <TrendingArticles articles={trendingArticles} />
        </div>
      )}
    </div>
  );
};

export default ThreadDetailsPage;
