import { useGetProgramsV2Query } from "@/apollo/queries/programs-v2.generated";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Tabs } from "@/components/ui/tabs";
import { useAuth } from "@/lib/hooks/use-auth";
import notify from "@/lib/notify";
import ProgramCard from "@/pages/programs/_components/program-card";
import { ProgramStatusV2 } from "@/types/types.generated";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const PageSize = 12;

const ProgramsPage: React.FC = () => {
  const navigate = useNavigate();

  const { isLoggedIn, isAuthed, userId } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedTab, setSelectedTab] = useState("newest");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const currentPage = Number(searchParams.get("page")) || 1;

  // TODO: filtering
  const createFilter = (tab: string, search: string, userId?: string) => [
    ...(tab === "my-programs" && userId
      ? [{ field: "creatorId", value: userId }]
      : []),
    ...(tab === "newest"
      ? [
          { field: "status", value: ProgramStatusV2.Open },
          { field: "visibility", value: "public" },
        ]
      : []),
    ...(tab === "completed"
      ? [
          { field: "status", value: ProgramStatusV2.Closed },
          { field: "visibility", value: "public" },
        ]
      : []),
    ...(search ? [{ field: "search", value: search }] : []),
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
    console.error("Error fetching programs:", error);
  }

  const totalCount = data?.programsV2?.count ?? 0;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchParams.get("search") ?? "");
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchParams.get("search")]);

  return (
    <div className="bg-white rounded-2xl p-10 pr-[55px]">
      <div className="max-w-full md:max-w-1440 mx-auto">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-3xl font-bold">Recruitment</h1>
        </div>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <section className="flex justify-between items-center py-4">
            {/* TODO: dropdown으로 filtering */}
            <div></div>
            <div className="flex items-center gap-3 h-10">
              <Input
                className="h-full w-[432px]"
                placeholder="Search..."
                value={searchParams.get("search") ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  const newSP = new URLSearchParams(searchParams);

                  if (value) {
                    newSP.set("search", value);
                  } else {
                    newSP.delete("search");
                  }
                  newSP.delete("page");
                  setSearchParams(newSP);
                }}
              />

              {isLoggedIn && (
                <Button
                  className="gap-2 rounded-[6px] px-3"
                  onClick={() => {
                    if (!isAuthed) {
                      notify("Please add your email", "success");
                      navigate("/my-profile/edit");
                      return;
                    }

                    navigate("create");
                  }}
                >
                  <CirclePlus />
                  Create Program
                </Button>
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full my-5">
            {loading ? (
              <div className="col-span-full py-8 text-center">
                Loading programs...
              </div>
            ) : error ? (
              <div className="col-span-full py-8 text-center text-red-500">
                Error loading programs. Please try again.
              </div>
            ) : data?.programsV2?.data?.length ? (
              data.programsV2.data.map((program) => (
                <ProgramCard key={program?.id} program={program} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No programs found.
              </div>
            )}
          </section>

          <Pagination totalCount={totalCount} pageSize={PageSize} />
        </Tabs>
      </div>
    </div>
  );
};

export default ProgramsPage;
