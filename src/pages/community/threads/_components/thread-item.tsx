import { useThreadCommentsLazyQuery } from '@/apollo/queries/thread-comments.generated';
import { useToggleThreadReactionMutation } from '@/apollo/mutation/toggle-thread-reaction.generated';
import { useCreateThreadCommentMutation } from '@/apollo/mutation/create-thread-comment.generated';
import { useUpdateThreadMutation } from '@/apollo/mutation/update-thread.generated';
import { useDeleteThreadMutation } from '@/apollo/mutation/delete-thread.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/hooks/use-auth';
import { useCommentLineHeight } from '@/lib/hooks/use-comment-line-height';
import { Thread, ThreadReaction } from '@/types/types.generated';
import { ThreadCommentData } from '@/types/comment';
import { format } from 'date-fns';
import {
  Loader2,
  MessageSquareMore,
  MoreHorizontal,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import ThreadCommentItem from './thread-comment-item';
import { MarkdownPreviewer } from '@/components/markdown';
import { MarkdownEditor } from '@/components/markdown';

interface ThreadItemProps {
  thread: Thread;
  onThreadUpdated?: () => void;
}

const ThreadItem = ({ thread, onThreadUpdated }: ThreadItemProps) => {
  const { isAuthed, nickname, profileImage } = useAuth();

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<ThreadCommentData[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(thread.isLiked ?? false);
  const [disliked, setDisliked] = useState(thread.isDisliked ?? false);
  const [likeCount, setLikeCount] = useState(thread.likeCount ?? 0);
  const [dislikeCount, setDislikeCount] = useState(thread.dislikeCount ?? 0);
  const [replyCount, setReplyCount] = useState(thread.replyCount ?? 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(thread.content ?? '');
  const [currentContent, setCurrentContent] = useState(thread.content);
  const [currentAuthorNickname] = useState(thread.authorNickname);
  const [currentAuthorProfileImage] = useState(thread.authorProfileImage);
  const [isDeleted, setIsDeleted] = useState(false);

  const { lineHeight, commentsRef, parentContentRef } = useCommentLineHeight({
    showComments,
    commentsLength: comments.length,
  });

  const [fetchComments, { loading: commentsLoading }] = useThreadCommentsLazyQuery();
  const [toggleReaction] = useToggleThreadReactionMutation();
  const [createComment, { loading: creatingComment }] = useCreateThreadCommentMutation();
  const [updateThread, { loading: updatingThread }] = useUpdateThreadMutation();
  const [deleteThread, { loading: deletingThread }] = useDeleteThreadMutation();

  const isAuthor = nickname === currentAuthorNickname;

  const handleToggleComments = async () => {
    if (!showComments && !commentsLoaded && thread.id) {
      const { data } = await fetchComments({
        variables: { threadId: thread.id },
      });
      if (data?.threadComments) {
        setComments(data.threadComments as ThreadCommentData[]);
        setCommentsLoaded(true);
      }
    }
    setShowComments(!showComments);
  };

  const handleLike = async () => {
    if (!isAuthed || !thread.id) return;

    try {
      const { data } = await toggleReaction({
        variables: {
          input: {
            threadId: thread.id,
            reaction: ThreadReaction.Like,
          },
        },
      });
      if (data?.toggleThreadReaction) {
        setLiked(data.toggleThreadReaction.isLiked ?? false);
        setDisliked(data.toggleThreadReaction.isDisliked ?? false);
        setLikeCount(data.toggleThreadReaction.likeCount ?? 0);
        setDislikeCount(data.toggleThreadReaction.dislikeCount ?? 0);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDislike = async () => {
    if (!isAuthed || !thread.id) return;

    try {
      const { data } = await toggleReaction({
        variables: {
          input: {
            threadId: thread.id,
            reaction: ThreadReaction.Dislike,
          },
        },
      });
      if (data?.toggleThreadReaction) {
        setLiked(data.toggleThreadReaction.isLiked ?? false);
        setDisliked(data.toggleThreadReaction.isDisliked ?? false);
        setLikeCount(data.toggleThreadReaction.likeCount ?? 0);
        setDislikeCount(data.toggleThreadReaction.dislikeCount ?? 0);
      }
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim() || !thread.id) return;

    try {
      const { data } = await createComment({
        variables: {
          input: {
            threadId: thread.id,
            content: commentText,
          },
        },
      });
      setCommentText('');
      setReplyCount((prev) => prev + 1);

      if (data?.createThreadComment) {
        const newComment: ThreadCommentData = {
          ...data.createThreadComment,
          authorNickname: data.createThreadComment.authorNickname || nickname,
          authorProfileImage: data.createThreadComment.authorProfileImage || profileImage,
        };
        setComments((prev) => [newComment, ...prev]);
      }
      onThreadUpdated?.();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim() || !thread.id) return;

    try {
      const { data } = await updateThread({
        variables: {
          id: thread.id,
          input: {
            content: editContent,
          },
        },
      });
      if (data?.updateThread) {
        setCurrentContent(data.updateThread.content);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating thread:', error);
    }
  };

  const handleDelete = async () => {
    if (!thread.id) return;

    try {
      await deleteThread({
        variables: {
          id: thread.id,
        },
      });
      setIsDeleted(true);
      onThreadUpdated?.();
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  const formattedDate = thread.createdAt ? format(new Date(thread.createdAt), 'MMMM dd, yyyy') : '';

  return (
    <div className="border-b pt-14 pb-10 px-8">
      <div className="flex items-center gap-2 mb-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={currentAuthorProfileImage || ''} />
          <AvatarFallback>{currentAuthorNickname?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-muted-foreground">
          <span className="font-semibold text-sm">{currentAuthorNickname || 'Anonymous'}</span>
          <span className="text-xs">{formattedDate}</span>
        </div>
      </div>

      <div className="flex gap-0">
        {showComments && (
          <div className="ml-4 mr-7 flex justify-center">
            <div
              className="w-0.5 bg-slate-200"
              style={lineHeight ? { height: `${lineHeight}px` } : undefined}
            />
          </div>
        )}
        <div className={showComments ? 'flex-1' : 'ml-12'}>
          <div ref={parentContentRef}>
            {isDeleted ? (
              <p className="mb-4 text-muted-foreground italic text-base">
                This thread has been deleted
              </p>
            ) : isEditing ? (
              <div className="flex flex-col gap-2 mb-4">
                <MarkdownEditor content={editContent} onChange={setEditContent} />
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(currentContent ?? '');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={!editContent.trim() || updatingThread}
                    onClick={handleEdit}
                  >
                    {updatingThread ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                  </Button>
                </div>
              </div>
            ) : (
              <MarkdownPreviewer value={currentContent ?? ''} className="mb-4!" />
            )}

            <div className="flex items-center gap-3 mb-6">
              {isAuthed && !isDeleted && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleLike}
                    className={`border-0 p-0! h-auto flex items-center gap-1 ${
                      liked ? 'text-primary' : 'text-slate-700'
                    } hover:text-foreground`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDislike}
                    className={`border-0 p-0! h-auto flex items-center gap-1 ${
                      disliked ? 'text-primary' : 'text-slate-700'
                    } hover:text-foreground`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    {dislikeCount > 0 && <span className="text-xs">{dislikeCount}</span>}
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={handleToggleComments}
                className="border-0 p-0! h-auto flex items-center gap-1 text-xs text-slate-700 hover:text-foreground"
              >
                {commentsLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MessageSquareMore className="w-4 h-4" />
                )}
                {replyCount > 0 && <span>{replyCount}</span>}
              </Button>
              {isAuthed && isAuthor && !isDeleted && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-0 p-0! h-auto text-slate-700 hover:text-foreground"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => {
                        setIsEditing(true);
                        setEditContent(currentContent ?? '');
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                      disabled={deletingThread}
                    >
                      {deletingThread ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {showComments && (
            <>
              {isAuthed && (
                <div className="flex flex-col items-end gap-2 mb-6">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="h-[40px] min-h-[40px] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowComments(false);
                        setCommentText('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePostComment}
                      disabled={!commentText.trim() || creatingComment}
                    >
                      {creatingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
                    </Button>
                  </div>
                </div>
              )}

              {commentsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : (
                <div ref={commentsRef} className="space-y-6">
                  {comments.map((comment) => (
                    <ThreadCommentItem
                      key={comment.id}
                      comment={comment}
                      threadId={thread.id!}
                      onCommentAdded={onThreadUpdated}
                    />
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

export default ThreadItem;
