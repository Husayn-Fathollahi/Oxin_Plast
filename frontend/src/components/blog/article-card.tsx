import { Link } from '@/lib/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatting';

export interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string;
  publishedAt: string;
  category?: string;
  locale?: string;
  readMoreLabel?: string;
}

/** Placeholder shown when an article has no cover image. */
function ImagePlaceholder() {
  return <div className="h-full w-full bg-mesh" />;
}

/**
 * ArticleCard — professional blog article summary card for listing pages.
 * Always shows a fixed-height image area (placeholder if no cover image).
 */
export function ArticleCard({
  title,
  slug,
  excerpt,
  coverImageUrl,
  publishedAt,
  category = 'News',
  locale,
  readMoreLabel = 'Read more',
}: ArticleCardProps) {
  return (
    <article className="card group flex flex-col overflow-hidden">
      {/* Image area */}
      <Link href={`/blog/${slug}`} tabIndex={-1} aria-hidden className="block">
        <div className="relative h-48 w-full overflow-hidden bg-sand-100">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <ImagePlaceholder />
          )}
          <span className="absolute start-4 top-4 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold text-brand-700 shadow-soft">
            {category}
          </span>
        </div>
      </Link>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-6">
        <time dateTime={publishedAt} className="text-xs font-bold uppercase tracking-wider text-brand-600">
          {formatDate(publishedAt, locale)}
        </time>

        <h2 className="display text-lg leading-snug text-ink line-clamp-2 mt-2">
          <Link href={`/blog/${slug}`} className="transition-colors hover:text-brand-700">
            {title}
          </Link>
        </h2>

        <p className="flex-1 text-sm leading-relaxed text-ink-muted line-clamp-2 mt-3">{excerpt}</p>

        <Link
          href={`/blog/${slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-700"
        >
          {readMoreLabel}
          <ArrowRight className="h-4 w-4 flip-x transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
