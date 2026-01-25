import { useGetProgramsV2Query } from '@/apollo/queries/programs-v2.generated';
import Container from '@/components/layout/container';
import ProgramDetailPanel from '@/components/recruitment/overview/program-detail-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/hooks/use-auth';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import notify from '@/lib/notify';
import { cn } from '@/lib/utils';
import ProgramCard from '@/pages/programs/_components/program-card';
import type { ProgramV2 } from '@/types/types.generated';
import { CirclePlus, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

const PageSize = 10;

const ProgramsPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { isLoggedIn, isAuthed } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  const [programs, setPrograms] = useState<ProgramV2[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  const { data, loading, error } = useGetProgramsV2Query({
    variables: {
      pagination: {
        limit: PageSize,
        offset: (page - 1) * PageSize,
      },
    },
    fetchPolicy: 'network-only',
  });

  if (error) {
    console.error('Error fetching programs:', error);
  }

  const totalCount = data?.programsV2?.count ?? 0;

  useEffect(() => {
    isLoadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    if (data?.programsV2?.data) {
      const newData = data.programsV2.data as ProgramV2[];
      if (page === 1) {
        setPrograms(newData);
        setHasMore(newData.length >= PageSize && newData.length < totalCount);
        if (newData.length > 0 && !selectedProgramId) {
          setSelectedProgramId(newData[0].id ?? null);
        }
      } else {
        setPrograms((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const uniqueNewData = newData.filter((p) => !existingIds.has(p.id));
          const updated = [...prev, ...uniqueNewData];
          setHasMore(updated.length < totalCount);
          return updated;
        });
      }
    } else if (!loading && page === 1) {
      setPrograms([]);
      setHasMore(false);
    }
  }, [data, loading, page, totalCount, selectedProgramId]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingRef.current && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!hasMore || isLoadingRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        handleLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleLoadMore, hasMore]);

  return (
    <div className={cn('bg-white rounded-2xl py-10', isMobile && 'p-0')}>
      <Container className={cn('max-w-[1036px]', isMobile && 'p-4')}>
        <div className={cn('flex justify-between items-center mb-8', isMobile && 'mb-6')}>
          <h1 className={cn('text-xl font-bold', isMobile && 'text-base')}>
            Find your opportunity
          </h1>
          {isMobile && isLoggedIn && (
            <Button
              className="gap-1"
              size="sm"
              variant="outline"
              onClick={() => {
                if (!isAuthed) {
                  notify('Please check your email and nickname', 'success');
                  navigate('/profile');
                  return;
                }
                navigate('create');
              }}
            >
              <CirclePlus className="w-4 h-4" />
              Create
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-0">
          <section
            className={cn('flex justify-between items-center', isMobile && 'flex-col gap-0')}
          >
            <div className="flex items-center justify-between gap-3 h-10 w-full">
              <Input
                className={cn('h-full w-[330px]', isMobile && 'w-full text-sm')}
                placeholder="Search..."
                value={searchParams.get('search') ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const newSP = new URLSearchParams(searchParams);

                  if (value) {
                    newSP.set('search', value);
                  } else {
                    newSP.delete('search');
                  }
                  newSP.delete('page');
                  setSearchParams(newSP);
                }}
              />

              {!isMobile && isLoggedIn && (
                <Button
                  className="gap-2 rounded-[6px] px-3"
                  variant="outline"
                  size="default"
                  onClick={() => {
                    if (!isAuthed) {
                      notify('Please check your email and nickname', 'success');
                      navigate('/profile');
                      return;
                    }

                    navigate('create');
                  }}
                >
                  <CirclePlus />
                  Create Program
                </Button>
              )}
            </div>
          </section>

          <div className={cn('flex gap-4 my-6 h-[calc(100vh-100px)]')}>
            <div className={cn('w-[330px] flex flex-col', isMobile && 'w-full')}>
              <section
                ref={scrollContainerRef}
                className={cn('flex-1 overflow-y-auto scrollbar-hide', isMobile && '-mx-4')}
              >
                {error ? (
                  <div className="py-8 text-center text-red-500">
                    Error loading programs. Please try again.
                  </div>
                ) : programs?.length ? (
                  <div className={cn('flex flex-col w-[330px]', isMobile && 'w-full')}>
                    {programs.map((program) => (
                      <ProgramCard
                        key={program?.id}
                        program={program}
                        selectedProgramId={selectedProgramId ?? ''}
                        setSelectedProgramId={setSelectedProgramId}
                      />
                    ))}

                    {loading && (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ) : loading ? (
                  <div className="py-8 text-center">Loading programs...</div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No programs found.</div>
                )}
              </section>
            </div>
            {!isMobile && (
              <div className="flex-1 border border-gray-border rounded-md p-6 overflow-y-auto">
                <ProgramDetailPanel id={selectedProgramId ?? ''} />
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProgramsPage;
