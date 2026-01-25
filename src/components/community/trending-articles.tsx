import { TopViewedArticlesQuery } from '@/apollo/queries/top-viewed-articles.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router';

interface TrendingArticlesProps {
  articles: NonNullable<TopViewedArticlesQuery['topViewedArticles']>;
}

const TrendingArticles = ({ articles }: TrendingArticlesProps) => (
  <div className="bg-white border border-gray-200 rounded-md px-3 py-5">
    <h3 className="font-semibold text-lg mb-4 text-gray-500">Trending Articles</h3>
    <div className="flex flex-col gap-5">
      {articles.slice(0, 6).map((article) => (
        <Link
          key={article.id}
          to={`/community/articles/${article.id}`}
          className="border-b border-gray-200 hover:bg-gray-50 pb-5 transition-colors last:border-b-0 last:pb-0"
        >
          <h4 className="mb-2 font-bold text-sm">{article.title}</h4>
          <div className="flex items-center gap-2">
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
        </Link>
      ))}
    </div>
  </div>
);

export default TrendingArticles;
