import { useThreadsQuery } from '@/apollo/queries/threads.generated';
import { useMyThreadsQuery } from '@/apollo/queries/my-threads.generated';
import { useTopViewedArticlesQuery } from '@/apollo/queries/top-viewed-articles.generated';
import { TopViewedArticlesQuery } from '@/apollo/queries/top-viewed-articles.generated';
import { useCreateThreadMutation } from '@/apollo/mutation/create-thread.generated';
import { MediaUploadPreview } from '@/components/community/media-gallery';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/hooks/use-auth';
import { CirclePlus, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import ThreadItem from './_components/thread-item';
import { Thread } from '@/types/types.generated';
import notify from '@/lib/notify';

type TabType = 'all' | 'myPost';

interface TabHeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isLoggedIn: boolean;
  onPostClick: () => void;
}

const TabHeader = ({ activeTab, setActiveTab, isLoggedIn, onPostClick }: TabHeaderProps) => (
  <div className="flex items-center justify-between">
    <div className="flex gap-2">
      <button
        onClick={() => setActiveTab('all')}
        className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
          activeTab === 'all'
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        }`}
      >
        All
      </button>
      {isLoggedIn && (
        <button
          onClick={() => setActiveTab('myPost')}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'myPost'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          My Post
        </button>
      )}
    </div>
    {isLoggedIn && (
      <Button variant="outline" size="sm" className="gap-2" onClick={onPostClick}>
        <CirclePlus className="w-4 h-4" />
        Post
      </Button>
    )}
  </div>
);
interface TrendingArticlesProps {
  articles: NonNullable<TopViewedArticlesQuery['topViewedArticles']>;
}

const TrendingArticles = ({ articles }: TrendingArticlesProps) => (
  <div className="bg-white border border-gray-200 rounded-md px-3 py-5">
    <h3 className="font-semibold text-lg mb-4 text-gray-500">Trending Articles</h3>
    <div className="flex flex-col gap-5">
      {articles.slice(0, 6).map((article) => (
        <Link
          key={article.id}
          to={`/community/articles/${article.id}`}
          className="border-b border-gray-200 hover:bg-gray-50 pb-5 transition-colors last:border-b-0 last:pb-0"
        >
          <h4 className="mb-2 font-bold text-sm">{article.title}</h4>
          <div className="flex items-center gap-2">
            <Avatar className="w-5 h-5">
              <AvatarImage src={article.author?.profileImage || ''} />
              <AvatarFallback className="text-xs">
                {article.author?.nickname?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {article.author?.nickname || 'Anonymous'}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

const ThreadsPage = () => {
  const navigate = useNavigate();
  const { isAuthed, isLoggedIn } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postMedia, setPostMedia] = useState<File[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isLoadingRef = useRef(false);
  const trendingPlaceholderRef = useRef<HTMLDivElement | null>(null);
  const tabHeaderPlaceholderRef = useRef<HTMLDivElement | null>(null);
  const [trendingLeft, setTrendingLeft] = useState<number | null>(null);
  const [tabHeaderPosition, setTabHeaderPosition] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [isTabHeaderFixed, setIsTabHeaderFixed] = useState(false);

  const itemsPerPage = 10;

  const {
    data: threadsData,
    loading: threadsLoading,
    refetch: refetchThreads,
  } = useThreadsQuery({
    variables: {
      input: {
        pagination: {
          offset: (page - 1) * itemsPerPage,
          limit: itemsPerPage,
        },
      },
    },
    skip: activeTab !== 'all',
    fetchPolicy: 'network-only',
  });

  const {
    data: myThreadsData,
    loading: myThreadsLoading,
    refetch: refetchMyThreads,
  } = useMyThreadsQuery({
    variables: {
      input: {
        pagination: {
          offset: (page - 1) * itemsPerPage,
          limit: itemsPerPage,
        },
      },
    },
    skip: activeTab !== 'myPost' || !isAuthed,
    fetchPolicy: 'network-only',
  });

  const { data: trendingData } = useTopViewedArticlesQuery();

  const [createThread, { loading: creatingThread }] = useCreateThreadMutation();

  const currentData = activeTab === 'all' ? threadsData?.threads : myThreadsData?.myThreads;
  const isLoading = activeTab === 'all' ? threadsLoading : myThreadsLoading;
  const totalCount = currentData?.count ?? 0;

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (currentData?.data) {
      const newData = currentData.data as Thread[];
      if (page === 1) {
        setThreads(newData);
        setHasMore(newData.length >= itemsPerPage && newData.length < totalCount);
      } else {
        setThreads((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          const uniqueNewData = newData.filter((t) => !existingIds.has(t.id));
          const updated = [...prev, ...uniqueNewData];
          setHasMore(updated.length < totalCount);
          return updated;
        });
      }
    } else if (!isLoading && page === 1) {
      setThreads([]);
      setHasMore(false);
    }
  }, [currentData, isLoading, page, totalCount]);

  useEffect(() => {
    setPage(1);
    setThreads([]);
    setHasMore(true);
  }, [activeTab]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingRef.current && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingRef.current) {
          handleLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleLoadMore, hasMore]);

  const handlePostThread = async () => {
    if (!postContent.trim() && postMedia.length === 0) return;

    try {
      await createThread({
        variables: {
          input: {
            content: postContent,
            images: postMedia.length > 0 ? postMedia : undefined,
          },
        },
      });
      setPostContent('');
      setPostMedia([]);
      setShowPostForm(false);
      setPage(1);
      if (activeTab === 'all') {
        refetchThreads();
      } else {
        refetchMyThreads();
      }
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).filter(
      (file) => file.type.startsWith('image/') || file.type.startsWith('video/'),
    );
    setPostMedia((prev) => [...prev, ...newFiles].slice(0, 4));
    e.target.value = '';
  };

  const handleRemoveMedia = (index: number) => {
    setPostMedia((prev) => prev.filter((_, i) => i !== index));
  };

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
      if (tabHeaderPlaceholderRef.current) {
        const rect = tabHeaderPlaceholderRef.current.getBoundingClientRect();
        setTabHeaderPosition({ left: rect.left, width: rect.width });
      }
    };

    const handleScroll = () => {
      const threshold = 12;

      if (trendingPlaceholderRef.current) {
        const rect = trendingPlaceholderRef.current.getBoundingClientRect();
        setTrendingLeft(rect.left);
        setIsFixed(rect.top <= threshold);
      }

      if (tabHeaderPlaceholderRef.current) {
        const rect = tabHeaderPlaceholderRef.current.getBoundingClientRect();
        setTabHeaderPosition({ left: rect.left, width: rect.width });
        setIsTabHeaderFixed(rect.top <= threshold);
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

  const trendingArticles = trendingData?.topViewedArticles ?? [];

  return (
    <div className="min-h-screen">
      <div className="max-w-[1000px] mx-auto px-6 py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            <div ref={tabHeaderPlaceholderRef} className="mb-4 pb-4">
              {!isTabHeaderFixed && (
                <TabHeader
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  isLoggedIn={!!isLoggedIn}
                  onPostClick={() => {
                    if (!isAuthed) {
                      notify('Please check your email and nickname', 'success');
                      navigate('/profile');
                      return;
                    }
                    setShowPostForm(true);
                  }}
                />
              )}
            </div>

            <div className="bg-white rounded-md border border-gray-200">
              {threads.map((thread) => (
                <ThreadItem
                  key={thread.id}
                  thread={thread}
                  onThreadUpdated={() => {
                    if (activeTab === 'all') {
                      refetchThreads();
                    } else {
                      refetchMyThreads();
                    }
                  }}
                />
              ))}

              {isLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              )}

              {!isLoading && threads.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No threads found</p>
                </div>
              )}

              {hasMore && <div ref={loadMoreRef} className="h-10" />}
            </div>
          </div>

          <div ref={trendingPlaceholderRef} className="w-[280px] flex-shrink-0">
            {!isFixed && <TrendingArticles articles={trendingArticles} />}
          </div>
        </div>
      </div>

      {isTabHeaderFixed && tabHeaderPosition !== null && (
        <div
          className="fixed top-3 bg-gray-light py-2"
          style={{
            left: tabHeaderPosition.left,
            width: tabHeaderPosition.width,
          }}
        >
          <TabHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLoggedIn={!!isLoggedIn}
            onPostClick={() => {
              if (!isAuthed) {
                notify('Please check your email and nickname', 'success');
                navigate('/profile');
                return;
              }
              setShowPostForm(true);
            }}
          />
        </div>
      )}

      {isFixed && trendingLeft !== null && (
        <div className="fixed top-3 w-[280px] mt-2" style={{ left: trendingLeft }}>
          <TrendingArticles articles={trendingArticles} />
        </div>
      )}

      <Dialog
        open={showPostForm}
        onOpenChange={(open) => {
          setShowPostForm(open);
          if (!open) {
            setPostContent('');
            setPostMedia([]);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] gap-4">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Create Post</DialogTitle>
            <Button
              size="sm"
              onClick={handlePostThread}
              disabled={(!postContent.trim() && postMedia.length === 0) || creatingThread}
            >
              {creatingThread ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
            </Button>
          </DialogHeader>

          <div>
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's happening?"
              className="min-h-[120px] resize-none border-0 focus-visible:ring-0 text-base p-0"
            />

            <MediaUploadPreview files={postMedia} onRemove={handleRemoveMedia} />

            <div className="flex items-center gap-2 pt-4 border-t mt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleMediaSelect}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-2 h-auto"
                onClick={() => fileInputRef.current?.click()}
                disabled={postMedia.length >= 4}
              >
                <ImageIcon className="w-5 h-5 text-primary" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {postMedia.length > 0 ? `${postMedia.length}/4 images` : 'Add images'}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ThreadsPage;
