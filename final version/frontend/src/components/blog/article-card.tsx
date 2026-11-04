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

function ImagePlaceholder() {
  return <div className="h-full w-full bg-gradient-to-br from-slate-100 to-teal-50" />;
}

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
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-teal-500/50 hover:shadow-md">
      <Link href={`/blog/${slug}`} tabIndex={-1} aria-hidden className="block">
        <div className="relative h-48 w-full overflow-hidden bg-slate-50">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <ImagePlaceholder />
          )}
          <span className="absolute start-3 top-3 rounded-3xl border border-slate-200 bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#164E53]">
            {category}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col border-t border-slate-100 p-5">
        <time dateTime={publishedAt} className="text-[11px] font-bold uppercase tracking-wider text-[#0D9488]">
          {formatDate(publishedAt, locale)}
        </time>

        <h3 className="mt-2 text-lg font-black tracking-tight text-[#0F172A]">
          <Link href={`/blog/${slug}`} className="hover:text-[#164E53]">
            {title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{excerpt}</p>
        <Link
          href={`/blog/${slug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0D9488]"
        >
          {readMoreLabel}
          <ArrowRight className="h-4 w-4 flip-x transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
