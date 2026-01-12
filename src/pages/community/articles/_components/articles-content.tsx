import { useArticlesQuery } from '@/apollo/queries/articles.generated';
import { usePinnedArticlesQuery } from '@/apollo/queries/pinned-articles.generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { ArticleFilter, ArticleType } from '@/types/types.generated';
import { format } from 'date-fns';
import { Link, useSearchParams } from 'react-router';

const CATEGORIES = ['latest', 'trending', 'newsletter', 'campaign'] as const;
type CategoryType = (typeof CATEGORIES)[number];

const CATEGORY_FILTER_MAP: Record<CategoryType, ArticleFilter> = {
  latest: ArticleFilter.Latest,
  trending: ArticleFilter.Trending,
  newsletter: ArticleFilter.Newsletter,
  campaign: ArticleFilter.Campaign,
};

const CATEGORY_DISPLAY_MAP: Record<CategoryType, string> = {
  latest: 'Latest',
  trending: 'Trending',
  newsletter: 'Newsletter',
  campaign: 'Campaign',
};

const CATEGORY_ARTICLE_TYPE_MAP: Partial<Record<CategoryType, ArticleType>> = {
  newsletter: ArticleType.Newsletter,
  campaign: ArticleType.Campaign,
};

const ArticlesContent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 9;

  const categoryParam = searchParams.get('category') as CategoryType | null;
  const selectedCategory: CategoryType = CATEGORIES.includes(categoryParam as CategoryType)
    ? (categoryParam as CategoryType)
    : 'latest';

  const currentPage = Number(searchParams.get('page')) || 1;

  const { data: articlesData, loading: articlesLoading } = useArticlesQuery({
    variables: {
      input: {
        filter: CATEGORY_FILTER_MAP[selectedCategory],
        pagination: {
          offset: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
        },
      },
    },
  });

  const articleType = CATEGORY_ARTICLE_TYPE_MAP[selectedCategory] || ArticleType.Article;
  const { data: pinnedData } = usePinnedArticlesQuery({
    variables: { type: articleType! },
    skip: !articleType,
  });

  const pinnedArticles = pinnedData?.pinnedArticles ?? [];
  const articles = articlesData?.articles?.data || [];
  const totalCount = articlesData?.articles?.count || 0;

  return (
    <>
      <div className="flex gap-3 mb-9">
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => {
              const newSP = new URLSearchParams(searchParams);
              newSP.set('category', category);
              newSP.set('page', '1');
              setSearchParams(newSP);
            }}
            className="rounded-full px-4 py-2 h-fit text-base"
          >
            {CATEGORY_DISPLAY_MAP[category]}
          </Button>
        ))}
      </div>

      {pinnedArticles.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 mb-12">
          {pinnedArticles.map((article) => (
            <Link to={`/community/articles/${article.id}`} key={article.id}>
              <div
                className={`overflow-hidden rounded-md ${
                  article.type === ArticleType.Campaign ? 'aspect-[1/1]' : 'aspect-[5/3]'
                }`}
              >
                <img
                  src={article.coverImage || ''}
                  alt={article.title || ''}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={article.author?.profileImage || ''} />
                    <AvatarFallback>{article.author?.nickname?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {article.author?.nickname || 'Anonymous'}
                  </span>
                </div>
                <div className="text-2xl font-semibold">{article.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {article.createdAt ? format(new Date(article.createdAt), 'MMMM dd, yyyy') : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-7 mb-12">
        {articlesLoading ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-muted-foreground">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-muted-foreground">No articles found</p>
          </div>
        ) : (
          articles.map((article) => (
            <Link to={`/community/articles/${article.id}`} key={article.id}>
              <div
                className={`overflow-hidden rounded-lg ${
                  article.type === ArticleType.Campaign ? 'aspect-[1/1]' : 'aspect-[5/3]'
                }`}
              >
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
                    <AvatarFallback>{article.author?.nickname?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {article.author?.nickname || 'Anonymous'}
                  </span>
                </div>
                <div className="text-lg font-semibold">{article.title}</div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {article.createdAt ? format(new Date(article.createdAt), 'MMMM dd, yyyy') : ''}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      <Pagination totalCount={totalCount} pageSize={itemsPerPage} />
    </>
  );
};

export default ArticlesContent;
