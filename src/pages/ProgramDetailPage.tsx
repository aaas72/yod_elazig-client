import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ArticleLayout from "@/components/ui/Layouts/ArticleLayout";
import { useProgramsData } from "@/hooks/useProgramsData";
import trPage from '../../data/locales/tr/programsPage.json';
import arPage from '../../data/locales/ar/programsPage.json';
import enPage from '../../data/locales/en/programsPage.json';
import { programsService } from "@/services/programsService";
import { resolveImage, resolveContentImages } from "@/utils/resolveImage";

export default function ProgramDetailPage() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const { programs, loading: listLoading } = useProgramsData({ admin: false });
  const lang = i18n.language as 'ar' | 'en' | 'tr';
  const pageData = lang === 'ar' ? arPage : lang === 'en' ? enPage : trPage;
  const [programItem, setProgramItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);

    // جلب من القائمة إذا كانت موجودة
    const fromList = programs.find(
      (item: any) => String(item.id) === id || String(item._id) === id || item.slug === id
    );
    if (fromList && typeof fromList === 'object' && fromList !== null) {
      setProgramItem({ ...fromList });
      setLoading(false);
      return;
    }

    // جلب من API
    programsService  
      .getBySlug(id)
      .then((apiItem) => {
        if (!cancelled) {
          setProgramItem({ ...apiItem });
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, programs]);

  if (loading || listLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!programItem) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold text-gray-800">
          {pageData.detail?.notFoundMessage}
        </h1>
      </div>
    );
  }

  // Safe translation extraction
  const getTranslated = (field: any) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') return field[lang] || field.ar || Object.values(field)[0] || '';
    return '';
  };

  const breadcrumbs = [
    { name: pageData.hero?.breadcrumbs?.[0]?.label, href: "/" },
    { name: pageData.hero?.breadcrumbs?.[1]?.label, href: "/programs" },
    { name: getTranslated(programItem.title), href: `/programs/${programItem.slug || programItem._id}` },
  ];

  // ترجمة العناوين الثابتة
  const labels = {
    location: pageData.detail?.locationLabel,
    category: pageData.detail?.categoryLabel,
    startDate: pageData.detail?.startDateLabel,
    endDate: pageData.detail?.endDateLabel,
    status: pageData.detail?.statusLabel,
    published: pageData.detail?.published,
    draft: pageData.detail?.draft,
  };

  // تحديد اتجاه النص بناءً على اللغة
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <ArticleLayout
      title={getTranslated(programItem.title)}
      coverImage={resolveImage(programItem.coverImage)}
      breadcrumbs={breadcrumbs}
      date={programItem.startDate}
    >
      {/* ضبط النصوص والعناوين */}
      <div
        dir={dir}
        dangerouslySetInnerHTML={{ __html: resolveContentImages(getTranslated(programItem.description)) }}
        className={`prose lg:prose-lg max-w-none text-gray-800 text-justify prose-headings:text-neutral-900 prose-p:text-neutral-800 prose-p:text-lg prose-p:leading-relaxed ${dir === 'rtl' ? 'rtl' : 'ltr'} break-words overflow-wrap break-word`}
        style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}
      />
      <div className="mt-8 pt-6 border-t border-gray-200" dir={dir}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          {programItem.location && (
            <div className="break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}><span className="font-bold text-gray-900">{labels.location}</span> {programItem.location}</div>
          )}
          {programItem.category && (
            <div className="break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}><span className="font-bold text-gray-900">{labels.category}</span> {programItem.category}</div>
          )}
          {programItem.startDate && (
            <div className="break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}><span className="font-bold text-gray-900">{labels.startDate}</span> {new Date(programItem.startDate).toLocaleString(lang === 'ar' ? 'ar-EG' : lang)}</div>
          )}
          {programItem.endDate && (
            <div className="break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}><span className="font-bold text-gray-900">{labels.endDate}</span> {new Date(programItem.endDate).toLocaleString(lang === 'ar' ? 'ar-EG' : lang)}</div>
          )}
          {typeof programItem.isPublished !== 'undefined' && (
            <div className="break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}><span className="font-bold text-gray-900">{labels.status}</span> {programItem.isPublished ? labels.published : labels.draft}</div>
          )}
        </div>
        {(programItem.tags && programItem.tags.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {(Array.isArray(programItem.tags) ? programItem.tags : [programItem.tags]).map((tag: string, idx: number) => (
              <span key={idx} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </ArticleLayout>
  );
}