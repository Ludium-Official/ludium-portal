import type { Post } from '@/types/types.generated';
import { format } from 'date-fns';
import { Link } from 'react-router';

interface MainCommunityCardProps {
  post: Post;
}

function MainCommunityCard({ post }: MainCommunityCardProps) {
  return (
    <Link
      to={`/community/posts/${post.id}`}
      className="bg-white border border-gray-200 w-full max-w-[544px] rounded-lg hover:shadow-md transition-shadow flex flex-col p-5"
    >
      {/* Main Content */}
      <div className="flex gap-5 mb-5">
        {/* Thumbnail */}
        <div className="w-[283px] h-[192px] bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          {post?.image ? (
            <img
              src={post.image}
              alt={post?.title || 'Community post image'}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="/src/assets/figma/community-card-bg.png"
              alt="Community post background"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Title section */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex flex-col gap-0.5 min-w-0">
              <h3 className="text-base font-bold text-gray-900 leading-6 truncate">
                {post?.title || 'Community'}
              </h3>
              <span className="text-xs font-bold text-gray-500 leading-4 truncate">
                {post?.author?.firstName} {post?.author?.lastName}
              </span>
            </div>

            {/* Date + view */}
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className="text-xs text-gray-500 leading-4">
                {format(new Date(post?.createdAt || new Date()), 'yyyy.MM.dd')}
              </span>
              <div className="w-0.5 h-0.5 bg-gray-500 rounded-full" />
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 leading-3">Views</span>
                <span className="text-xs text-gray-500 leading-3">12</span>
              </div>
            </div>
          </div>

          {/* Detail */}
          <p className="text-sm text-gray-600 leading-5 flex-1 line-clamp-4 overflow-hidden break-words">
            {post?.summary ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc convallis nisl non euismod fringilla. Aliquam cursus, ante ut malesuada ultrices, diam eros condimentum enim, in mattis sapien eros eget nunc. Vivamus erat massa, pharetra eget nibh et, imperdiet convallis mi. Vestibulum dapibus, odio at sodales'}
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-200 mb-5" />

      {/* Comment section */}
      <div className="flex flex-col gap-4 min-w-0">
        {/* Badge */}
        <div className="flex items-center min-w-0">
          <span className="text-xs font-semibold bg-gray-100 text-gray-900 px-2.5 py-0.5 rounded-full border-0">
            New comment
          </span>
        </div>

        {/* Comment content */}
        <div className="flex gap-4 min-w-0">
          <div className="flex gap-4 flex-1 min-w-0">
            {/* Avatar */}
            <div className="w-10 h-10 bg-white rounded-full overflow-hidden flex-shrink-0">
              <img
                src="/src/assets/figma/community-avatar.png"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Comment details */}
            <div className="flex-1 flex flex-col gap-1 min-w-0">
              <div className="flex items-center justify-between min-w-0 gap-2">
                <span className="text-sm font-semibold text-gray-900 leading-5 truncate flex-shrink-0">
                  {post?.author?.firstName} {post?.author?.lastName}
                </span>
                <span className="text-xs text-gray-500 leading-4 flex-shrink-0">
                  Oct 22, 2023, 9:00:00 AM
                </span>
              </div>
              <p className="text-xs font-medium text-gray-900 leading-4 line-clamp-2 overflow-hidden break-words w-full">
                {post?.summary ||
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc convallis nisl non euismod fringilla. Aliquam cursus, ante ut malesuada ultrices, diam eros condimentum enim, in mattis sapien eros eget nunc. Vivamus erat massa, pharetra eget nibh et, imperdiet convallis mi. Vestibulum dapibus, odio at sodales'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MainCommunityCard;
