import { useProgramsQuery } from '@/apollo/queries/programs.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageSize, Pagination } from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import ProgramCard from '@/pages/programs/_components/program-card';
import { SortEnum } from '@/types/types.generated';
import { CirclePlus, ListFilter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

const ProgramsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  const { isAuthed, userId } = useAuth();

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

  const filter = [
    ...(selectedTab === 'my-programs'
      ? [
          {
            field: 'userId',
            value: userId,
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
        // limit: 2,
        limit: PageSize,
        // offset: (currentPage - 1) * 2,
        offset: (currentPage - 1) * PageSize,
        filter: filter,
        sort: selectedTab === 'by-newest' ? SortEnum.Desc : SortEnum.Asc,
      },
    },
  });

  const totalCount = data?.programs?.count ?? 0;

  return (
    <Tabs className="p-10 pr-[55px]" value={selectedTab} onValueChange={setSelectedTab}>
      <section className="flex justify-between items-center mb-3">
        <TabsList className="">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="my-programs">My programs</TabsTrigger>
          <TabsTrigger value="by-newest">By newest</TabsTrigger>
          {/* <TabsTrigger value="by-size">By size</TabsTrigger> */}
        </TabsList>
        <div className="h-10 flex items-center gap-3">
          <Input
            className="h-full w-[432px]"
            placeholder="Search..."
            value={searchParams.get('search') ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              const newSP = new URLSearchParams();

              newSP.set('search', value);
              setSearchParams(newSP);
            }}
          />

          <Button variant="outline" className="h-full rounded-[6px] ">
            <ListFilter /> Filter
          </Button>
          {isAuthed && (
            <Button className="h-[32px] rounded-[6px] gap-2" onClick={() => navigate('create')}>
              <CirclePlus /> Create Program
            </Button>
          )}
        </div>
      </section>

      <section className="w-full space-y-4 mb-5">
        {data?.programs?.data?.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </section>

      <Pagination totalCount={totalCount} />
    </Tabs>
  );
};

export default ProgramsPage;
