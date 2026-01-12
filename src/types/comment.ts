export interface ArticleCommentData {
  id?: string | null;
  articleId?: string | null;
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
  replies?: ArticleCommentData[] | null;
}

export interface ThreadCommentData {
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

// Common UI data interface for CommentItemUI
export interface CommentItemUIData {
  id?: string | null;
  authorNickname?: string | null;
  authorProfileImage?: string | null;
  content?: string | null;
  likeCount?: number | null;
  dislikeCount?: number | null;
  replyCount?: number | null;
  isLiked?: boolean | null;
  isDisliked?: boolean | null;
  createdAt?: string | null;
  isDeleted?: boolean;
}
