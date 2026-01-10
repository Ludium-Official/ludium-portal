import { useArticleChildCommentsLazyQuery } from "@/apollo/queries/article-child-comments.generated";
import { useToggleArticleCommentReactionMutation } from "@/apollo/mutation/toggle-article-comment-reaction.generated";
import { useCreateArticleCommentMutation } from "@/apollo/mutation/create-article-comment.generated";
import { useUpdateArticleCommentMutation } from "@/apollo/mutation/update-article-comment.generated";
import { useDeleteArticleCommentMutation } from "@/apollo/mutation/delete-article-comment.generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/hooks/use-auth";
import { ArticleCommentData } from "@/types/comment";
import { ArticleCommentReaction } from "@/types/types.generated";
import { format } from "date-fns";
import {
  MessageSquareMore,
  MoreHorizontal,
  ThumbsDown,
  ThumbsUp,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface CommentItemProps {
  comment: ArticleCommentData;
  onCommentAdded?: () => void;
}

export const CommentItem = ({ comment, onCommentAdded }: CommentItemProps) => {
  const { isAuthed, userId } = useAuth();

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [liked, setLiked] = useState(comment.isLiked ?? false);
  const [disliked, setDisliked] = useState(comment.isDisliked ?? false);
  const [likeCount, setLikeCount] = useState(comment.likeCount ?? 0);
  const [childComments, setChildComments] = useState<ArticleCommentData[]>(
    comment.replies ?? []
  );
  const [childCommentsLoaded, setChildCommentsLoaded] = useState(
    !!comment.replies?.length
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content ?? "");
  const [currentContent, setCurrentContent] = useState(comment.content);
  const [isDeleted, setIsDeleted] = useState(!comment.content);

  const [fetchChildComments, { loading: childCommentsLoading }] =
    useArticleChildCommentsLazyQuery();
  const [toggleReaction] = useToggleArticleCommentReactionMutation();
  const [createComment, { loading: creatingComment }] =
    useCreateArticleCommentMutation();
  const [updateComment, { loading: updatingComment }] =
    useUpdateArticleCommentMutation();
  const [deleteComment, { loading: deletingComment }] =
    useDeleteArticleCommentMutation();

  const isAuthor = userId === String(comment.authorId);

  const handleToggleReplies = async () => {
    if (!showReplyInput && !childCommentsLoaded && comment.id) {
      const { data } = await fetchChildComments({
        variables: { parentId: comment.id },
      });
      if (data?.articleChildComments) {
        setChildComments(data.articleChildComments as ArticleCommentData[]);
        setChildCommentsLoaded(true);
      }
    }
    setShowReplyInput(!showReplyInput);
  };

  const handleLike = async () => {
    if (!isAuthed || !comment.id) return;

    try {
      const { data } = await toggleReaction({
        variables: {
          input: {
            commentId: comment.id,
            reaction: ArticleCommentReaction.Like,
          },
        },
      });
      if (data?.toggleArticleCommentReaction) {
        setLiked(data.toggleArticleCommentReaction.isLiked ?? false);
        setDisliked(data.toggleArticleCommentReaction.isDisliked ?? false);
        setLikeCount(data.toggleArticleCommentReaction.likeCount ?? 0);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDislike = async () => {
    if (!isAuthed || !comment.id) return;

    try {
      const { data } = await toggleReaction({
        variables: {
          input: {
            commentId: comment.id,
            reaction: ArticleCommentReaction.Dislike,
          },
        },
      });
      if (data?.toggleArticleCommentReaction) {
        setLiked(data.toggleArticleCommentReaction.isLiked ?? false);
        setDisliked(data.toggleArticleCommentReaction.isDisliked ?? false);
        setLikeCount(data.toggleArticleCommentReaction.likeCount ?? 0);
      }
    } catch (error) {
      console.error("Error toggling dislike:", error);
    }
  };

  const handlePostReply = async () => {
    if (!replyText.trim() || !comment.articleId || !comment.id) return;

    try {
      await createComment({
        variables: {
          input: {
            articleId: comment.articleId,
            content: replyText,
            parentId: comment.id,
          },
        },
      });
      setReplyText("");
      const { data: childData } = await fetchChildComments({
        variables: { parentId: comment.id },
        fetchPolicy: "network-only",
      });
      if (childData?.articleChildComments) {
        setChildComments(
          childData.articleChildComments as ArticleCommentData[]
        );
      }
      onCommentAdded?.();
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim() || !comment.id) return;

    try {
      const { data } = await updateComment({
        variables: {
          input: {
            commentId: comment.id,
            content: editContent,
          },
        },
      });
      if (data?.updateArticleComment) {
        setCurrentContent(data.updateArticleComment.content);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDelete = async () => {
    if (!comment.id) return;

    try {
      await deleteComment({
        variables: {
          input: {
            commentId: comment.id,
          },
        },
      });
      setIsDeleted(true);
      setCurrentContent(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const childCommentsRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState<number | null>(null);

  const calculateLineHeight = () => {
    if (
      showReplyInput &&
      childCommentsRef.current &&
      childComments.length > 0
    ) {
      const children = childCommentsRef.current.children;
      if (children.length > 1) {
        const secondToLastChild = children[children.length - 2] as HTMLElement;
        const containerTop = childCommentsRef.current.offsetTop;
        const secondToLastChildTop = secondToLastChild.offsetTop;
        setLineHeight(
          secondToLastChildTop -
            containerTop +
            secondToLastChild.offsetHeight +
            270
        );
      } else if (children.length === 1) {
        setLineHeight(270);
      }
    } else {
      setLineHeight(null);
    }
  };

  useEffect(() => {
    calculateLineHeight();
  }, [showReplyInput, childComments]);

  useEffect(() => {
    if (!childCommentsRef.current || !showReplyInput) return;

    const resizeObserver = new ResizeObserver(() => {
      calculateLineHeight();
    });

    resizeObserver.observe(childCommentsRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [showReplyInput, childComments.length]);

  const displayReplyCount =
    childComments.length > 0 ? childComments.length : comment.replyCount ?? 0;
  const formattedDate = comment.createdAt
    ? format(new Date(comment.createdAt), "MMMM dd, yyyy")
    : "";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={comment.authorProfileImage || ""} />
          <AvatarFallback>
            {comment.authorNickname?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-muted-foreground">
          <span className="font-semibold text-sm">
            {comment.authorNickname || "Anonymous"}
          </span>
          <span className="text-xs">{formattedDate}</span>
        </div>
      </div>

      <div className="flex gap-0">
        {showReplyInput && (
          <div className="ml-5 mr-7 flex justify-center">
            <div
              className="w-0.5 bg-slate-200"
              style={lineHeight ? { height: `${lineHeight}px` } : undefined}
            />
          </div>
        )}
        <div className={showReplyInput ? "flex-1" : "ml-12"}>
          {isDeleted ? (
            <p className="text-sm mb-4 text-muted-foreground italic">
              This message has been deleted
            </p>
          ) : isEditing ? (
            <div className="flex flex-col gap-2 mb-4">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="h-[80px] resize-none"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(currentContent ?? "");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={!editContent.trim() || updatingComment}
                  onClick={handleEdit}
                >
                  {updatingComment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm mb-4">{currentContent}</p>
          )}
          <div className="flex items-center gap-3 mb-6">
            {isAuthed && !isDeleted && (
              <>
                <Button
                  variant="outline"
                  onClick={handleLike}
                  className={`border-0 p-0! h-auto flex items-center gap-1 ${
                    liked ? "text-primary" : "text-slate-700"
                  } hover:text-foreground`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  {likeCount > 0 && (
                    <span className="text-xs">{likeCount}</span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDislike}
                  className={`border-0 p-0! h-auto flex items-center gap-1 ${
                    disliked ? "text-primary" : "text-slate-700"
                  } hover:text-foreground`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={handleToggleReplies}
              className="border-0 p-0! h-auto flex items-center gap-1 text-xs text-slate-700 hover:text-foreground"
            >
              {childCommentsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MessageSquareMore className="w-4 h-4" />
              )}
              {displayReplyCount > 0 && <span>{displayReplyCount}</span>}
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
                      setEditContent(currentContent ?? "");
                    }}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
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
          </div>

          {showReplyInput && (
            <>
              {isAuthed && (
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
                        setReplyText("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!replyText.trim() || creatingComment}
                      onClick={handlePostReply}
                    >
                      {creatingComment ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Post"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {childComments.length > 0 && (
                <div ref={childCommentsRef} className="space-y-6">
                  {childComments.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      onCommentAdded={onCommentAdded}
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
