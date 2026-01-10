import client from '@/apollo/client';
import { useCreateArticleMutation } from '@/apollo/mutation/create-article.generated';
import { useUpdateArticleMutation } from '@/apollo/mutation/update-article.generated';
import { ArticlesDocument } from '@/apollo/queries/articles.generated';
import notify from '@/lib/notify';
import { ArticleStatus } from '@/types/types.generated';
import { useNavigate } from 'react-router';
import ArticleForm, { type OnSubmitArticleFunc } from '../_components/article-form';

const CreateArticlePage: React.FC = () => {
  const navigate = useNavigate();

  const [createArticle, { loading: createLoading }] = useCreateArticleMutation();
  const [updateArticle, { loading: updateLoading }] = useUpdateArticleMutation();

  const onSubmit: OnSubmitArticleFunc = (data, action) => {
    if (!data.description.trim()) {
      notify('Description is required', 'error');
      return;
    }

    if (!data.coverImage) {
      notify('Cover image is required', 'error');
      return;
    }

    if (action === 'draft') {
      createArticle({
        variables: {
          input: {
            title: data.title,
            description: data.description,
            coverImage: data.coverImage,
            category: data.category,
            isPin: data.isPin,
          },
        },
        onCompleted: () => {
          client.refetchQueries({ include: [ArticlesDocument] });
          notify('Article saved as draft', 'success');
          navigate('/community/articles');
        },
        onError: (error) => {
          notify(error.message || 'Failed to save draft', 'error');
        },
      });
    } else {
      createArticle({
        variables: {
          input: {
            title: data.title,
            description: data.description,
            coverImage: data.coverImage,
            category: data.category,
            isPin: data.isPin,
          },
        },
        onCompleted: (response) => {
          if (response.createArticle?.id) {
            updateArticle({
              variables: {
                id: response.createArticle.id,
                input: {
                  status: ArticleStatus.Published,
                },
              },
              onCompleted: () => {
                client.refetchQueries({ include: [ArticlesDocument] });
                notify('Article published successfully', 'success');
                navigate('/community/articles');
              },
              onError: (error) => {
                notify(error.message || 'Failed to publish article', 'error');
              },
            });
          }
        },
        onError: (error) => {
          notify(error.message || 'Failed to create article', 'error');
        },
      });
    }
  };

  const isLoading = createLoading || updateLoading;

  return (
    <div className="p-10">
      <ArticleForm isEdit={false} onSubmitArticle={onSubmit} loading={isLoading} />
    </div>
  );
};

export default CreateArticlePage;
