import { useToggleThreadCommentReactionMutation } from '@/apollo/mutation/toggle-thread-comment-reaction.generated';
import { useCreateThreadCommentMutation } from '@/apollo/mutation/create-thread-comment.generated';
import { useUpdateThreadCommentMutation } from '@/apollo/mutation/update-thread-comment.generated';
import { useDeleteThreadCommentMutation } from '@/apollo/mutation/delete-thread-comment.generated';
import { useThreadChildCommentsLazyQuery } from '@/apollo/queries/thread-child-comments.generated';
import { useAuth } from '@/lib/hooks/use-auth';
import { ThreadCommentReaction } from '@/types/types.generated';
import { useState } from 'react';
import { CommentItemUI } from '@/components/community/comment-item-ui';

interface ThreadCommentData {
  id?: string | null;
  threadId?: string | null;
  authorId?: number | null;
  authorNickname?: string | null;
  authorProfileImage?: string | null;
  content?: string | null;
  parentId?: string | null;
  likeCount?: number | null;
  dislikeCount?: number | null;
  replyCount?: number | null;
  isLiked?: boolean | null;
  isDisliked?: boolean | null;
  createdAt?: string | null;
  deletedAt?: string | null;
}

interface ThreadCommentItemProps {
  comment: ThreadCommentData;
  threadId: string;
  onCommentAdded?: () => void;
}

const ThreadCommentItem = ({ comment, threadId, onCommentAdded }: ThreadCommentItemProps) => {
  const { isAuthed, userId, nickname, profileImage } = useAuth();

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [liked, setLiked] = useState(comment.isLiked ?? false);
  const [disliked, setDisliked] = useState(comment.isDisliked ?? false);
  const [likeCount, setLikeCount] = useState(comment.likeCount ?? 0);
  const [dislikeCount, setDislikeCount] = useState(comment.dislikeCount ?? 0);
  const [childComments, setChildComments] = useState<ThreadCommentData[]>([]);
  const [childCommentsLoaded, setChildCommentsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content ?? '');
  const [currentContent, setCurrentContent] = useState(comment.content);
  const [isDeleted, setIsDeleted] = useState(!!comment.deletedAt || !comment.content);

  const [fetchChildComments, { loading: childCommentsLoading }] = useThreadChildCommentsLazyQuery();
  const [toggleReaction] = useToggleThreadCommentReactionMutation();
  const [createComment, { loading: creatingComment }] = useCreateThreadCommentMutation();
  const [updateComment, { loading: updatingComment }] = useUpdateThreadCommentMutation();
  const [deleteComment, { loading: deletingComment }] = useDeleteThreadCommentMutation();

  const isAuthor = userId === String(comment.authorId);

  const handleToggleReplies = async () => {
    if (!showReplyInput && !childCommentsLoaded && comment.id) {
      const { data } = await fetchChildComments({
        variables: { parentId: comment.id },
      });
      if (data?.threadChildComments) {
        setChildComments(data.threadChildComments as ThreadCommentData[]);
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
            reaction: ThreadCommentReaction.Like,
          },
        },
      });
      if (data?.toggleThreadCommentReaction) {
        setLiked(data.toggleThreadCommentReaction.isLiked ?? false);
        setDisliked(data.toggleThreadCommentReaction.isDisliked ?? false);
        setLikeCount(data.toggleThreadCommentReaction.likeCount ?? 0);
        setDislikeCount(data.toggleThreadCommentReaction.dislikeCount ?? 0);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDislike = async () => {
    if (!isAuthed || !comment.id) return;

    try {
      const { data } = await toggleReaction({
        variables: {
          input: {
            commentId: comment.id,
            reaction: ThreadCommentReaction.Dislike,
          },
        },
      });
      if (data?.toggleThreadCommentReaction) {
        setLiked(data.toggleThreadCommentReaction.isLiked ?? false);
        setDisliked(data.toggleThreadCommentReaction.isDisliked ?? false);
        setLikeCount(data.toggleThreadCommentReaction.likeCount ?? 0);
        setDislikeCount(data.toggleThreadCommentReaction.dislikeCount ?? 0);
      }
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  const handlePostReply = async () => {
    if (!replyText.trim() || !comment.id) return;

    try {
      const { data } = await createComment({
        variables: {
          input: {
            threadId: threadId,
            content: replyText,
            parentId: comment.id,
          },
        },
      });
      setReplyText('');

      // Add new reply to the top of the list with user info
      if (data?.createThreadComment) {
        const newReply: ThreadCommentData = {
          ...data.createThreadComment,
          authorNickname: data.createThreadComment.authorNickname || nickname,
          authorProfileImage: data.createThreadComment.authorProfileImage || profileImage,
        };
        setChildComments((prev) => [newReply, ...prev]);
      }
      onCommentAdded?.();
    } catch (error) {
      console.error('Error posting reply:', error);
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
      if (data?.updateThreadComment) {
        setCurrentContent(data.updateThreadComment.content);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
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
      console.error('Error deleting comment:', error);
    }
  };

  const displayReplyCount =
    childComments.length > 0 ? childComments.length : (comment.replyCount ?? 0);

  return (
    <CommentItemUI
      data={{
        id: comment.id,
        authorNickname: comment.authorNickname,
        authorProfileImage: comment.authorProfileImage,
        content: comment.content,
        likeCount: comment.likeCount,
        dislikeCount: comment.dislikeCount,
        replyCount: comment.replyCount,
        isLiked: comment.isLiked,
        isDisliked: comment.isDisliked,
        createdAt: comment.createdAt,
      }}
      isAuthed={isAuthed ?? false}
      isAuthor={isAuthor}
      liked={liked}
      disliked={disliked}
      likeCount={likeCount}
      dislikeCount={dislikeCount}
      onLike={handleLike}
      onDislike={handleDislike}
      showReplies={showReplyInput}
      replyCount={displayReplyCount}
      repliesLoading={childCommentsLoading}
      onToggleReplies={handleToggleReplies}
      isEditing={isEditing}
      editContent={editContent}
      onEditContentChange={setEditContent}
      onEdit={handleEdit}
      onCancelEdit={() => {
        if (isEditing) {
          setIsEditing(false);
          setEditContent(currentContent ?? '');
        } else {
          setIsEditing(true);
          setEditContent(currentContent ?? '');
        }
      }}
      updatingComment={updatingComment}
      onDelete={handleDelete}
      deletingComment={deletingComment}
      currentContent={currentContent}
      isDeleted={isDeleted}
      replyText={replyText}
      onReplyTextChange={setReplyText}
      onPostReply={handlePostReply}
      onCancelReply={() => {
        setShowReplyInput(false);
        setReplyText('');
      }}
      creatingReply={creatingComment}
      childComments={
        childComments.length > 0
          ? childComments.map((reply) => (
              <ThreadCommentItem
                key={reply.id}
                comment={reply}
                threadId={threadId}
                onCommentAdded={onCommentAdded}
              />
            ))
          : undefined
      }
    />
  );
};

export default ThreadCommentItem;
