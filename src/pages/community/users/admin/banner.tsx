import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { AgentBreadcrumbs } from '../_components/agent-breadcrumbs';

// Mock data for programs
const mockPrograms = [
  {
    id: '1',
    name: 'PROGRAM NAME 3: SAMPLE',
    creator: {
      firstName: 'William Smith',
      image: 'https://via.placeholder.com/28x28'
    },
    price: '40,000',
    currency: 'USDT',
    network: 'Arbitrum',
    deadline: '2025-03-30',
    description: "Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment solution that leverages Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment solution that leverages Ludium's zkTLS Builder Escrow Payment Service is a decentralized payment solution that leverages",
    status: 'payment_required',
    keywords: [
      { id: '1', name: 'New' },
      { id: '2', name: 'Social' },
      { id: '3', name: 'Solidity' }
    ],
    image: 'https://via.placeholder.com/128x128'
  },
  {
    id: '2',
    name: 'PROGRAM NAME 4: SAMPLE',
    creator: {
      firstName: 'William Smith',
      image: 'https://via.placeholder.com/28x28'
    },
    price: '25,000',
    currency: 'USDT',
    network: 'Arbitrum',
    deadline: '2025-04-15',
    description: "Another innovative blockchain solution that leverages advanced cryptographic protocols for secure and efficient decentralized applications.",
    status: 'payment_required',
    keywords: [
      { id: '1', name: 'New' },
      { id: '2', name: 'Social' },
      { id: '3', name: 'Solidity' }
    ],
    image: 'https://via.placeholder.com/128x128'
  }
];

// Mock data for posts
const mockPosts = [
  {
    id: '1',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc convallis nisl non euismod fringilla.',
    author: 'William Smith',
    date: '2025.06.13',
    views: 12,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc convallis nisl non euismod fringilla. Aliquam cursus, ante ut malesuada ultrices, diam eros condimentum enim, in mattis sapien eros eget nunc. Vivamus erat massa, pharetra eget nibh et, imperdiet convallis mi. Vestibulum dapibus, odio at sodales',
    comments: 2,
    image: 'https://via.placeholder.com/356x242'
  }
];

// Simple Switch component
const Switch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-input'
      )}
    >
      <span
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
};

function BannerAdminPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div className="flex h-12 items-center justify-between pl-4">
          <AgentBreadcrumbs myProfile={true} />
          <div className="relative w-[360px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus:border-gray-300"
            />
          </div>
        </div>

        {/* Mock Program Cards */}
        <div className="flex flex-col gap-3">
          {mockPrograms.map((program) => (
            <div key={program.id} className="flex flex-col gap-3 p-3 border rounded-lg">
              {/* Badge Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={false} onChange={() => { }} />
                  {program.keywords.map((keyword) => (
                    <Badge key={keyword.id} variant="secondary" className="text-xs">
                      {keyword.name}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 bg-[#18181B0A] rounded-full px-2 py-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-semibold text-[#18181B]">Payment required</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0" />

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-lg font-bold text-[#18181B]">{program.name}</h3>

                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-300" />
                    <span className="text-sm text-[#71717A]">{program.creator.firstName}</span>
                  </div>

                  {/* Price and Deadline */}
                  <div className="flex flex-col gap-2">
                    <div className="bg-[#0000000A] rounded-lg px-2 py-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-[#A3A3A3]">PRICE</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#71717A]">{program.price}</span>
                          <span className="text-xs font-medium text-[#71717A]">{program.currency}</span>
                          <div className="w-px h-4 bg-gray-300" />
                          <span className="text-xs font-medium text-[#71717A]">{program.network}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0000000A] rounded-lg px-2 py-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-[#A3A3A3]">DEADLINE</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-[#71717A]">30.MAR.2025</span>
                          <Badge variant="default" className="text-xs">D-7</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#64748B] line-clamp-2">{program.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mock Post Card */}
        <div className="flex flex-col gap-3 p-3 border rounded-lg bg-[#FAFAFA]">
          {/* Switch */}
          <div className="flex justify-start">
            <Switch checked={false} onChange={() => { }} />
          </div>

          {/* Post Content */}
          <div className="flex gap-5">
            {/* Image */}
            <div className="w-[356px] h-[242px] bg-gray-200 rounded-lg flex-shrink-0" />

            {/* Content */}
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-[#18181B] line-clamp-2">{mockPosts[0].title}</h3>
                <span className="text-xs font-semibold text-[#71717A]">{mockPosts[0].author}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#71717A]">{mockPosts[0].date}</span>
                  <div className="w-1 h-1 rounded-full bg-[#71717A]" />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-[#71717A]">Views</span>
                    <span className="text-xs text-[#71717A]">{mockPosts[0].views}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#64748B] line-clamp-3">{mockPosts[0].description}</p>

              <div className="mt-auto">
                <Button variant="secondary" className="bg-[#F4F4F5] text-[#71717A] hover:bg-[#F4F4F5]">
                  <span className="text-sm font-medium">Comment</span>
                  <span className="text-sm font-bold text-[#B331FF] ml-1">{mockPosts[0].comments}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerAdminPage;