import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ArticleLayout from "@/components/ui/Layouts/ArticleLayout";
import { useEventsData } from "@/hooks/useEventsData";
import trPage from '../../data/locales/tr/eventsPage.json';
import arPage from '../../data/locales/ar/eventsPage.json';
import enPage from '../../data/locales/en/eventsPage.json';
import { eventsService } from "@/services/eventsService";
import { resolveImage, resolveContentImages } from "@/utils/resolveImage";

export default function EventDetailPage() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const { events, loading: listLoading } = useEventsData();
  const lang = i18n.language as 'ar' | 'en' | 'tr';
  const pageMap: Record<string, any> = { ar: arPage, en: enPage, tr: trPage };
  const pageData = pageMap[lang] || pageMap['ar'];
  const [eventItem, setEventItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);

    // جلب من القائمة إذا كانت موجودة
    const fromList = events.find(
      (item: any) => String(item.id) === id || String(item._id) === id || item.slug === id
    );
    if (fromList && typeof fromList === 'object' && fromList !== null) {
      setEventItem(Object.assign({}, fromList));
      setLoading(false);
      return;
    }

    // جلب من API
    eventsService
      .getBySlug(id)
      .then((apiItem) => {
        if (!cancelled && apiItem) {
          const t = apiItem.translations?.[lang] || apiItem.translations?.ar || {};
          setEventItem({
            id: apiItem.slug || apiItem._id,
            _id: apiItem._id,
            slug: apiItem.slug,
            title: t.title || apiItem.title,
            date: apiItem.startDate || apiItem.date,
            coverImage: resolveImage(apiItem.coverImage),
            author: apiItem.author?.name || '',
            content: t.content || apiItem.content || '',
            location: t.location || apiItem.location || '',
            category: t.category || apiItem.category || '',
            tags: t.tags ? (typeof t.tags === 'string' ? t.tags.split(',').map((x: string) => x.trim()) : t.tags) : apiItem.tags || [],
          });
        }
      })
      .catch(() => {
        eventsService
          .getById(id)
          .then((apiItem) => {
            if (!cancelled && apiItem) {
              const t = apiItem.translations?.[lang] || apiItem.translations?.ar || {};
              setEventItem({
                id: apiItem.slug || apiItem._id,
                _id: apiItem._id,
                slug: apiItem.slug,
                title: t.title || apiItem.title,
                date: apiItem.startDate || apiItem.date,
                coverImage: resolveImage(apiItem.coverImage),
                author: apiItem.author?.name || '',
                content: t.content || apiItem.content || '',
                location: t.location || apiItem.location || '',
                category: t.category || apiItem.category || '',
                tags: t.tags ? (typeof t.tags === 'string' ? t.tags.split(',').map((x: string) => x.trim()) : t.tags) : apiItem.tags || [],
              });
            }
          });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id, events, lang]);

  if (loading || listLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!eventItem) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold text-gray-800">
          {pageData.detail?.notFoundMessage || pageData.empty}
        </h1>
      </div>
    );
  }

  const latestEvents = [...events]
    .sort(
      (a: any, b: any) =>
        new Date(b.startDate || b.date).getTime() - new Date(a.startDate || a.date).getTime()
    )
    .slice(0, 4)
    .map((item: any) => ({ title: item.title, href: `/events/${item.slug || item.id}` }));

  const breadcrumbs = [
    { name: pageData.hero?.breadcrumbs?.[0]?.label || 'الرئيسية', href: "/" },
    { name: pageData.hero?.breadcrumbs?.[1]?.label || 'الفعاليات', href: "/events" },
    { name: eventItem.title, href: `/events/${eventItem.slug || eventItem.id}` },
  ];

  const labels = pageData.detail || {};

  return (
    <ArticleLayout
      title={eventItem.title}
      coverImage={eventItem.coverImage}
      breadcrumbs={breadcrumbs}
      author={eventItem.author}
      date={eventItem.date}
      latestNews={latestEvents}
    >
      <div
        dangerouslySetInnerHTML={{ __html: resolveContentImages(eventItem.description || "") }}
        className="prose lg:prose-lg max-w-none text-gray-800 text-justify prose-headings:text-neutral-900 prose-p:text-neutral-800 prose-p:text-lg prose-p:leading-relaxed"
      />

      {/* تفاصيل الحدث */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          {eventItem.location && (
            <div><span className="font-bold text-gray-900">{labels.location}:</span> {eventItem.location}</div>
          )}
          {eventItem.category && (
            <div><span className="font-bold text-gray-900">{labels.category}:</span> {eventItem.category}</div>
          )}
          {eventItem.capacity && (
            <div><span className="font-bold text-gray-900">{labels.capacity}:</span> {eventItem.capacity}</div>
          )}
          {eventItem.startDate && (
            <div><span className="font-bold text-gray-900">{labels.startDate}:</span> {new Date(eventItem.startDate).toLocaleString(lang === 'ar' ? 'ar-EG' : lang)}</div>
          )}
          {eventItem.endDate && (
            <div><span className="font-bold text-gray-900">{labels.endDate}:</span> {new Date(eventItem.endDate).toLocaleString(lang === 'ar' ? 'ar-EG' : lang)}</div>
          )}
          {typeof eventItem.isPublished !== 'undefined' && (
            <div><span className="font-bold text-gray-900">{labels.status}:</span> {eventItem.isPublished ? labels.published : labels.draft}</div>
          )}
          {eventItem.isFeatured && (
            <div><span className="font-bold text-gray-900">{labels.featured}:</span> <span className="text-green-600">{labels.yes}</span></div>
          )}
        </div>
        {/* التصنيف والوسوم */}
        {(eventItem.tags && eventItem.tags.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {(Array.isArray(eventItem.tags) ? eventItem.tags : [eventItem.tags]).map((tag: string, idx: number) => (
              <span key={idx} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </ArticleLayout>
  );
}
