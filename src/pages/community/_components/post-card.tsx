import { useCommentsByPostQuery } from '@/apollo/queries/comments-by-post.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/use-auth';
import { cn, getInitials } from '@/lib/utils';
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
  // const authorInitials = getInitials(authorName);

  if (loading && !data) {
    return (
      <div className="bg-white p-8 text-center">
        <p className="text-lg">Loading comments...</p>
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div className="block w-full h-full border border-[#E9E9E9] rounded-[20px] overflow-hidden p-6">
        <div className="relative h-full flex flex-col">
          <div className="w-full aspect-video bg-gradient-to-r from-purple-300 to-blue-300 flex-shrink-0 rounded-lg overflow-hidden">
            {post?.image ? (
              <img
                src={post.image}
                alt={title || 'Post'}
                className="w-full h-[500px] object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="w-16 h-16 bg-white/20 rounded-full" />
              </div>
            )}
          </div>

          <div className="pt-3 flex-grow flex flex-col justify-between">
            <div>
              <h2 className="font-bold text-base mb-0.5">{title || 'Community'}</h2>

              <p className="text-xs mb-0.5 text-muted-foreground font-bold">{authorName}</p>
              <div className="flex items-center mb-2 justify-between">
                <p className="text-xs text-muted-foreground">
                  {createdAt ? format(new Date(createdAt), 'yyyy.MM.dd') : ''}
                  {isSponsor && (
                    <Link to={`/community/${post?.id}/edit`} className="ml-2">
                      <Settings className="w-4 h-4 inline" />
                    </Link>
                  )}
                </p>
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

              <p className="text-sm text-gray-700 mb-3 line-clamp-3">{content}</p>
            </div>

            <div className="border-t border-gray-100 pt-2 pb-1">
              <span className="px-[10px] py-[2px] mb-4 font-semibold text-secondary-foreground bg-secondary rounded-full text-xs inline-block">
                New comment
              </span>

              {data?.commentsByPost?.slice(0, maxComments).map((comment, idx) => (
                <div
                  key={comment.id}
                  className={cn('flex mb-4', idx < maxComments - 1 && 'border-b pb-2')}
                >
                  <Avatar className="w-8 h-8 mr-3">
                    <AvatarImage
                      src={comment.author?.image || ''}
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
                  className="flex items-center text-sm font-medium text-foreground hover:text-gray-800"
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
    <div className="block w-full border border-[#E9E9E9] rounded-[20px] overflow-hidden p-6">
      <div className="relative h-full flex flex-col">
        <div className="flex gap-4 mb-5">
          <div className="aspect-video w-1/2 bg-gradient-to-r from-purple-300 to-blue-300 flex-shrink-0 rounded-lg overflow-hidden">
            {post?.image ? (
              <img src={post.image} alt={title || 'Post'} className=" object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="w-10 h-10 bg-white/20 rounded-full" />
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-base line-clamp-1">{title || 'Community'}</h2>
              {/* <div className="flex gap-1">
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
              </div> */}
            </div>

            <p className="text-xs font-bold text-muted-foreground">{authorName}</p>
            <div className="flex items-center justify-between mb-3">
              {/* <Avatar className="w-4 h-4 mr-1.5">
                <AvatarImage src={post?.author?.image || ''} alt={authorName} />
                <AvatarFallback className="text-[8px]">{authorInitials}</AvatarFallback>
              </Avatar> */}
              <p className="text-xs text-gray-500 mr-3">
                {createdAt ? format(new Date(createdAt), 'yyyy.MM.dd') : ''}
              </p>
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

            <p className="text-sm text-gray-700 mb-3 line-clamp-4">{content}</p>
          </div>
        </div>

        <div className="pt-4 flex-grow flex flex-col justify-between">
          {data?.commentsByPost?.length && data?.commentsByPost?.length > 0 && (
            <div className="border-t pt-5 border-gray-100 pb-1">
              <span className="px-[10px] py-[2px] mb-4 font-semibold text-secondary-foreground bg-secondary rounded-full text-xs inline-block">
                New comment
              </span>

              {data?.commentsByPost?.slice(0, maxComments).map((comment) => (
                <div key={comment.id} className="flex mb-2">
                  <Avatar className="w-10 h-10 mr-2">
                    <AvatarImage
                      src={comment.author?.image || ''}
                      alt={`${comment.author?.firstName} ${comment.author?.lastName}`}
                    />
                    <AvatarFallback className="text-[10px]">
                      {getInitials(
                        `${comment.author?.firstName || ''} ${comment.author?.lastName || ''}`,
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center mb-1 justify-between">
                      <h4 className="font-medium text-sm">{`${comment.author?.firstName || ''} ${comment.author?.lastName || ''}`}</h4>
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

              <div className="flex justify-end mt-4">
                <Link
                  to={`/community/posts/${id}`}
                  className="flex items-center text-sm font-medium text-foreground hover:text-gray-800"
                >
                  View more <ArrowRight className="w-4 h-4 ml-1" />
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
