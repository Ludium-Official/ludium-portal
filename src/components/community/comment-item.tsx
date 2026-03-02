import { useCreateArticleCommentMutation } from '@/apollo/mutation/create-article-comment.generated';
import { useDeleteArticleCommentMutation } from '@/apollo/mutation/delete-article-comment.generated';
import { useToggleArticleCommentReactionMutation } from '@/apollo/mutation/toggle-article-comment-reaction.generated';
import { useUpdateArticleCommentMutation } from '@/apollo/mutation/update-article-comment.generated';
import { useArticleChildCommentsLazyQuery } from '@/apollo/queries/article-child-comments.generated';
import { useAuth } from '@/lib/hooks/use-auth';
import type { ArticleCommentData } from '@/types/comment';
import { ArticleCommentReaction } from '@/types/types.generated';
import { useState } from 'react';
import { CommentItemUI } from './comment-item-ui';

interface CommentItemProps {
  comment: ArticleCommentData;
  onCommentAdded?: () => void;
}

export const CommentItem = ({ comment, onCommentAdded }: CommentItemProps) => {
  const { isAuthed, userId, nickname, profileImage } = useAuth();

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [liked, setLiked] = useState(comment.isLiked ?? false);
  const [disliked, setDisliked] = useState(comment.isDisliked ?? false);
  const [likeCount, setLikeCount] = useState(comment.likeCount ?? 0);
  const [childComments, setChildComments] = useState<ArticleCommentData[]>(comment.replies ?? []);
  const [childCommentsLoaded, setChildCommentsLoaded] = useState(!!comment.replies?.length);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content ?? '');
  const [currentContent, setCurrentContent] = useState(comment.content);
  const [isDeleted, setIsDeleted] = useState(!comment.content);

  const [fetchChildComments, { loading: childCommentsLoading }] =
    useArticleChildCommentsLazyQuery();
  const [toggleReaction] = useToggleArticleCommentReactionMutation();
  const [createComment, { loading: creatingComment }] = useCreateArticleCommentMutation();
  const [updateComment, { loading: updatingComment }] = useUpdateArticleCommentMutation();
  const [deleteComment, { loading: deletingComment }] = useDeleteArticleCommentMutation();

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
      console.error('Error toggling dislike:', error);
    }
  };

  const handlePostReply = async () => {
    if (!replyText.trim() || !comment.articleId || !comment.id) return;

    try {
      const { data } = await createComment({
        variables: {
          input: {
            articleId: comment.articleId,
            content: replyText,
            parentId: comment.id,
          },
        },
      });
      setReplyText('');

      if (data?.createArticleComment) {
        const newReply: ArticleCommentData = {
          ...data.createArticleComment,
          articleId: comment.articleId,
          authorNickname: data.createArticleComment.authorNickname || nickname,
          authorProfileImage: data.createArticleComment.authorProfileImage || profileImage,
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
      if (data?.updateArticleComment) {
        setCurrentContent(data.updateArticleComment.content);
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
      isAuthor={isAuthor}
      liked={liked}
      disliked={disliked}
      likeCount={likeCount}
      dislikeCount={0}
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
              <CommentItem key={reply.id} comment={reply} onCommentAdded={onCommentAdded} />
            ))
          : undefined
      }
      childrenCount={childComments.length}
    />
  );
};
