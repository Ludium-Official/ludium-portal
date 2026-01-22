import { useGetProgramsV2Query } from '@/apollo/queries/programs-v2.generated';
import { MobileCardField, MobileCardList } from '@/components/data-table/mobile-card-list';
import Container from '@/components/layout/container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Tabs } from '@/components/ui/tabs';
import { getNetworkDisplayName, getTokenIcon } from '@/constant/network-icons';
import { useAuth } from '@/lib/hooks/use-auth';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import notify from '@/lib/notify';
import { cn, dDay, getInitials, getUserDisplayName, timeAgo } from '@/lib/utils';
import ProgramCard from '@/pages/programs/_components/program-card';
import type { ProgramV2 } from '@/types/types.generated';
import { ProgramStatusV2 } from '@/types/types.generated';
import { format } from 'date-fns';
import { CirclePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

const PageSize = 12;

const ProgramsPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { isLoggedIn, isAuthed, userId } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedTab, setSelectedTab] = useState('newest');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Mobile card configuration
  const renderMobileHeader = (program: ProgramV2) => (
    <div className="flex items-center gap-2">
      <Avatar className="w-8 h-8">
        <AvatarImage src={program.sponsor?.profileImage || ''} />
        <AvatarFallback className="text-xs">
          {getInitials(getUserDisplayName(program.sponsor?.nickname, program.sponsor?.email))}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{program.title}</p>
        <p className="text-xs text-muted-foreground truncate">
          {getUserDisplayName(program.sponsor?.nickname, program.sponsor?.email)}
        </p>
      </div>
    </div>
  );

  const mobileFields: MobileCardField<ProgramV2>[] = [
    {
      key: 'price',
      label: 'Price',
      render: (program) =>
        program.price ? (
          <span className="flex items-center gap-1 text-xs">
            {program.token && getTokenIcon(program.token.tokenName || 'EDU')}
            {program.price} {program.token?.tokenName}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Negotiable</span>
        ),
    },
    {
      key: 'network',
      label: 'Network',
      render: (program) => (
        <span className="text-xs">
          {program.network && getNetworkDisplayName(program.network.chainName || 'educhain')}
        </span>
      ),
    },
    {
      key: 'deadline',
      label: 'Deadline',
      render: (program) => (
        <span className="flex items-center gap-1 text-xs">
          {format(new Date(program.deadline ?? new Date()), 'dd . MMM . yyyy').toUpperCase()}
          {program.deadline && (
            <Badge className="text-[10px] px-1 py-0">{dDay(program.deadline)}</Badge>
          )}
        </span>
      ),
    },
    {
      key: 'applicants',
      label: 'Applicants',
      render: (program) => (
        <span className="text-xs font-medium">
          {program.applicationCount && program.applicationCount > 10
            ? '10+'
            : (program.applicationCount ?? 0)}
        </span>
      ),
    },
    {
      key: 'posted',
      label: 'Posted',
      render: (program) => (
        <span className="text-xs text-muted-foreground">
          {program.createdAt ? timeAgo(program.createdAt) : ''}
        </span>
      ),
    },
  ];

  const currentPage = Number(searchParams.get('page')) || 1;

  // TODO: filtering
  const createFilter = (tab: string, search: string, userId?: string) => [
    ...(tab === 'my-programs' && userId ? [{ field: 'creatorId', value: userId }] : []),
    ...(tab === 'newest'
      ? [
          { field: 'status', value: ProgramStatusV2.Open },
          { field: 'visibility', value: 'public' },
        ]
      : []),
    ...(tab === 'completed'
      ? [
          { field: 'status', value: ProgramStatusV2.Closed },
          { field: 'visibility', value: 'public' },
        ]
      : []),
    ...(search ? [{ field: 'search', value: search }] : []),
  ];

  const filter = createFilter(selectedTab, debouncedSearch, userId);

  const { data, loading, error } = useGetProgramsV2Query({
    variables: {
      pagination: {
        limit: PageSize,
        offset: (currentPage - 1) * PageSize,
        filter: filter,
      },
    },
  });

  if (error) {
    console.error('Error fetching programs:', error);
  }

  const totalCount = data?.programsV2?.count ?? 0;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchParams.get('search') ?? '');
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchParams.get('search')]);

  return (
    <Container
      className={cn('bg-white rounded-2xl p-10 max-w-full', isMobile && 'p-4 rounded-none')}
    >
      <div className="flex justify-between items-center pb-4">
        <h1 className={cn('text-3xl font-bold', isMobile && 'text-lg')}>Recruitment</h1>
        {isMobile && isLoggedIn && (
          <Button
            size="sm"
            className="gap-1"
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
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <section
          className={cn('flex justify-between items-center py-2', isMobile && 'flex-col gap-0')}
        >
          <div></div>
          <div className={cn('flex items-center gap-3 h-10', isMobile && 'w-full')}>
            <Input
              className={cn('h-full w-[432px]', isMobile && 'w-full text-sm')}
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

        <section className={cn('my-5', isMobile && 'mt-0')}>
          {loading ? (
            <div className="py-8 text-center">Loading programs...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              Error loading programs. Please try again.
            </div>
          ) : data?.programsV2?.data?.length ? (
            isMobile ? (
              <MobileCardList
                data={data.programsV2.data as ProgramV2[]}
                keyExtractor={(program) => program.id || ''}
                renderHeader={renderMobileHeader}
                fields={mobileFields}
                onItemClick={(program) => navigate(`/programs/recruitment/${program.id}`)}
                emptyMessage="No programs found."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                {data.programsV2.data.map((program) => (
                  <ProgramCard key={program?.id} program={program} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-8 text-gray-500">No programs found.</div>
          )}
        </section>

        <Pagination totalCount={totalCount} pageSize={PageSize} />
      </Tabs>
    </Container>
  );
};

export default ProgramsPage;
