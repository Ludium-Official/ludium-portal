import client from '@/apollo/client';
import { useUpdateArticleMutation } from '@/apollo/mutation/update-article.generated';
import { ArticlesDocument } from '@/apollo/queries/articles.generated';
import notify from '@/lib/notify';
import { ArticleStatus } from '@/types/types.generated';
import { useNavigate, useParams } from 'react-router';
import ArticleForm, { type OnSubmitArticleFunc } from '../_components/article-form';

const EditArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [updateArticle, { loading }] = useUpdateArticleMutation();

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
          status: action === 'publish' ? ArticleStatus.Published : ArticleStatus.Pending,
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

  return (
    <div className="p-10 pr-[55px]">
      <ArticleForm isEdit={true} onSubmitArticle={onSubmit} loading={loading} />
    </div>
  );
};

export default EditArticlePage;
