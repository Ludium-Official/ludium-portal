import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/hooks/use-auth';
import type { Comment } from '@/types/comment';
import { MessageSquareMore, MoreHorizontal, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const { isAuthed } = useAuth();

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const replyCount = comment.replies && comment.replies.length > 0 ? comment.replies.length : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-muted-foreground">
          <span className="font-semibold text-sm">{comment.author.name}</span>
          <span className="text-xs">{comment.date}</span>
        </div>
      </div>

      <div className="flex gap-0">
        {showReplyInput && (
          <div className="ml-5 mr-7 flex justify-center">
            <div className="w-0.5 bg-slate-200" />
          </div>
        )}
        <div className={showReplyInput ? 'flex-1' : 'ml-12'}>
          <p className="text-sm mb-4">{comment.content}</p>
          <div className="flex items-center gap-3 mb-6">
            {isAuthed && (
              <>
                <button
                  type="button"
                  onClick={handleLike}
                  className={`p-0 h-auto ${
                    liked ? 'text-primary' : 'text-muted-foreground'
                  } hover:text-foreground`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDislike}
                  className={`p-0 h-auto ${
                    disliked ? 'text-primary' : 'text-muted-foreground'
                  } hover:text-foreground`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="p-0 h-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <MessageSquareMore className="w-4 h-4" />
              {replyCount > 0 && <span>{replyCount}</span>}
            </button>
            <button
              type="button"
              className="p-0 h-auto text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {showReplyInput && (
            <>
              <div className="flex flex-col items-end gap-2 mb-6 mt-4">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a comment..."
                  className="h-[80px] resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowReplyInput(false);
                      setReplyText('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" variant="outline" disabled={!replyText.trim()}>
                    Post
                  </Button>
                </div>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-6">
                  {comment.replies.map((reply) => (
                    <CommentItem key={reply.id} comment={reply} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
