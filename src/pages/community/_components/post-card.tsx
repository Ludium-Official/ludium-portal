import { useCommentsByPostQuery } from '@/apollo/queries/comments-by-post.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/use-auth';
import { getInitials } from '@/lib/utils';
import type { Post } from '@/types/types.generated';
import { format } from 'date-fns';
import { ArrowRight, Settings } from 'lucide-react';
import { Link } from 'react-router';


interface ExtendedPost extends Post {
  commentCount?: number;
}

interface PostCardProps {
  post: ExtendedPost;
  variant?: 'large' | 'horizontal' | 'small';
  maxComments?: number;
}

function PostCard({ post, variant = 'small', maxComments = 1 }: PostCardProps) {
  const { isSponsor } = useAuth();
  const { id, title, content, keywords, createdAt } = post ?? {};
  const badgeVariants = ['teal', 'orange', 'pink'];

  const postId = id || '';

  const { data, loading } = useCommentsByPostQuery({
    variables: {
      postId,
    },
    skip: !postId,
    fetchPolicy: 'cache-and-network',
  });


  const authorName = `${post?.author?.firstName} ${post?.author?.lastName}`;
  const authorInitials = getInitials(authorName);

  if (loading && !data) {
    return (
      <div className="bg-white p-8 text-center">
        <p className="text-lg">Loading comments...</p>
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div className="block w-full h-full border border-[#E9E9E9] rounded-[20px] overflow-hidden">
        <div className="relative h-full flex flex-col">
          <div className="w-full h-[250px] bg-gradient-to-r from-purple-300 to-blue-300 flex-shrink-0">
            {post?.image ? (
              <img src={post.image} alt={title || 'Post'} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="w-16 h-16 bg-white/20 rounded-full" />
              </div>
            )}
          </div>

          <div className="p-5 flex-grow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <h2 className="font-bold text-lg">{title || 'Community'}</h2>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {keywords?.slice(0, 3).map((k, i) => (
                    <Badge
                      key={k.id}
                      variant={
                        badgeVariants[i % badgeVariants.length] as
                          | 'default'
                          | 'secondary'
                          | 'purple'
                      }
                      className="rounded-full px-2 py-0.5 text-xs"
                    >
                      {k.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center mb-2">
                <Avatar className="w-8 h-8 mr-3">
                  <AvatarImage src="" alt={authorName} />
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
                <p className="text-sm">{authorName}</p>
                <span className="mx-2 text-gray-400">•</span>
                <p className="text-sm text-gray-500">
                  {createdAt ? format(new Date(createdAt), 'yyyy.MM.dd') : ''}
                  {isSponsor && (
                    <Link to={`/community/${post?.id}/edit`} className="ml-2">
                      <Settings className="w-4 h-4 inline" />
                    </Link>
                  )}
                </p>
              </div>

              <p className="text-sm text-gray-700 mb-6 line-clamp-3">{content}</p>
            </div>

            <div className="border-t border-gray-100 pt-4 pb-1">
              <h3 className="font-medium text-sm mb-4">New comment</h3>

              {data?.commentsByPost?.slice(0, maxComments).map((comment) => (
                <div key={comment.id} className="flex mb-4">
                  <Avatar className="w-8 h-8 mr-3">
                    <AvatarImage
                      src=""
                      alt={`${comment.author?.firstName} ${comment.author?.lastName}`}
                    />
                    <AvatarFallback>
                      {getInitials(
                        `${comment.author?.firstName || ''} ${comment.author?.lastName || ''}`,
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{`${comment.author?.firstName || ''} ${comment.author?.lastName || ''}`}</h4>
                      <span className="text-xs text-gray-500">
                        {comment.createdAt
                          ? format(new Date(comment.createdAt), 'MMM dd, yyyy, h:mm:ss a')
                          : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <Link
                  to={`/community/posts/${id}`}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  View more <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default small card
  return (
    <div className="block w-full h-full border border-[#E9E9E9] rounded-[20px] overflow-hidden">
      <div className="relative h-full flex flex-col">
        <div className="w-full h-[130px] bg-gradient-to-r from-purple-300 to-blue-300 flex-shrink-0">
          {post?.image ? (
            <img src={post.image} alt={title || 'Post'} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 bg-white/20 rounded-full" />
            </div>
          )}
        </div>

        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-sm">{title || 'Community'}</h2>
              <div className="flex gap-1">
                {keywords?.slice(0, 1).map((k, i) => (
                  <Badge
                    key={k.id}
                    variant={
                      badgeVariants[i % badgeVariants.length] as 'default' | 'secondary' | 'purple'
                    }
                    className="rounded-full px-2 py-0.5 text-xs"
                  >
                    {k.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center mb-1">
              <Avatar className="w-4 h-4 mr-1.5">
                <AvatarImage src="" alt={authorName} />
                <AvatarFallback className="text-[8px]">{authorInitials}</AvatarFallback>
              </Avatar>
              <p className="text-xs">{authorName}</p>
              <span className="mx-1 text-gray-400 text-xs">•</span>
              <p className="text-xs text-gray-500">
                {createdAt ? format(new Date(createdAt), 'yyyy.MM.dd') : ''}
              </p>
            </div>

            <p className="text-xs text-gray-700 mb-3 line-clamp-2">{content}</p>
          </div>

          {data?.commentsByPost?.length && data?.commentsByPost?.length > 0 && (
            <div className="border-t border-gray-100 pt-2 pb-1">
              <h3 className="font-medium text-xs mb-2">New comment</h3>

              {data?.commentsByPost?.slice(0, maxComments).map((comment) => (
                <div key={comment.id} className="flex mb-2">
                  <Avatar className="w-6 h-6 mr-2">
                    <AvatarImage
                      src=""
                      alt={`${comment.author?.firstName} ${comment.author?.lastName}`}
                    />
                    <AvatarFallback className="text-[10px]">
                      {getInitials(
                        `${comment.author?.firstName || ''} ${comment.author?.lastName || ''}`,
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center mb-0.5">
                      <h4 className="font-medium text-xs">{`${comment.author?.firstName || ''} ${comment.author?.lastName || ''}`}</h4>
                      <span className="text-xs text-gray-500 ml-2">
                        {comment.createdAt
                          ? format(new Date(comment.createdAt), 'MMM dd, yyyy')
                          : ''}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 line-clamp-1">{comment.content}</p>
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <Link
                  to={`/community/posts/${id}`}
                  className="flex items-center text-xs font-medium text-gray-600 hover:text-gray-800"
                >
                  View more <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
