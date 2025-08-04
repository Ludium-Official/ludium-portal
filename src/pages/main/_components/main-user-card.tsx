import { Badge } from '@/components/ui/badge';
import type { User } from '@/types/types.generated';
import { BriefcaseBusiness, Building2 } from 'lucide-react';
import { Link } from 'react-router';

interface MainUserCardProps {
  user: User;
}

function MainUserCard({ user }: MainUserCardProps) {
  return (
    <Link
      to={`/community/users/${user.id}`}
      className="bg-white border border-gray-200 w-[572px] rounded-lg hover:shadow-md transition-shadow flex flex-col p-5"
    >
      {/* Main Content */}
      <div className="flex gap-4">
        {/* User Overview */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Title section */}
          <div className="flex gap-4">
            {/* Avatar */}
            <div className="w-15 h-15 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
              {user?.avatar || user?.image ? (
                <img
                  src={user.avatar || user.image}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {user?.firstName?.[0]}{user?.lastName?.[0] || 'VA'}
                </span>
              )}
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-gray-900 leading-7">
                {user?.firstName} {user?.lastName || 'Validator User'}
              </h3>

              {/* User details */}
              <div className="flex flex-col gap-2">
                {/* Organization */}
                <div className="flex items-center gap-2">
                  <Building2 className='w-4 h-4 text-muted-foreground' />
                  <span className="text-sm text-gray-500 leading-5">
                    {user?.organizationName || 'Validator Organization'}
                  </span>
                </div>

                {/* Role badges */}
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness className='w-4 h-4 text-muted-foreground' />
                  <div className="flex gap-1.5">
                    {['Developer', 'BD', 'Protocol Developer'].map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs bg-gray-900 text-white border-0 px-2.5 py-0.5 rounded-full"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className='flex gap-4 mt-3'>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-5 line-clamp-1">
              {user?.summary || 'Lorem ipsum dolor sit amet, consectet'}
            </p>

            {/* Stats */}
            <div className="flex gap-3 pt-3">
              {/* Recruitment */}
              <div className="w-33 flex flex-col gap-1">
                <h4 className="text-xs font-bold text-gray-900 leading-3">Recruitment</h4>
                <div className="border-t border-gray-200 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 leading-4 w-17">Sponsor</span>
                  <span className="text-sm font-bold text-gray-900 leading-5">3</span>
                </div>
                <div className="border-t border-gray-200 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 leading-4 w-17">Validator</span>
                  <span className="text-sm font-bold text-gray-900 leading-5">4</span>
                </div>
                <div className="border-t border-gray-200 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 leading-4 w-17">Builder</span>
                  <span className="text-sm font-bold text-gray-900 leading-5">2</span>
                </div>
              </div>

              {/* Investment */}
              <div className="w-33 flex flex-col gap-1">
                <h4 className="text-xs font-bold text-gray-900 leading-3">investment</h4>
                <div className="border-t border-gray-200 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 leading-4 w-17">Host</span>
                  <span className="text-sm font-bold text-gray-900 leading-5">3</span>
                </div>
                <div className="border-t border-gray-200 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 leading-4 w-17">Project</span>
                  <span className="text-sm font-bold text-gray-900 leading-5">4</span>
                </div>
                <div className="border-t border-gray-200 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 leading-4 w-17">Supporter</span>
                  <span className="text-sm font-bold text-gray-900 leading-5">2</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom badges */}
      <div className="flex gap-1.5 mt-3">
        {['Crypto', 'BD', 'Develope'].map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="text-xs bg-gray-100 text-gray-900 border-0 px-2.5 py-0.5 rounded-full"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </Link>
  );
}

export default MainUserCard; 