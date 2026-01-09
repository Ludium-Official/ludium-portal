import { useArticlesQuery } from "@/apollo/queries/articles.generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ArticleFilter } from "@/types/types.generated";
import { format } from "date-fns";
import { Link, useSearchParams } from "react-router";
import { useState } from "react";

const MOCK_PINNED_ARTICLES = [
  {
    id: 1,
    title:
      "No Fixed Address designs a world-first No Fixed Address designs a world-first No Fixed Address designs a world-first No Fixed Address",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    author: {
      name: "Waldorf Hegmann",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    date: "February 3, 2022",
    category: "Trending",
  },
  {
    id: 2,
    title: "No Fixed Address designs a world-first bio...",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    author: {
      name: "Waldorf Hegmann",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    date: "February 3, 2022",
    category: "Trending",
  },
  {
    id: 3,
    title:
      "No Fixed Address designs a world-first No Fixed Address designs a world-first No Fixed Address designs a world-first No Fixed Address",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    author: {
      name: "Waldorf Hegmann",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    date: "February 3, 2022",
    category: "Campaign",
  },
  {
    id: 4,
    title: "No Fixed Address designs a world-first bio...",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    author: {
      name: "Waldorf Hegmann",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    date: "February 3, 2022",
    category: "Campaign",
  },
];

const CATEGORIES = ["Latest", "Trending", "Newsletter", "Campaign"];

const CATEGORY_FILTER_MAP: Record<string, ArticleFilter | undefined> = {
  Latest: ArticleFilter.Latest,
  Trending: ArticleFilter.Trending,
  Newsletter: ArticleFilter.Newsletter,
  Campaign: ArticleFilter.Campaign,
};

const ArticlesContent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("Latest");
  const itemsPerPage = 9;

  const currentPage = Number(searchParams.get("page")) || 1;

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

  const pinnedArticles = MOCK_PINNED_ARTICLES.filter(
    (article) => article.category === selectedCategory
  );

  const articles = articlesData?.articles?.data || [];
  const totalCount = articlesData?.articles?.count || 0;

  return (
    <>
      <div className="flex gap-3 mb-9">
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => {
              setSelectedCategory(category);
              const newSP = new URLSearchParams(searchParams);
              newSP.set("page", "1");
              setSearchParams(newSP);
            }}
            className="rounded-full px-4 py-2 h-fit text-base"
          >
            {category}
          </Button>
        ))}
      </div>

      {pinnedArticles.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 mb-12">
          {pinnedArticles.map((article) => (
            <div key={article.id} className="overflow-hidden">
              <div className="overflow-hidden rounded-md">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={article.author.avatar} />
                    <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {article.author.name}
                  </span>
                </div>
                <Link
                  to={`/community/articles/${article.id}`}
                  className="text-2xl font-semibold"
                >
                  {article.title}
                </Link>
                <p className="mt-2 text-sm text-muted-foreground">
                  {article.date}
                </p>
              </div>
            </div>
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
            <div key={article.id} className="overflow-hidden">
              <div className="overflow-hidden rounded-md">
                <img
                  src={article.coverImage || ""}
                  alt={article.title || ""}
                  className="w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={article.author?.profileImage || ""} />
                    <AvatarFallback>
                      {article.author?.nickname?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {article.author?.nickname || "Anonymous"}
                  </span>
                </div>
                <Link
                  to={`/community/articles/${article.id}`}
                  className="text-lg font-semibold"
                >
                  {article.title}
                </Link>
                <p className="mt-2 text-xs text-muted-foreground">
                  {article.createdAt
                    ? format(new Date(article.createdAt), "MMMM dd, yyyy")
                    : ""}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination totalCount={totalCount} pageSize={itemsPerPage} />
    </>
  );
};

export default ArticlesContent;

