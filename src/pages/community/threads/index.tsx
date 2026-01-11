import { useThreadsQuery } from '@/apollo/queries/threads.generated';
import { useMyThreadsQuery } from '@/apollo/queries/my-threads.generated';
import { useTopViewedArticlesQuery } from '@/apollo/queries/top-viewed-articles.generated';
import { useCreateThreadMutation } from '@/apollo/mutation/create-thread.generated';
import { MarkdownEditor } from '@/components/markdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/lib/hooks/use-auth';
import { CirclePlus, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import ThreadItem from './_components/thread-item';
import { Thread } from '@/types/types.generated';

type TabType = 'all' | 'myPost';

const ThreadsPage = () => {
  const { isAuthed, isLoggedIn } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postContent, setPostContent] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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

  // Append new data when page changes
  useEffect(() => {
    if (currentData?.data) {
      const newData = currentData.data as Thread[];
      if (page === 1) {
        setThreads(newData);
        setHasMore(newData.length < totalCount);
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
    }
  }, [currentData, isLoading, page, totalCount]);

  useEffect(() => {
    setPage(1);
    setThreads([]);
    setHasMore(true);
  }, [activeTab]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!scrollContainerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          handleLoadMore();
        }
      },
      {
        threshold: 0.1,
        root: scrollContainerRef.current,
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
  }, [handleLoadMore, hasMore, isLoading, threads.length]);

  const handlePostThread = async () => {
    if (!postContent.trim()) return;

    try {
      await createThread({
        variables: {
          input: {
            content: postContent,
          },
        },
      });
      setPostContent('');
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

  const trendingArticles = trendingData?.topViewedArticles ?? [];

  return (
    <div className="h-screen overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 py-10 h-full">
        <div className="flex gap-7 h-full">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4 py-4 flex-shrink-0">
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
              {isAuthed && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowPostForm(true)}
                >
                  <CirclePlus className="w-4 h-4" />
                  Post
                </Button>
              )}
            </div>

            <div className="bg-white rounded-md border border-gray-200 flex-1 overflow-hidden flex flex-col">
              <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
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
          </div>

          <div className="w-[280px] h-fit flex-shrink-0 bg-white border border-gray-200 rounded-md px-3 py-5">
            <div>
              <h3 className="font-semibold text-lg mb-4 text-gray-500">Trending Articles</h3>
              <div className="flex flex-col gap-5">
                {trendingArticles.slice(0, 6).map((article) => (
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
          </div>
        </div>
      </div>

      <Dialog open={showPostForm} onOpenChange={setShowPostForm}>
        <DialogContent className="sm:max-w-[800px] gap-6">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Create Post</DialogTitle>
            <Button
              size="sm"
              onClick={handlePostThread}
              disabled={!postContent.trim() || creatingThread}
            >
              {creatingThread ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
            </Button>
          </DialogHeader>
          <MarkdownEditor
            onChange={(value: string) => setPostContent(value)}
            content={postContent}
            placeholder="What's on your mind?"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ThreadsPage;
