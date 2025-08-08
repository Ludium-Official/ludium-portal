import { useCreateCommentMutation } from '@/apollo/mutation/create-comment.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { cn, getInitials, getUserName } from '@/lib/utils';
import type { Comment, CommentableTypeEnum } from '@/types/types.generated';
import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

function CommentableComment({
  comment,
  commentableId,
  refetchComments,
  commentableType,
}: {
  comment: Comment;
  commentableId?: string;
  refetchComments: () => void;
  commentableType: CommentableTypeEnum;
}) {
  const { isAuthed } = useAuth();

  const [showReplies, setShowReplies] = useState(false);
  const [replyValue, setReplyValue] = useState<string>();

  const [createComment, { loading: submittingComment }] = useCreateCommentMutation();

  const handleSubmitReply = async (parentId: string) => {
    // const replyContent = replyValues[parentId || ''];
    if (!replyValue?.trim() || !commentableId) return;

    try {
      await createComment({
        variables: {
          input: {
            content: replyValue,
            commentableId: commentableId,
            commentableType: commentableType,
            parentId,
          },
        },
      });

      // Clear the reply value
      setReplyValue('');

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

  const authorName = getUserName(comment.author);

  return (
    <div key={comment.id} className="border-b last:border-b-0 pb-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={comment.author?.image || ''}
            alt={`${comment.author?.firstName} ${comment.author?.lastName}`}
          />
          <AvatarFallback className="bg-purple-600 text-white">
            {getInitials(`${comment.author?.firstName} ${comment.author?.lastName}`)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="font-medium">
                <Link to={`/users/${comment.author?.id}`}>{authorName}</Link>
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {format(new Date(comment.createdAt), 'MMM d, yyyy, h:mm:ss a')}
              </span>
            </div>
            {comment.parent && (
              <div className="text-xs text-gray-500 mb-1">
                Reply to <span className="font-medium">{getUserName(comment.parent.author)}</span>
              </div>
            )}
            <p className="text-gray-700 mt-2 mb-3 text-sm font-medium">{comment.content}</p>

            <button
              type="button"
              onClick={() => setShowReplies((prev) => !prev)}
              className="text-sm font-medium tracking-wider mb-2 rounded-md text-secondary-foreground flex items-center px-3 py-[10px]"
            >
              Reply <span className="font-bold text-primary ml-1">{comment?.replies?.length}</span>
              <ChevronDown
                className={cn('w-4 h-4 ml-2 transition-transform', showReplies && 'rotate-180')}
              />
            </button>
          </div>
        </div>
      </div>

      {showReplies && (
        <div>
          {/* Reply input field for replies to comments */}
          {isAuthed && (
            <div className="mt-4 ml-14">
              <textarea
                placeholder={`Reply to ${authorName}...`}
                className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white"
                rows={3}
                value={replyValue || ''}
                onChange={(e) => {
                  setReplyValue(e.target.value);
                }}
              />
              <div className="flex items-center justify-end mt-2">
                <Button
                  className="bg-black text-white font-medium text-sm px-4 py-[10px] h-auto rounded-md"
                  onClick={() => handleSubmitReply(comment.id || '')}
                  disabled={submittingComment || !replyValue?.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-12 space-y-4 mb-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={reply.author?.image || ''}
                      alt={`${reply.author?.firstName} ${reply.author?.lastName}`}
                    />
                    <AvatarFallback className="bg-purple-600 text-white">
                      {getInitials(`${reply.author?.firstName} ${reply.author?.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="font-medium">
                          <Link to={`/users/${reply.author?.id}`}>{getUserName(reply.author)}</Link>
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {format(new Date(reply.createdAt), 'MMM d, yyyy, h:mm:ss a')}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Reply to <span className="font-medium">{authorName}</span>
                      </div>
                      <p className="text-gray-700 mt-2 text-sm font-medium">{reply.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CommentableComment;
