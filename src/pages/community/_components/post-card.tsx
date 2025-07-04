import { useCommentsByPostQuery } from '@/apollo/queries/comments-by-post.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/hooks/use-auth';
import { cn, getInitials, getUserName } from '@/lib/utils';
import type { Post } from '@/types/types.generated';
import { format } from 'date-fns';
import { Settings } from 'lucide-react';
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
  const { id, title, createdAt, summary } = post ?? {};

  const postId = id || '';

  const { data, loading } = useCommentsByPostQuery({
    variables: {
      postId,
    },
    skip: !postId,
    fetchPolicy: 'cache-and-network',
  });

  const authorName = getUserName(post?.author);

  if (loading && !data) {
    return (
      <div className="bg-white p-8 text-center">
        <p className="text-lg">Loading comments...</p>
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <Link
        to={`/community/posts/${id}`}
        className="block w-full border border-gray-border rounded-lg overflow-hidden p-5"
      >
        <div className="relative h-full flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div className="w-full aspect-video bg-gradient-to-r from-purple-300 to-blue-300 flex-shrink-0 rounded-lg overflow-hidden">
              {post?.image ? (
                <img src={post.image} alt={title || 'Post'} className="w-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="w-16 h-16 bg-white/20 rounded-full" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-base mb-0.5">{title || 'Community'}</h2>
                <div className="text-xs text-muted-foreground">
                  {createdAt ? (
                    <div className="flex gap-[6px] text-xs text-gray-500">
                      <span>{format(new Date(post.createdAt), 'dd.MM.yyyy')}</span>
                      <span>•</span>
                      <span>Views {12}</span>
                    </div>
                  ) : (
                    ''
                  )}
                  {isSponsor && (
                    <Link to={`/community/${post?.id}/edit`} className="ml-2">
                      <Settings className="w-4 h-4 inline" />
                    </Link>
                  )}
                </div>
              </div>
              <p className="text-xs mb-0.5 text-muted-foreground font-bold">{authorName}</p>
            </div>
            <p className="text-sm text-slate-500 line-clamp-3 font-inter">{summary}</p>
          </div>
          <Separator />
          <div className="flex-grow flex flex-col gap-4">
            <div>
              {!data?.commentsByPost?.length && (
                <p className="font-medium text-sm mb-50 py-2">No comments yet</p>
              )}
              {!!data?.commentsByPost?.length && (
                <span className="px-[10px] py-[2px] font-semibold text-secondary-foreground bg-secondary rounded-full text-xs inline-block">
                  New comment
                </span>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {data?.commentsByPost?.slice(0, maxComments).map((comment, idx) => (
                <div
                  key={comment.id}
                  className={cn('flex gap-4', idx < maxComments - 1 && 'border-b pb-4')}
                >
                  <Avatar className="w-10 h-10">
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
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{getUserName(comment.author)}</h4>
                      <span className="text-xs text-muted-foreground">
                        {comment.createdAt
                          ? format(new Date(comment.createdAt), 'MMM dd, yyyy, h:mm:ss a')
                          : ''}
                      </span>
                    </div>
                    <p className="font-medium text-xs text-gray-dark line-clamp-1 font-inter">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default small card
  return (
    <Link
      to={`/community/posts/${id}`}
      className="w-full border border-gray-border rounded-lg overflow-hidden p-5 flex flex-col gap-5"
    >
      <div className="flex gap-5">
        <div className="aspect-video w-1/2 bg-gradient-to-r from-purple-300 to-blue-300 flex-shrink-0 rounded-lg overflow-hidden">
          {post?.image ? (
            <img src={post.image} alt={title || 'Post'} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 bg-white/20 rounded-full" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-bold text-base line-clamp-1 w-full font-inter">
              {title || 'Community'}
            </h2>
            <p className="text-xs font-bold text-muted-foreground">{authorName}</p>
            {post?.createdAt && (
              <div className="flex gap-[6px] text-xs text-muted-foreground">
                <span>{format(new Date(post.createdAt), 'dd.MM.yyyy')}</span>
                <span>•</span>
                <span>Views {12}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-500 line-clamp-4 font-inter">{summary}</p>
        </div>
      </div>
      <Separator />
      <div className="flex-grow flex flex-col gap-4">
        <div>
          {!data?.commentsByPost?.length && <p className="font-medium text-sm">No comments yet</p>}
          {!!data?.commentsByPost?.length && (
            <span className="px-[10px] py-[2px] font-semibold text-gray-dark bg-secondary rounded-full text-xs inline-block">
              New comment
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {data?.commentsByPost?.slice(0, maxComments).map((comment, idx) => (
            <div
              key={comment.id}
              className={cn('flex gap-4', idx < maxComments - 1 && 'border-b pb-4')}
            >
              <Avatar className="w-10 h-10">
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
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">{getUserName(comment.author)}</h4>
                  <span className="text-xs text-muted-foreground">
                    {comment.createdAt
                      ? format(new Date(comment.createdAt), 'MMM dd, yyyy, h:mm:ss a')
                      : ''}
                  </span>
                </div>
                <p className="font-medium text-xs text-gray-dark line-clamp-1 font-inter">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
