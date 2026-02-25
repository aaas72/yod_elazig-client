import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ArticleLayout from "@/components/ui/Layouts/ArticleLayout";
import { useNewsData } from "@/hooks/useNewsData";
import { useNewsPageData } from "@/hooks/useNewsPageData";
import { newsService } from "@/services/newsService";
import { resolveImage, resolveContentImages } from "@/utils/resolveImage";

export default function SingleNewsPage() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const { news: newsData, loading: listLoading } = useNewsData();
  const newsPageData = useNewsPageData();
  const [newsItem, setNewsItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);

    // Try finding in already-loaded list first (works for both static and API data)
    const fromList = newsData.find(
      (item: any) => String(item.id) === id || String(item._id) === id || item.slug === id
    );

    if (fromList) {
      setNewsItem({
        ...fromList,
        category: fromList.category || '',
        tags: fromList.tags || [],
      });
      setLoading(false);
      return;
    }

    // If not in list, try fetching from API by slug
    newsService
      .getBySlug(id)
      .then((apiItem) => {
        if (!cancelled && apiItem) {
          const lang = i18n.language as 'ar' | 'en' | 'tr';
          const t = apiItem.translations?.[lang] || apiItem.translations?.ar || {};
          setNewsItem({
            id: apiItem.slug || apiItem._id,
            _id: apiItem._id,
            slug: apiItem.slug,
            title: t.title || apiItem.title,
            date: apiItem.publishedAt || apiItem.createdAt,
            coverImage: resolveImage(apiItem.coverImage),
            author: apiItem.author?.name || '',
            content: t.content || apiItem.content || '',
            category: t.category || apiItem.category || '',
            tags: t.tags ? (typeof t.tags === 'string' ? t.tags.split(',').map((x: string) => x.trim()) : t.tags) : apiItem.tags || [],
          });
        }
      })
      .catch(() => {
        // Try by ID
        newsService
          .getById(id)
          .then((apiItem) => {
            if (!cancelled && apiItem) {
              const lang = i18n.language as 'ar' | 'en' | 'tr';
              const t = apiItem.translations?.[lang] || apiItem.translations?.ar || {};
              setNewsItem({
                id: apiItem.slug || apiItem._id,
                _id: apiItem._id,
                slug: apiItem.slug,
                title: t.title || apiItem.title,
                date: apiItem.publishedAt || apiItem.createdAt,
                coverImage: resolveImage(apiItem.coverImage),
                author: apiItem.author?.name || '',
                content: t.content || apiItem.content || '',
                category: t.category || apiItem.category || '',
                tags: t.tags ? (typeof t.tags === 'string' ? t.tags.split(',').map((x: string) => x.trim()) : t.tags) : apiItem.tags || [],
              });
            }
          })
          .catch(() => {
            // Not found
          });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id, newsData]);

  if (loading || listLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold text-gray-800">
          {newsPageData.detail.notFoundMessage}
        </h1>
      </div>
    );
  }

  const latestNews = [...newsData]
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 4)
    .map((item: any) => ({ title: item.title, href: `/news/${item.slug || item.id}` }));

  const breadcrumbs = [
    { name: newsPageData.detail.breadcrumbs.home, href: "/" },
    { name: newsPageData.detail.breadcrumbs.news, href: "/news" },
    { name: newsItem.title, href: `/news/${newsItem.slug || newsItem.id}` },
  ];

  return (
    <ArticleLayout
      title={newsItem.title}
      coverImage={newsItem.coverImage}
      breadcrumbs={breadcrumbs}
      author={newsItem.author}
      date={newsItem.date}
      latestNews={latestNews}
    >
      <div
        dangerouslySetInnerHTML={{ __html: resolveContentImages(newsItem.content || "") }}
        className="prose lg:prose-lg max-w-none text-gray-800 text-justify prose-headings:text-neutral-900 prose-p:text-neutral-800 prose-p:text-lg prose-p:leading-relaxed"
      />

      {/* التصنيف والوسوم */}
      {(newsItem.category || (newsItem.tags && newsItem.tags.length > 0)) && (
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-3">
          {newsItem.category && (
            <span className="text-sm text-gray-500">
              {newsItem.category}
            </span>
          )}
          {newsItem.tags && newsItem.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(newsItem.tags) ? newsItem.tags : [newsItem.tags]).map((tag: string, idx: number) => (
                <span key={idx} className="text-sm text-red-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </ArticleLayout>
  );
}
