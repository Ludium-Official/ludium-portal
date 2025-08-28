import { useProgramsQuery } from '@/apollo/queries/programs.generated';
import { ProgramStatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import {
  ApplicationStatus,
  type Program,
  ProgramStatus,
  ProgramType,
  SortEnum,
} from '@/types/types.generated';
import { CirclePlus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';

export default function InvestmentsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { userId } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchParams.get('search') ?? '');
    }, 300); // Adjust the debounce delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [searchParams.get('search')]);

  useEffect(() => {
    setSearchParams(new URLSearchParams());
  }, [activeTab]);

  const filter = [
    ...(activeTab === 'my-programs'
      ? [
          {
            field: 'userId',
            value: userId,
          },
        ]
      : []),
    ...(activeTab === 'newest'
      ? [
          {
            field: 'status',
            values: [
              ProgramStatus.Published,
              ProgramStatus.Completed,
              ProgramStatus.Pending,
              ProgramStatus.PaymentRequired,
              ProgramStatus.Cancelled,
              ProgramStatus.Closed,
              ProgramStatus.Rejected,
            ],
          },
          {
            field: 'visibility',
            value: 'public',
          },
        ]
      : []),
    ...(activeTab === 'imminent'
      ? [
          {
            field: 'status',
            value: 'published',
          },
          {
            field: 'visibility',
            value: 'public',
          },

          {
            field: 'imminent',
            value: 'true',
          },
        ]
      : []),
    ...(activeTab === 'completed'
      ? [
          {
            field: 'status',
            value: 'completed',
          },
          {
            field: 'visibility',
            value: 'public',
          },
        ]
      : []),
    {
      field: 'name',
      value: debouncedSearch,
    },
    {
      field: 'type',
      value: ProgramType.Funding,
    },
  ];

  const { data, loading, error } = useProgramsQuery({
    variables: {
      pagination: {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        sort: SortEnum.Desc,
        filter: filter,
      },
    },
  });

  const programs = data?.programs?.data || [];
  const totalCount = data?.programs?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const filteredPrograms = useMemo(() => {
    if (!searchQuery) return programs;
    return programs.filter(
      (program) =>
        program.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [programs, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

  return (
    <div className="bg-white rounded-2xl">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="bg-white">
          <div className="w-full mx-auto px-10 py-9">
            <h1 className="text-3xl font-bold text-gray-900">Investment</h1>
          </div>
        </div>

        {/* Navigation and Search */}
        <div className="bg-white">
          <div className="w-full  mx-auto px-10">
            <div className="flex items-center justify-between gap-20">
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto">
                <TabsList className="w-auto bg-gray-100 p-1">
                  <TabsTrigger value="newest">Newest</TabsTrigger>
                  <TabsTrigger value="imminent">Imminent</TabsTrigger>
                  <TabsTrigger value="my-programs">My programs</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Search and Create */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10 w-90 h-10 bg-gray-50 border-gray-200 focus:border-gray-300"
                  />
                </div>
                <Button
                  className="bg-gray-900 text-white hover:bg-gray-800 px-3 py-2 text-sm"
                  onClick={() => navigate('/investments/create')}
                >
                  <CirclePlus />
                  Create Investment
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full mx-auto px-10 py-5 bg-white">
          <div className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Card
                    key={`investment-skeleton-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      i
                    }`}
                    className="w-full border border-gray-200 rounded-lg"
                  >
                    <CardContent className="p-5">
                      <div className="animate-pulse">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24" />
                            <div className="h-4 bg-gray-200 rounded w-32" />
                          </div>
                          <div className="h-6 bg-gray-200 rounded-full w-20" />
                        </div>
                        <div className="h-20 bg-gray-200 rounded mb-4" />
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded" />
                          <div className="h-3 bg-gray-200 rounded w-5/6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Error loading programs</p>
              </div>
            ) : filteredPrograms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No programs found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPrograms.map((program) => (
                  <InvestmentCard key={program.id} program={program} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination totalCount={totalCount} pageSize={itemsPerPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface InvestmentCardProps {
  program: Program;
}

function InvestmentCard({ program }: InvestmentCardProps) {
  // const currency = getCurrency(program.currency);
  // const status = formatProgramStatus(program);
  const deadlineDate = new Date(program.deadline);
  const today = new Date();
  // Zero out the time for both dates to get full days difference
  deadlineDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const daysUntilDeadline = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // const daysUntilDeadline = program.deadline
  //   ? Math.ceil(
  //     (new Date(program.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  //   )
  //   : null;

  return (
    <Card className="w-full border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <CardContent className="">
        {/* Header with badges and status */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-1.5">
            {program.keywords?.slice(0, 3).map((keyword, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Badge key={index} variant="secondary" className="text-xs font-semibold">
                {keyword.name}
              </Badge>
            ))}
          </div>
          {/* <Badge
            variant="outline"
            className={cn(
              "text-xs font-semibold",
              status === "Application ongoing" && "bg-gray-50 text-gray-900 border-gray-200"
            )}
          >
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-green-400 rounded-full" />
              {status}
            </div>
          </Badge> */}

          <ProgramStatusBadge program={program} />
        </div>

        {/* Content */}
        <Link to={`/investments/${program?.id}`} className="flex gap-4">
          {/* Thumbnail */}
          {program.image ? (
            <img src={program.image} className="w-29 h-29 rounded-md" alt="Program" />
          ) : (
            <div className="w-29 h-29 bg-slate-200 rounded-md " />
          )}

          {/* Title and details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
              {program.name || ''}
            </h3>

            {/* Deadline and amount */}
            <div className="space-y-3">
              <div className="bg-[#0000000A] rounded-md py-1 px-2 gap-2 inline-flex items-center">
                <div className="text-sm font-semibold text-neutral-400">DATE</div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const formatDate = (dateString: string) => {
                      return new Date(dateString)
                        .toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                        .toUpperCase()
                        .split(' ')
                        .join(' . ');
                    };

                    const renderDateRange = (startDate: string, endDate: string) => (
                      <>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
                          {formatDate(startDate)}
                        </div>
                        <div className="w-2 h-px bg-muted-foreground" />
                        <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
                          {formatDate(endDate)}
                        </div>
                      </>
                    );

                    const now = new Date();
                    const fundingHasStarted =
                      program.fundingStartDate && now >= new Date(program.fundingStartDate);

                    // Show funding dates if funding has started and dates are available
                    if (fundingHasStarted && program.fundingStartDate && program.fundingEndDate) {
                      return renderDateRange(program.fundingStartDate, program.fundingEndDate);
                    }

                    // Show application dates if available
                    if (program.applicationStartDate && program.applicationEndDate) {
                      return renderDateRange(
                        program.applicationStartDate,
                        program.applicationEndDate,
                      );
                    }

                    // Fallback when no dates are available
                    return (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        No dates set
                      </div>
                    );
                  })()}
                </div>
                <Badge className="bg-gray-900 text-white text-xs font-semibold">
                  D-{daysUntilDeadline || 0}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2">
                {program.summary ||
                  "Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment solution that leverages smart contracts and Zero-Knowledge TLS (zkTLS) to ensure secure, private, and verifiable task-based payments. It enables seamless collaboration between sponsors and builders, automating fund disbursement upon task completion while maintaining privacy and trust."}
              </p>
            </div>
          </div>
        </Link>

        {/* Footer buttons */}
        <div className="flex justify-between mt-6">
          <Link
            to={`/investments/${program?.id}#applications`}
            className="text-xs font-semibold bg-gray-light rounded-md px-3 py-2 leading-4"
          >
            Submitted Project{' '}
            <span className="text-primary">{program.applications?.length ?? 0}</span>
          </Link>
          <Link
            to={`/investments/${program?.id}#applications`}
            className="text-xs font-semibold bg-gray-light rounded-md px-3 py-2 leading-4"
          >
            Approved Project{' '}
            <span className="text-green-600">
              {program.applications?.filter((a) => a.status === ApplicationStatus.Accepted)
                .length ?? 0}
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
