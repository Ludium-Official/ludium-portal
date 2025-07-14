import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import PostComment from '@/pages/community/details/_components/comment';
import type { Comment } from '@/types/types.generated';
import type { FetchResult } from '@apollo/client';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface CommentSectionProps<T> {
  postId: string;
  comments?: Comment[];
  isLoggedIn: boolean;
  onSubmitComment: (comment: string) => Promise<FetchResult<T>>;
  refetchComments: () => void;
}

export const CommentSection = <T,>({
  postId,
  comments = [],
  isLoggedIn,
  onSubmitComment,
  refetchComments,
}: CommentSectionProps<T>) => {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    try {
      setSubmitting(true);
      await onSubmitComment(comment);
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
      <button
        type="button"
        onClick={() => setCommentsOpen((prev) => !prev)}
        className={cn(
          'text-sm font-medium tracking-wider mb-2 rounded-md text-secondary-foreground flex items-center px-4 py-[10px]',
          commentsOpen && 'bg-gray-light',
        )}
      >
        Comment <span className="font-bold text-primary ml-1">{comments.length}</span>
        <ChevronDown
          className={cn('w-4 h-4 ml-2 transition-transform', commentsOpen && 'rotate-180')}
        />
      </button>

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
                <PostComment
                  key={topComment.id}
                  comment={topComment}
                  postId={postId}
                  refetchComments={refetchComments}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
