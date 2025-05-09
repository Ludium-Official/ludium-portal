import { useCommentsByPostQuery } from '@/apollo/queries/comments-by-post.generated';
import { usePostQuery } from '@/apollo/queries/post.generated';
import { useCreateCommentMutation } from '@/apollo/mutation/create-comment.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import type { Post } from '@/types/types.generated';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const CommunityDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [replyValues, setReplyValues] = useState<Record<string, string>>({});
  const [comment, setComment] = useState('');

  const postId = id || '';

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

  const handleSubmitReply = async (parentId: string) => {
    const replyContent = replyValues[parentId || ''];
    if (!replyContent?.trim() || !postId) return;

    try {
      await createComment({
        variables: {
          input: {
            content: replyContent,
            postId,
            parentId,
          },
        },
      });
      
      // Clear the reply value
      setReplyValues(prev => ({
        ...prev,
        [parentId]: '',
      }));
      
      // Hide the reply form
      const replyForm = document.getElementById(`reply-form-${parentId}`);
      if (replyForm) {
        replyForm.classList.add('hidden');
      }
      
      // Refetch comments to get the updated list
      refetchComments();
    } catch (error) {
      console.error('Error submitting reply:', error);
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
                <AvatarImage src={post?.author?.image || ''} alt={`${post?.author?.firstName} ${post?.author?.lastName}`} />
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

            {/* Content section */}
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
                    disabled={submittingComment || !comment.trim()}
                  >
                    Send
                  </Button>
                </div>
              </div>

              {/* Comments list */}
              <div className="space-y-6">
                {comments?.commentsByPost?.filter(comment => !comment.parent).map((topComment) => (
                  <div key={topComment.id} className="border-b pb-4">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={topComment.author?.image || ''} alt={`${topComment.author?.firstName} ${topComment.author?.lastName}`} />
                        <AvatarFallback className="bg-purple-600 text-white">
                          {getInitials(`${topComment.author?.firstName} ${topComment.author?.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="font-medium">{`${topComment.author?.firstName} ${topComment.author?.lastName}`}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              {format(new Date(topComment.createdAt), 'dd.MM.yyyy, h:mm a')}
                            </span>
                          </div>
                          {topComment.parent && (
                            <div className="text-xs text-gray-500 mb-1">
                              Reply to{' '}
                              <span className="font-medium">{`${topComment.parent.author?.firstName} ${topComment.parent.author?.lastName}`}</span>
                            </div>
                          )}
                          <p className="text-gray-700 mt-2">{topComment.content}</p>
                          <Button
                            variant="ghost"
                            className="h-auto p-0 text-sm font-medium text-gray-500 hover:text-gray-700 mt-2 w-fit"
                            onClick={() => {
                              const replyForm = document.getElementById(`reply-form-${topComment.id}`);
                              if (replyForm) {
                                replyForm.classList.toggle('hidden');
                                replyForm.querySelector('textarea')?.focus();
                              }
                            }}
                          >
                            Reply →
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {topComment.replies && topComment.replies.length > 0 && (
                      <div className="mt-4 ml-12 space-y-4">
                        {topComment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={reply.author?.image || ''} alt={`${reply.author?.firstName} ${reply.author?.lastName}`} />
                              <AvatarFallback className="bg-purple-600 text-white">
                                {getInitials(`${reply.author?.firstName} ${reply.author?.lastName}`)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex flex-col">
                                <div className="flex items-center">
                                  <span className="font-medium">{`${reply.author?.firstName} ${reply.author?.lastName}`}</span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    {format(new Date(reply.createdAt), 'dd.MM.yyyy, h:mm a')}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mb-1">
                                  Reply to{' '}
                                  <span className="font-medium">{`${topComment.author?.firstName} ${topComment.author?.lastName}`}</span>
                                </div>
                                <p className="text-gray-700 mt-2">{reply.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply input field for replies to comments */}
                    <div className="mt-4 ml-12 hidden" id={`reply-form-${topComment.id}`}>
                      <textarea
                        placeholder={`Reply to ${topComment.author?.firstName}...`}
                        className="w-full border rounded-md p-3 text-sm"
                        rows={3}
                        value={replyValues[topComment.id || ''] || ''}
                        onChange={(e) => {
                          setReplyValues(prev => ({
                            ...prev,
                            [topComment.id || '']: e.target.value
                          }));
                        }}
                      />
                      <div className="flex items-center justify-end mt-2">
                        <Button 
                          className="bg-black text-white px-4 py-1 rounded h-auto"
                          onClick={() => handleSubmitReply(topComment.id || '')}
                          disabled={submittingComment || !(replyValues[topComment.id || ''] || '').trim()}
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
