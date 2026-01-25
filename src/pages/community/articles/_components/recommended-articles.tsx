import { useRecommendedArticlesQuery } from '@/apollo/queries/recommended-articles.generated';
import Container from '@/components/layout/container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ArticleType } from '@/types/types.generated';
import { format } from 'date-fns';
import { Link, useParams } from 'react-router';

interface RecommendedArticlesProps {
  articleType: ArticleType;
}

const RecommendedArticles = ({ articleType }: RecommendedArticlesProps) => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  const { data } = useRecommendedArticlesQuery({
    variables: { type: articleType },
  });

  const recommendedArticles = data?.recommendedArticles?.filter((a) => a.id !== id) ?? [];

  if (recommendedArticles.length === 0) {
    return null;
  }

  return (
    <Container size="narrow" className={cn('pt-12 pb-23', isMobile && 'pt-7')}>
      <h2 className={cn('text-xl font-bold mb-6', isMobile && 'text-base')}>Recommended for You</h2>
      <div
        className={cn(
          'grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10',
          isMobile && 'gap-x-3 gap-y-6',
        )}
      >
        {recommendedArticles.slice(0, 6).map((article) => (
          <Link to={`/community/articles/${article.id}`} key={article.id}>
            <div
              className={`overflow-hidden rounded-lg ${
                article.type === ArticleType.Campaign
                  ? 'aspect-[1/1]'
                  : isMobile
                    ? 'aspect-[1/1]'
                    : 'aspect-[5/3]'
              }`}
            >
              <img
                src={article.coverImage || ''}
                alt={article.title || ''}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className={cn('pt-2', isMobile && 'pt-[6.3px]')}>
              <div className={cn('flex items-center gap-2 mb-2', isMobile && 'text-xs')}>
                <Avatar className={cn('w-5 h-5', isMobile && 'w-4 h-4')}>
                  <AvatarImage src={article.author?.profileImage || ''} />
                  <AvatarFallback className={cn('text-xs', isMobile && 'text-xs')}>
                    {article.author?.nickname?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className={cn('text-xs text-muted-foreground', isMobile && 'text-xs')}>
                  {article.author?.nickname || 'Anonymous'}
                </span>
              </div>
              <h3 className={cn('font-semibold text-lg line-clamp-2 mb-3', isMobile && 'text-sm')}>
                {article.title}
              </h3>
              <p className={cn('text-xs text-muted-foreground', isMobile && 'text-xs')}>
                {article.createdAt ? format(new Date(article.createdAt), 'MMMM dd, yyyy') : ''}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
};

export default RecommendedArticles;
