import { useRecommendedArticlesQuery } from '@/apollo/queries/recommended-articles.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArticleType } from '@/types/types.generated';
import { format } from 'date-fns';
import { Link, useParams } from 'react-router';

interface RecommendedArticlesProps {
  articleType: ArticleType;
}

const RecommendedArticles = ({ articleType }: RecommendedArticlesProps) => {
  const { id } = useParams();

  const { data } = useRecommendedArticlesQuery({
    variables: { type: articleType },
  });

  const recommendedArticles = data?.recommendedArticles?.filter((a) => a.id !== id) ?? [];

  if (recommendedArticles.length === 0) {
    return null;
  }

  return (
    <div className="pt-12 pb-23">
      <div className="max-w-[936px] mx-auto">
        <h2 className="text-xl font-bold mb-6">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
          {recommendedArticles.slice(0, 6).map((article) => (
            <Link
              key={article.id}
              to={`/community/articles/${article.id}`}
              className="overflow-hidden transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src={article.coverImage || ''}
                  alt={article.title || ''}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={article.author?.profileImage || ''} />
                    <AvatarFallback className="text-xs">
                      {article.author?.nickname?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {article.author?.nickname || 'Anonymous'}
                  </span>
                </div>
                <h3 className="font-semibold text-lg line-clamp-2 mb-3">{article.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {article.createdAt ? format(new Date(article.createdAt), 'MMMM dd, yyyy') : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedArticles;
