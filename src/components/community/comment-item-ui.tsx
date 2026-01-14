import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCommentLineHeight } from '@/lib/hooks/use-comment-line-height';
import { CommentItemUIData } from '@/types/comment';
import { format } from 'date-fns';
import {
  MessageSquareMore,
  MoreHorizontal,
  ThumbsDown,
  ThumbsUp,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react';
import { ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';

export type { CommentItemUIData };

export interface CommentItemUIProps {
  data: CommentItemUIData;
  isAuthor: boolean;

  liked: boolean;
  disliked: boolean;
  likeCount: number;
  dislikeCount: number;
  onLike: () => void;
  onDislike: () => void;

  showReplies: boolean;
  replyCount: number;
  repliesLoading?: boolean;
  onToggleReplies: () => void;

  isEditing?: boolean;
  editContent?: string;
  onEditContentChange?: (value: string) => void;
  onEdit?: () => void;
  onCancelEdit?: () => void;
  updatingComment?: boolean;
  onDelete?: () => void;
  deletingComment?: boolean;
  currentContent?: string | null;
  isDeleted?: boolean;

  replyText?: string;
  onReplyTextChange?: (value: string) => void;
  onPostReply?: () => void;
  onCancelReply?: () => void;
  creatingReply?: boolean;

  childComments?: ReactNode;
  childrenCount?: number;
}

export const CommentItemUI = ({
  data,
  isAuthor,
  liked,
  disliked,
  likeCount,
  dislikeCount,
  onLike,
  onDislike,
  showReplies,
  replyCount,
  repliesLoading,
  onToggleReplies,
  isEditing,
  editContent,
  onEditContentChange,
  onEdit,
  onCancelEdit,
  updatingComment,
  onDelete,
  deletingComment,
  currentContent,
  isDeleted,
  replyText,
  onReplyTextChange,
  onPostReply,
  onCancelReply,
  creatingReply,
  childComments,
  childrenCount = 0,
}: CommentItemUIProps) => {
  const { isLoggedIn, isAuthed } = useAuth();
  const {
    lineHeight,
    commentsRef: childCommentsRef,
    parentContentRef,
  } = useCommentLineHeight({
    showComments: showReplies,
    commentsLength: childrenCount,
  });

  const formattedDate = data.createdAt ? format(new Date(data.createdAt), 'MMMM dd, yyyy') : '';

  const displayContent = currentContent ?? data.content;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={data.authorProfileImage || ''} />
          <AvatarFallback>{data.authorNickname?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-muted-foreground">
          <span className="font-semibold text-sm">{data.authorNickname || 'Anonymous'}</span>
          <span className="text-xs">{formattedDate}</span>
        </div>
      </div>

      <div className="flex gap-0">
        {showReplies && (
          <div className="ml-4 mr-7 flex justify-center">
            <div
              className="w-0.5 bg-slate-200"
              style={lineHeight ? { height: `${lineHeight}px` } : undefined}
            />
          </div>
        )}
        <div className={showReplies ? 'flex-1' : 'ml-12'}>
          <div ref={parentContentRef}>
            {isDeleted ? (
              <p className="mb-4 text-muted-foreground italic text-base">
                This message has been deleted
              </p>
            ) : isEditing ? (
              <div className="flex flex-col gap-2 mb-4">
                <Textarea
                  value={editContent}
                  onChange={(e) => onEditContentChange?.(e.target.value)}
                  className="h-[80px] resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="outline" onClick={onCancelEdit}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={!editContent?.trim() || updatingComment}
                    onClick={onEdit}
                  >
                    {updatingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-base mb-4 whitespace-pre-wrap break-all">{displayContent}</p>
            )}

            <div className="flex items-center gap-3 mb-6">
              {isLoggedIn && !isDeleted && (
                <>
                  <Button
                    variant="outline"
                    onClick={onLike}
                    className={`border-0 p-0! h-auto flex items-center gap-1 ${
                      liked ? 'text-primary' : 'text-slate-700'
                    } hover:text-foreground`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onDislike}
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
                onClick={onToggleReplies}
                className="border-0 p-0! h-auto flex items-center gap-1 text-xs text-slate-700 hover:text-foreground"
              >
                {repliesLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MessageSquareMore className="w-4 h-4" />
                )}
                {replyCount > 0 && <span>{replyCount}</span>}
              </Button>
              {isAuthed && isAuthor && !isDeleted && onEdit && onDelete && (
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
                        onEditContentChange?.(displayContent ?? '');
                        onCancelEdit?.();
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-destructive focus:text-destructive"
                      disabled={deletingComment}
                    >
                      {deletingComment ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {isAuthed && isAuthor && !isDeleted && !onEdit && (
                <Button
                  variant="outline"
                  className="border-0 p-0! h-auto text-slate-700 hover:text-foreground"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {showReplies && (
            <>
              {isLoggedIn && !isDeleted && onPostReply && (
                <div className="flex flex-col items-end gap-2 mb-6 mt-4">
                  {isAuthed ? (
                    <Textarea
                      value={replyText}
                      onChange={(e) => onReplyTextChange?.(e.target.value)}
                      placeholder="Write a comment..."
                      className="h-[40px] min-h-[40px] resize-none"
                    />
                  ) : (
                    <div className="w-full border border-gray-300 rounded-md p-2 h-[40px] min-h-[40px] text-sm text-muted-foreground">
                      Check your email and nickname
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={onCancelReply}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!replyText?.trim() || creatingReply}
                      onClick={onPostReply}
                    >
                      {creatingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
                    </Button>
                  </div>
                </div>
              )}

              {childComments && (
                <div ref={childCommentsRef} className="space-y-6">
                  {childComments}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
