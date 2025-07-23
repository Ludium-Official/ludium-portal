import { useProgramsQuery } from '@/apollo/queries/programs.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import notify from '@/lib/notify';
import ProgramCard from '@/pages/programs/_components/program-card';
import { SortEnum } from '@/types/types.generated';
import { CirclePlus, ListFilter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

const PageSize = 12;

const ProgramsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  const { isLoggedIn, isAuthed, userId } = useAuth();

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

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
  }, [selectedTab]);

  const filter = [
    ...(selectedTab === 'my-programs'
      ? [
        {
          field: 'userId',
          value: userId,
        },
      ]
      : []),
    ...(selectedTab === 'published'
      ? [
        {
          field: 'status',
          value: 'published',
        },
      ]
      : []),
    {
      field: 'name',
      value: debouncedSearch,
    },
  ];

  const { data } = useProgramsQuery({
    variables: {
      pagination: {
        limit: PageSize,
        offset: (currentPage - 1) * PageSize,
        filter: filter,
        sort: SortEnum.Desc,
      },
    },
  });

  const totalCount = data?.programs?.count ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="bg-white">
        <div className="w-full mx-auto px-10 py-9">
          <h1 className="text-3xl font-bold text-gray-900">Recruitment</h1>
        </div>
      </div>

      <Tabs
        className="p-10 pt-0 pr-[55px] bg-white rounded-b-2xl"
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <section className="flex justify-between items-center mb-3">
          <TabsList className="">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="my-programs">My programs</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
          <div className="h-10 flex items-center gap-3">

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                className="pl-10 w-90 h-10 bg-gray-50 border-gray-200 focus:border-gray-300"
                placeholder="Search..."
                value={searchParams.get('search') ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const newSP = new URLSearchParams();

                  newSP.set('search', value);
                  setSearchParams(newSP);
                }}
              />
            </div>

            <Button variant="outline" className="h-full rounded-[6px] ">
              <ListFilter /> Filter
            </Button>
            {isLoggedIn && (
              <Button
                className="h-[32px] rounded-[6px] gap-2"
                onClick={() => {
                  if (!isAuthed) {
                    notify('Please add your email', 'success');
                    navigate('/profile/edit');
                    return;
                  }

                  navigate('create');
                }}
              >
                <CirclePlus /> Create Program
              </Button>
            )}
          </div>
        </section>

        <section className="w-full space-y-4 mb-5 grid grid-cols-2 gap-5">
          {data?.programs?.data?.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </section>

        <Pagination totalCount={totalCount} pageSize={PageSize} />
      </Tabs>
    </div>
  );
};

export default ProgramsPage;
