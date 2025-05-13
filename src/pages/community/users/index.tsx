import { useUsersQuery } from '@/apollo/queries/users.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getInitials } from '@/lib/utils';
import { ArrowRight, ListFilter } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

function UsersPage() {
  const [selectedTab, setSelectedTab] = useState('all');

  const { data: usersData } = useUsersQuery();

  return (
    <div className="bg-white p-10">
      <div className="flex justify-between items-center mb-9">
        <h3 className="text-[#18181B] font-bold text-xl">Users</h3>
        <Button className="h-9 text-sm py-2 px-3">
          View more <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="by-newest">By newest</TabsTrigger>
            <TabsTrigger value="by-number-of-projects">By number of projects</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <Input className="w-[432px] rounded-md h-10" placeholder="Search..." />

          <Button variant="outline" className="rounded-md flex items-center gap-2 h-10">
            <ListFilter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {usersData?.users?.map((user) => (
          <div key={user.id} className="border rounded-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2">
                <Badge className="bg-red-500 px-2.5 py-0.5">BD</Badge>
                <Badge className="bg-[#B331FF] px-2.5 py-0.5">Developer</Badge>
                <Badge className="bg-pink-300 px-2.5 py-0.5">Solidity</Badge>
              </div>

              <Link
                to={`/community/users/${user.id}`}
                className="flex gap-2 text-sm items-center font-medium"
              >
                See details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="gap-4 flex items-center mb-6">
              <Avatar className="w-[64px] h-[64px]">
                <AvatarImage src={user?.image || ''} alt={`${user?.firstName} ${user?.lastName}`} />
                <AvatarFallback>
                  {getInitials(`${user?.firstName || ''} ${user?.lastName || ''}`)}
                </AvatarFallback>
              </Avatar>

              <p className="text-lg font-bold">
                {user.firstName} {user?.lastName}
              </p>
            </div>

            <h4 className="text-sm font-bold text-foreground">Summary</h4>
            <p className="text-sm">{user.about}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersPage;
