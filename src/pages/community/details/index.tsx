import { useCreateCommentMutation } from '@/apollo/mutation/create-comment.generated';
import { useCommentsByCommentableQuery } from '@/apollo/queries/comments-by-commentable.generated';
import { usePostQuery } from '@/apollo/queries/post.generated';
import { usePostsQuery } from '@/apollo/queries/posts.generated';
import { CommentSection } from '@/components/comment-section';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useAuth } from '@/lib/hooks/use-auth';
import { getInitials, getUserName } from '@/lib/utils';

import { CommentableTypeEnum, type Post, SortEnum } from '@/types/types.generated';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

const CommunityDetailsPage: React.FC = () => {
  const { userId, isAdmin, isLoggedIn } = useAuth();

  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  // const [replyValues, setReplyValues] = useState<Record<string, string>>({});

  const [authorId, setAuthorId] = useState<string | null>(null);
  const postId = id || '';

  const { data: postsData } = usePostsQuery({
    variables: {
      pagination: {
        offset: 0,
        sort: SortEnum.Desc,
        filter: authorId
          ? [
            {
              field: 'authorId',
              value: authorId,
            },
          ]
          : [],
      },
    },
    skip: !authorId,
    fetchPolicy: 'cache-and-network',
  });

  const { data, loading, error } = usePostQuery({
    variables: {
      id: postId,
    },
    skip: !postId,
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.post?.author?.id) {
        setAuthorId(data.post.author.id);
      }
    },
  });

  const { data: comments, refetch: refetchComments } = useCommentsByCommentableQuery({
    variables: {
      commentableId: postId,
      commentableType: CommentableTypeEnum.Post,
    },
    skip: !postId,
    fetchPolicy: 'cache-and-network',
  });

  const [createComment] = useCreateCommentMutation();

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
  const posts = postsData?.posts?.data ?? [];
  const currentIndex = posts.findIndex((post) => post.id === postId);

  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <div className="bg-white rounded-2xl">
      <div className="max-w-1440 mx-auto">
        <div className="flex">
          <div className="w-[70%] p-10 flex flex-col gap-20 border-r">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">{post?.title}</h1>
                {(data?.post?.author?.id === userId || isAdmin) && (
                  <Link
                    to={`/community/posts/${data?.post?.id}/edit`}
                    className="h-10 px-4 bg-zinc-100 flex items-center justify-center gap-2 rounded-md"
                  >
                    <p className="font-medium text-sm">Edit</p>
                    <Settings className="w-4 h-4" />
                  </Link>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={post?.author?.image || ''}
                      alt={`${post?.author?.firstName} ${post?.author?.lastName}`}
                    />
                    <AvatarFallback className="bg-purple-600 text-white text-xs">
                      {getInitials(`${post?.author?.firstName} ${post?.author?.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold">{getUserName(post?.author)}</span>
                </div>
                {post?.createdAt && (
                  <div className="flex gap-[6px] text-xs text-gray-500">
                    <span>{format(new Date(post.createdAt), 'dd.MM.yyyy')}</span>
                    <span>•</span>
                    <span>Views {12}</span>
                  </div>
                )}
              </div>
              <div className="w-full max-h-[429px] bg-gradient-to-r from-purple-300 to-blue-300 rounded-lg overflow-hidden">
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
              <div className="flex flex-col gap-3">
                <h1 className="font-bold text-lg">PROPOSAL</h1>
                <p className="text-sm text-slate-600">{post?.summary}</p>
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="font-bold text-lg">DESCRIPTION</h1>
                <p className="text-sm text-slate-600">{post?.content}</p>
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="font-bold text-lg">LINKS</h1>
                {post?.author?.links?.map((link) => (
                  <a
                    href={link.url ?? ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={link.title}
                    className="text-sm text-slate-600"
                  >
                    {link.url}
                  </a>
                ))}
              </div>
            </div>
            {/* Comment Section */}
            <CommentSection
              postId={postId}
              comments={comments?.commentsByCommentable ?? []}
              isLoggedIn={isLoggedIn ?? false}
              onSubmitComment={async (content) =>
                await createComment({
                  variables: {
                    input: {
                      content,
                      commentableId: postId,
                      commentableType: CommentableTypeEnum.Post,
                    },
                  },
                })
              }
              refetchComments={refetchComments}
            />

            <div className="flex items-center justify-between">
              <Link
                to={prevPost ? `/community/posts/${prevPost.id}` : '#'}
                className={`flex gap-1 w-[104px] h-10 items-center justify-center ${prevPost
                  ? 'hover:text-muted-foreground'
                  : 'text-muted-foreground pointer-events-none cursor-default'
                  }`}
              >
                <ChevronLeft width={16} height={16} />
                <p className="font-medium text-sm">Previous</p>
              </Link>

              <Link
                to={nextPost ? `/community/posts/${nextPost.id}` : '#'}
                className={`flex gap-1 w-[104px] h-10 items-center justify-center ${nextPost
                  ? 'hover:text-muted-foreground'
                  : 'text-muted-foreground pointer-events-none cursor-default'
                  }`}
              >
                <p className="font-medium text-sm">Next</p>
                <ChevronRight width={16} height={16} />
              </Link>
            </div>
          </div>
          {/* Sidebar with related posts */}
          <div className="w-[30%] py-[60px] pl-0.5 space-y-3">
            {postsData?.posts?.data
              ?.filter((p) => p.id !== postId)
              .map((post) => (
                <Link
                  to={`/community/posts/${post.id}`}
                  key={post.id}
                  className="flex gap-3 p-5 border border-gray-200 rounded-lg"
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
                  <div className="flex flex-col items-start justify-between">
                    <div className="space-y-0.5">
                      <p className="font-bold line-clamp-1 font-inter">{post.title}</p>
                      <p className="text-muted-foreground text-xs font-bold">
                        {getUserName(post.author)}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs text-muted-foreground">
                        {post.createdAt} <span>•</span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Views {12}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailsPage;
