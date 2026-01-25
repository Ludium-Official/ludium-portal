import { useArticleQuery } from '@/apollo/queries/article.generated';
import { useArticleCommentsQuery } from '@/apollo/queries/article-comments.generated';
import { useToggleArticleLikeMutation } from '@/apollo/mutation/toggle-article-like.generated';
import { useCreateArticleCommentMutation } from '@/apollo/mutation/create-article-comment.generated';
import { CommentItem } from '@/components/community/comment-item';
import Container from '@/components/layout/container';
import { ArticleCommentData } from '@/types/comment';
import MarkdownPreviewer from '@/components/markdown/markdown-previewer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ShareButton } from '@/components/ui/share-button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/hooks/use-auth';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  EllipsisVertical,
  Eye,
  Heart,
  Loader2,
  MessageCircleMore,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import RecommendedArticles from '../_components/recommended-articles';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/lib/hooks/use-mobile';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthed, isAdmin, userId } = useAuth();
  const isMobile = useIsMobile();

  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(true);

  const {
    data: articleData,
    loading: articleLoading,
    refetch: refetchArticle,
  } = useArticleQuery({
    variables: { id: id! },
    skip: !id,
  });

  const {
    data: commentsData,
    loading: commentsLoading,
    refetch: refetchComments,
  } = useArticleCommentsQuery({
    variables: { articleId: id! },
    skip: !id,
  });

  const [toggleLike] = useToggleArticleLikeMutation();
  const [createComment, { loading: creatingComment }] = useCreateArticleCommentMutation();

  const article = articleData?.article;
  const comments = (commentsData?.articleComments ?? []) as ArticleCommentData[];

  const handleToggleLike = async () => {
    if (!isAuthed || !id) return;

    try {
      await toggleLike({
        variables: { articleId: id },
      });
      await refetchArticle();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handlePostComment = async () => {
    if (!comment.trim() || !id) return;

    try {
      await createComment({
        variables: {
          input: {
            articleId: id,
            content: comment,
          },
        },
      });

      setComment('');

      refetchComments();
      refetchArticle();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (articleLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Article not found</p>
      </div>
    );
  }

  const formattedDate = article.createdAt
    ? format(new Date(article.createdAt), 'MMMM dd, yyyy')
    : '';

  return (
    <>
      <div className="bg-white min-h-screen">
        <Container
          size="narrow"
          className={cn('max-w-[936px] pt-23 pb-25', isMobile && 'pt-7 pb-19')}
        >
          <div className="mb-6">
            <h1 className={cn('text-3xl font-bold mb-6', isMobile && 'mb-[18px]')}>
              {article.title}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={article.author?.profileImage || ''} />
                  <AvatarFallback>{article.author?.nickname?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-5">
                  <p className="font-semibold text-sm text-muted-foreground">
                    {article.author?.nickname || 'Anonymous'}
                  </p>
                  <p className="text-xs text-[#8C8C8C]">{formattedDate}</p>
                  <p className="flex items-center gap-1 text-xs text-[#8C8C8C]">
                    <Eye className="w-4 h-4" />
                    {article.view ?? 0}
                  </p>
                </div>
              </div>
              {!isMobile &&
                (isAdmin ||
                  (userId &&
                    article.author?.id &&
                    String(userId) === String(article.author.id))) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <EllipsisVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigate(`/community/articles/${id}/edit`)}
                        className="cursor-pointer"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive cursor-pointer"
                        disabled
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
            </div>
          </div>

          <MarkdownPreviewer value={article.description || ''} />

          <div
            className={cn('flex items-center justify-between mt-19 mb-8', isMobile && 'mb-[30px]')}
          >
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleToggleLike}
                disabled={!isAuthed}
                className={cn(
                  'flex items-center gap-2 border rounded-md p-3 text-sm disabled:opacity-50',
                  isMobile && 'px-3!',
                )}
              >
                <Heart
                  className={`w-4 h-4 ${article.isLiked ? 'fill-red-500 text-red-500' : ''}`}
                />
                {(article.likeCount ?? 0) > 0 && <span>{article.likeCount}</span>}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 border rounded-md py-3 px-4 text-sm"
              >
                <MessageCircleMore className="w-4 h-4" />
                <span>{article.commentCount ?? 0}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <ShareButton
                className={cn('h-full border rounded-md py-3 px-4! text-sm', isMobile && 'px-3!')}
              />
              {isMobile &&
                (isAdmin ||
                  (userId &&
                    article.author?.id &&
                    String(userId) === String(article.author.id))) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="p-3!">
                        <EllipsisVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigate(`/community/articles/${id}/edit`)}
                        className="cursor-pointer"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive cursor-pointer"
                        disabled
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
            </div>
          </div>

          {showComments && (
            <div>
              <h3 className={cn('text-[20px] font-bold mb-2', isMobile && 'text-base')}>
                Comments
              </h3>

              {isAuthed && (
                <div className={cn('mb-8', isMobile && 'mb-0')}>
                  <div className="flex flex-col items-end gap-3">
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write a comment..."
                      className={cn('h-[100px] resize-none', isMobile && 'text-sm')}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className={cn('flex-shrink-0', isMobile && 'text-xs')}
                      disabled={!comment.trim() || creatingComment}
                      onClick={handlePostComment}
                    >
                      {creatingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
                    </Button>
                  </div>
                </div>
              )}

              <div>
                {commentsLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </div>
                ) : comments.length === 0 ? (
                  <div className={cn('text-center py-8', isMobile && 'text-sm')}>
                    <p className="text-muted-foreground">No comments yet</p>
                  </div>
                ) : (
                  comments.map((commentItem) => (
                    <div key={commentItem.id} className="pt-[30px] pb-4 border-b">
                      <CommentItem
                        comment={commentItem}
                        onCommentAdded={() => {
                          refetchArticle();
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </Container>
      </div>

      {article?.type && <RecommendedArticles articleType={article.type} />}
    </>
  );
};

export default ArticleDetailPage;
