import { useCreateCommentMutation } from '@/apollo/mutation/create-comment.generated';
import { useCommentsByPostQuery } from '@/apollo/queries/comments-by-post.generated';
import { usePostQuery } from '@/apollo/queries/post.generated';
import { usePostsQuery } from '@/apollo/queries/posts.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { cn, getInitials } from '@/lib/utils';
import PostComment from '@/pages/community/details/_components/comment';
import { type Post, SortEnum } from '@/types/types.generated';
import { format } from 'date-fns';
import { ChevronDown, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

const CommunityDetailsPage: React.FC = () => {
  const { userId } = useAuth();

  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  // const [replyValues, setReplyValues] = useState<Record<string, string>>({});
  const [comment, setComment] = useState('');

  const [commentsOpen, setCommentsOpen] = useState(false);

  const postId = id || '';

  const { data: postsData } = usePostsQuery({
    variables: {
      pagination: {
        limit: 4,
        offset: 0,
        sort: SortEnum.Desc,
      },
    },
  });

  const { data, loading, error } = usePostQuery({
    variables: {
      id: postId,
    },
    skip: !postId,
    fetchPolicy: 'cache-and-network',
  });

  const { data: comments, refetch: refetchComments } = useCommentsByPostQuery({
    variables: {
      postId,
    },
    skip: !postId,
    fetchPolicy: 'cache-and-network',
  });

  const [createComment, { loading: submittingComment }] = useCreateCommentMutation();

  const handleSubmitComment = async () => {
    if (!comment.trim() || !postId) return;

    try {
      await createComment({
        variables: {
          input: {
            content: comment,
            postId,
          },
        },
      });

      setComment('');
      refetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (data?.post) {
      setPost(data.post);
    }
  }, [data]);

  if (loading && !data) {
    return (
      <div className="bg-white p-8 text-center">
        <p className="text-lg">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 text-center">
        <p className="text-lg text-red-500">Error loading post: {error.message}</p>
      </div>
    );
  }

  if (!loading && !data?.post) {
    return (
      <div className="bg-white p-8 text-center">
        <p className="text-lg">Post not found.</p>
      </div>
    );
  }

  const badgeVariants = ['teal', 'orange', 'pink'];

  return (
    <div className="bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-6 pt-10">
            {/* Tags section */}
            <div className="flex flex-wrap gap-2 mb-4">
              {data?.post?.keywords?.map((k, i) => (
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

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">{post?.title}</h1>

              {data?.post?.author?.id === userId && (
                <Link to={`/community/posts/${data?.post?.id}/edit`}>
                  <Settings className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Author info */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={post?.author?.image || ''}
                  alt={`${post?.author?.firstName} ${post?.author?.lastName}`}
                />
                <AvatarFallback className="bg-purple-600 text-white text-xs">
                  {getInitials(`${post?.author?.firstName} ${post?.author?.lastName}`)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold">{`${post?.author?.firstName || ''} ${post?.author?.lastName || ''}`}</span>
              {/* {post?.createdAt && (
                <span className="text-xs text-gray-500">
                  • {format(new Date(post.createdAt), 'dd.MM.yyyy')}
                </span>
              )} */}
            </div>

            {post?.createdAt && (
              <div className="text-xs font-bold mb-6 bg-[#F8ECFF] text-[#B331FF] rounded inline-block px-2 py-1">
                {format(new Date(post.createdAt), 'dd.MM.yyyy')}
              </div>
            )}

            {/* Post image */}
            <div className="w-full h-80 mb-6 bg-gradient-to-r from-purple-300 to-blue-300 rounded-lg overflow-hidden">
              <div className="flex h-full items-center justify-center">
                {post?.image ? (
                  <img
                    src={post.image}
                    alt={post.title || 'Post'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="bg-white/20 rounded-full w-20 h-20" />
                )}
              </div>
            </div>

            {/* Content section */}
            <div className="mb-20">
              <h2 className="uppercase text-lg font-bold tracking-wider mb-2 text-foreground">
                Content
              </h2>
              <div className="text-sm text-slate-600 whitespace-pre-line">
                {data?.post?.content}
              </div>
            </div>

            {/* Comments section */}
            <div className="mb-8">
              <button
                type="button"
                onClick={() => setCommentsOpen((prev) => !prev)}
                className={cn(
                  'text-sm font-medium tracking-wider mb-2 rounded-md text-secondary-foreground flex items-center px-4 py-[10px]',
                  commentsOpen && 'bg-[#F4F4F5]',
                )}
              >
                Comment{' '}
                <span className="font-bold text-[#B331FF] ml-1">
                  {comments?.commentsByPost?.length}
                </span>
                <ChevronDown
                  className={cn('w-4 h-4 ml-2 transition-transform', commentsOpen && 'rotate-180')}
                />
              </button>

              {/* Comment input */}
              {commentsOpen && (
                <div className="bg-[#F4F4F5] rounded-md">
                  <div className="mb-4 p-4 border-b">
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white"
                      rows={5}
                      placeholder="Enter your comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        className="bg-black text-white font-medium text-sm px-4 py-[10px] h-auto rounded-md"
                        onClick={handleSubmitComment}
                        disabled={submittingComment || !comment.trim()}
                      >
                        Send
                      </Button>
                    </div>
                  </div>

                  {/* Comments list */}
                  <div className="space-y-6 p-4">
                    {comments?.commentsByPost
                      ?.filter((comment) => !comment.parent)
                      .map((topComment) => (
                        <PostComment
                          key={topComment.id}
                          postId={postId}
                          comment={topComment}
                          refetchComments={refetchComments}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-full border-l mx-auto" />

          {/* Sidebar with related posts */}
          <div className="col-span-5 pt-[60px]">
            <div className="space-y-4">
              {postsData?.posts?.data?.map((post) => (
                <Link
                  to={`/community/posts/${post.id}`}
                  key={post.id}
                  className="flex gap-3 p-6 border border-gray-200 rounded-lg"
                >
                  <div className="w-[200px] h-[112px] bg-gradient-to-r from-purple-300 to-blue-300 rounded-md shrink-0">
                    {post?.image ? (
                      <img
                        src={post.image}
                        alt={'Post'}
                        className="w-full h-[112px] object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-16 h-16 bg-white/20 rounded-full" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between items-start">
                    {!!post.keywords?.[0]?.name && (
                      <span className="font-medium bg-gray-800 text-white rounded-full px-2.5 py-0.5 text-[10px] text-center">
                        {post.keywords?.[0]?.name}
                      </span>
                    )}
                    {/* <div className="font-bold mb-0.5">Community</div> */}
                    <h3 className="font-bold">{post.title}</h3>
                    <p className="text-muted-foreground text-xs font-bold">
                      {post.author?.firstName} {post.author?.lastName}
                    </p>
                    <div className="text-xs text-gray-500 mt-auto">{post.createdAt}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailsPage;
