import client from '@/apollo/client';
import { useUpdateArticleMutation } from '@/apollo/mutation/update-article.generated';
import { useArticleQuery } from '@/apollo/queries/article.generated';
import { ArticlesDocument } from '@/apollo/queries/articles.generated';
import { useAuth } from '@/lib/hooks/use-auth';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import notify from '@/lib/notify';
import { cn } from '@/lib/utils';
import { ArticleStatus } from '@/types/types.generated';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import ArticleForm, { type OnSubmitArticleFunc } from '../_components/article-form';

const EditArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useIsMobile();
  const { userId, isAdmin, isAuthLoading } = useAuth();

  const { data: articleData, loading: articleLoading } = useArticleQuery({
    variables: { id: id ?? '' },
    skip: !id,
  });

  const [updateArticle, { loading }] = useUpdateArticleMutation();

  const authorId = articleData?.article?.author?.id;
  const isAuthor = authorId && userId && String(authorId) === String(userId);
  const hasPermission = isAdmin || isAuthor;

  useEffect(() => {
    if (isAuthLoading || articleLoading) return;

    if (!hasPermission) {
      notify('You do not have permission to edit this article', 'error');
      navigate(`/community/articles/${id}`);
    }
  }, [isAuthLoading, articleLoading, hasPermission, navigate, id]);

  const onSubmit: OnSubmitArticleFunc = (data, action) => {
    if (!data.description.trim()) {
      notify('Description is required', 'error');
      return;
    }

    updateArticle({
      variables: {
        id: id!,
        input: {
          title: data.title,
          description: data.description,
          coverImage: data.coverImage,
          category: data.category,
          isPin: data.isPin,
          status: action === 'publish' ? ArticleStatus.Published : ArticleStatus.Draft,
          unpinArticleId: data.unpinArticleId,
        },
      },
      onCompleted: () => {
        client.refetchQueries({ include: [ArticlesDocument] });
        notify(
          action === 'publish' ? 'Article updated successfully' : 'Article saved as draft',
          'success',
        );
        navigate(`/community/articles/${id}`);
      },
      onError: (error) => {
        notify(error.message || 'Failed to update article', 'error');
      },
    });
  };

  if (isAuthLoading || articleLoading) {
    return null;
  }

  if (!hasPermission) {
    return null;
  }

  return (
    <div className={cn('rounded-2xl bg-white', isMobile && 'rounded-none')}>
      <ArticleForm isEdit={true} onSubmitArticle={onSubmit} loading={loading} />
    </div>
  );
};

export default EditArticlePage;
