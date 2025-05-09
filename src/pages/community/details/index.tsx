import { useCommentsByPostQuery } from '@/apollo/queries/comments-by-post.generated';
import { usePostQuery } from '@/apollo/queries/post.generated';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import type { Post } from '@/types/types.generated';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const CommunityDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  const postId = id || '';

  const { data, loading, error } = usePostQuery({
    variables: {
      id: postId,
    },
    skip: !postId,
    fetchPolicy: 'cache-and-network',
  });

  const { data: comments } = useCommentsByPostQuery({
    variables: {
      postId,
    },
    skip: !postId,
    fetchPolicy: 'cache-and-network',
  });

  const [comment, setComment] = useState('');

  const relatedPosts = [
    {
      id: 'post1',
      title: 'Community Title',
      dateRange: '2025.02.15 - 2025.03.14',
      badge: '0-1',
    },
    {
      id: 'post2',
      title: 'Community Title',
      dateRange: '2025.02.15 - 2025.03.14',
      badge: '0-1',
    },
    {
      id: 'post3',
      title: 'Community Title',
      dateRange: '2025.02.15 - 2025.03.14',
      badge: '0-1',
    },
    {
      id: 'post4',
      title: 'Community Title',
      dateRange: '2025.02.15 - 2025.03.14',
      badge: '0-1',
    },
  ];

  const handleSubmitComment = () => {
    if (!comment.trim()) return;

    console.log('Submitting comment:', comment);

    setComment('');
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

  return (
    <div className="bg-white">
      <div className="max-w-screen-xl mx-auto pb-10 px-4 sm:px-6">
        {/* Header */}
        <div className="flex justify-between items-center py-4 border-b">
          <h1 className="text-xl font-bold">{post?.title}</h1>
        </div>

        <div className="grid grid-cols-12 gap-6 mt-8">
          {/* Main Content */}
          <div className="col-span-7">
            {/* Author info */}
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-purple-600 text-white text-xs">
                  {getInitials(`${post?.author?.firstName} ${post?.author?.lastName}`)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{`${post?.author?.firstName || ''} ${post?.author?.lastName || ''}`}</span>
              {post?.createdAt && (
                <span className="text-xs text-gray-500">
                  • {format(new Date(post.createdAt), 'dd.MM.yyyy')}
                </span>
              )}
            </div>

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

            {/* Description section */}
            <div className="mb-8">
              <h2 className="uppercase text-sm font-bold tracking-wider mb-2 text-gray-700">
                Content
              </h2>
              <div className="text-sm text-gray-700 whitespace-pre-line">{data?.post?.content}</div>
            </div>

            {/* Tags section */}
            <div className="mb-8">
              <h2 className="uppercase text-sm font-bold tracking-wider mb-2 text-gray-700">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {data?.post?.keywords?.map((tag) => (
                  <div key={`tag-${tag.id}`} className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                    #{tag.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Comments section */}
            <div className="mb-8">
              <h2 className="uppercase text-sm font-bold tracking-wider mb-2 text-gray-700 flex items-center">
                Comment{' '}
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-xs">
                  {comments?.commentsByPost?.length}
                </span>
              </h2>

              {/* Comment input */}
              <div className="mb-4">
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md text-sm"
                  rows={5}
                  placeholder="Enter your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <Button
                    className="bg-black text-white text-xs px-4 py-1 h-auto rounded"
                    onClick={handleSubmitComment}
                  >
                    Send
                  </Button>
                </div>
              </div>

              {/* Comments list */}
              <div className="space-y-4">
                {comments?.commentsByPost?.map((comment) => (
                  <div key={comment.id} className={`${comment.parent ? 'ml-12' : ''}`}>
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-600 text-white">
                          {getInitials(`${comment.author?.firstName} ${comment.author?.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium text-sm">{`${comment.author?.firstName} ${comment.author?.lastName}`}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {format(comment.createdAt, 'dd.MM.yyyy, h:mm a')}
                          </span>
                        </div>

                        {comment.parent && (
                          <div className="text-xs text-gray-500 mb-1">
                            Reply to{' '}
                            <span className="font-medium">{`${comment.parent.author?.firstName} ${comment.parent.author?.lastName}`}</span>
                          </div>
                        )}

                        <p className="text-sm text-gray-600 mt-1">{comment.content}</p>

                        <div className="mt-2">
                          <Button
                            variant="ghost"
                            className="h-auto p-0 text-xs font-medium text-gray-500 hover:text-gray-700"
                          >
                            Reply →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center sm:hidden mb-6">
              <textarea
                placeholder="Reply this thread"
                className="w-full border rounded-md p-3 text-sm"
                rows={4}
              />
              <Button className="bg-black text-white px-4 py-1 rounded ml-2 h-auto mt-2">
                Send
              </Button>
            </div>
          </div>

          {/* Sidebar with related posts */}
          <div className="col-span-5">
            <div className="space-y-4">
              {relatedPosts.map((relatedPost) => (
                <div
                  key={relatedPost.id}
                  className="flex gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <div className="w-20 h-16 bg-gradient-to-r from-purple-300 to-blue-300 rounded-md shrink-0">
                    <div className="flex h-full items-center justify-center">
                      <div className="bg-white/20 rounded-full w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <div className="uppercase text-[10px] tracking-wider font-bold text-gray-700 mb-0.5">
                      Community
                    </div>
                    <h3 className="text-sm font-medium">{relatedPost.title}</h3>
                    <div className="text-xs text-gray-500 mt-1">
                      {relatedPost.dateRange}
                      <span className="ml-3 font-medium bg-gray-800 text-white rounded-full px-1.5 py-0.5 text-[10px]">
                        {relatedPost.badge}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailsPage;
