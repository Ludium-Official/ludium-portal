import { useCreateCommentMutation } from '@/apollo/mutation/create-comment.generated';
import { useCommentsByCommentableQuery } from '@/apollo/queries/comments-by-commentable.generated';
import CommentableComment from '@/components/comments/comment';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CommentableTypeEnum } from '@/types/types.generated';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface CommentSectionProps {
  commentableId: string;
  commentableType: CommentableTypeEnum;
  // comments?: Comment[];
  isLoggedIn: boolean;
  // refetchComments: () => void;
  rightSide?: React.ReactNode;
}

export const CommentSection = ({
  commentableId,
  commentableType,
  // comments = [],
  isLoggedIn,
  // refetchComments,
  rightSide,
}: CommentSectionProps) => {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const { data: commentsData, refetch: refetchComments } = useCommentsByCommentableQuery({
    variables: {
      commentableId: commentableId ?? '',
      commentableType: commentableType,
    },
    skip: !commentableId,
    fetchPolicy: 'cache-and-network',
  });

  const comments = commentsData?.commentsByCommentable ?? [];

  const [createComment] = useCreateCommentMutation();

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    try {
      setSubmitting(true);
      await createComment({
        variables: {
          input: {
            content: comment,
            commentableId: commentableId,
            commentableType: commentableType,
          },
        },
      });
      setComment('');
      refetchComments();
    } catch (e) {
      console.error('Failed to submit comment', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <button
          type="button"
          onClick={() => setCommentsOpen((prev) => !prev)}
          className={cn(
            'text-sm font-medium tracking-wider rounded-md text-secondary-foreground flex items-center px-4 py-[10px]',
            commentsOpen && 'bg-gray-light',
          )}
        >
          Comment <span className="font-bold text-primary ml-1">{comments.length}</span>
          <ChevronDown
            className={cn('w-4 h-4 ml-2 transition-transform', commentsOpen && 'rotate-180')}
          />
        </button>
        {rightSide}
      </div>

      {commentsOpen && (
        <div className="bg-gray-light rounded-md">
          {isLoggedIn && (
            <div className="mb-4 p-4 border-b">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white"
                rows={5}
                placeholder="Leave your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <Button
                  className="bg-black text-white font-medium text-sm px-4 py-[10px] h-auto rounded-md"
                  onClick={handleSubmit}
                  disabled={submitting || !comment.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          )}
          <div className="space-y-6 p-4">
            {comments
              .filter((comment) => !comment.parent)
              .map((topComment) => (
                <CommentableComment
                  key={topComment.id}
                  comment={topComment}
                  commentableId={commentableId}
                  refetchComments={refetchComments}
                  commentableType={commentableType}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
