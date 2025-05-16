import { useProgramsQuery } from '@/apollo/queries/programs.generated';
import { useUserQuery } from '@/apollo/queries/user.generated';
import avatarPlaceholder from '@/assets/avatar-placeholder.png';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router';

function UserDetailsPage() {
  const { id } = useParams();

  const [selectedTab, setSelectedTab] = useState('sponsor');
  const filterBasedOnRole = {
    sponsor: 'creatorId',
    validator: 'validatorId',
    builder: 'applicantId',
  };

  const { data } = useProgramsQuery({
    variables: {
      pagination: {
        limit: 10,
        offset: 0,
        filter: [
          {
            value: id ?? '',
            field: filterBasedOnRole[selectedTab as 'sponsor' | 'validator' | 'builder'],
          },
        ],
      },
    },
    skip: !id,
  });

  const { data: userData } = useUserQuery({
    variables: {
      id: id ?? '',
    },
  });

  return (
    <div className="bg-[#F7F7F7]">
      <div className="flex px-10 py-5 justify-between bg-white rounded-b-2xl mb-3">
        <section className="">
          <h1 className="text-xl font-bold mb-6">Profile</h1>

          <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Profile image</h3>

          <div className="px-6 py-2 mb-9">
            <img
              src={userData?.user?.image ?? avatarPlaceholder}
              alt="avatar"
              className="w-[121px] h-[121px] rounded-full object-cover"
            />
          </div>

          <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Organization / Person name</h3>
          <p className="text-[#18181B] text-sm font-medium mb-10">
            {userData?.user?.organizationName} / {userData?.user?.firstName}{' '}
            {userData?.user?.lastName}
          </p>

          <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Description</h3>
          <p className="text-[#18181B] text-sm font-medium mb-10">{userData?.user?.about}</p>

          {/* <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Wallet</h3>
          <div className="p-6 mb-10 border min-w-[282px] bg-muted rounded-lg shadow-sm relative">
            {userData?.user?.wallet?.address && (
              <p className="text-xs text-[#71717A]">{userData?.user?.wallet?.address}</p>
            )}
          </div> */}

          <h3 className="text-[#A3A3A3] text-xs font-medium mb-2">Links</h3>
          <p className="text-[#18181B] text-sm font-medium mb-10">
            {userData?.user?.links?.map((l) => (
              <p key={l.url}>{l.url}</p>
            ))}
            {userData?.user?.links?.length === 0 && <span>No links provided</span>}
          </p>
        </section>
      </div>

      <div className="bg-white p-5 rounded-t-2xl">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full">
            {/* {roles.map(r => (
              <TabsTrigger key={r} value={r}>Programs as {r}</TabsTrigger>
            ))} */}
            <TabsTrigger value={'sponsor'}>Programs as sponsor</TabsTrigger>
            <TabsTrigger value={'validator'}>Programs as validator</TabsTrigger>
            <TabsTrigger value={'builder'}>Programs as builder</TabsTrigger>
          </TabsList>
        </Tabs>

        <h2 className="text-xl font-bold mt-10 mb-6">Programs as {selectedTab}</h2>

        {!data?.programs?.data?.length && (
          <p className="text-sm text-muted-foreground">No programs found</p>
        )}

        {data?.programs?.data?.map((p) => (
          <div key={p.id} className="border rounded-xl p-6 mb-6">
            <div className="flex justify-between mb-4">
              <Badge>{p.status}</Badge>
              <Link to={`/programs/${p.id}`} className="flex gap-2 text-sm items-center">
                See more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <h2 className="text-lg font-semibold mb-[6px]">{p.name}</h2>
            <span className="inline-block py-1 px-2 mb-4 rounded-[6px] text-xs font-bold text-[#B331FF] bg-[#F8ECFF]">
              {p.price} {p.currency}
            </span>

            <p className="text-sm font-medium">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDetailsPage;
