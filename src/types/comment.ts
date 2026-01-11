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
  replies?: ArticleCommentData[] | null;
}
