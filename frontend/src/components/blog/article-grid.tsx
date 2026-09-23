import { ArticleCard, type ArticleCardProps } from './article-card';

interface ArticleGridProps {
  articles: ArticleCardProps[];
  emptyLabel?: string;
}

/**
 * ArticleGrid — responsive grid of ArticleCard components.
 */
export function ArticleGrid({ articles, emptyLabel = 'No articles published yet.' }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.slug} {...article} />
      ))}
    </div>
  );
}
