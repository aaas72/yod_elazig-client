import SimplePageHero from "@/components/ui/Sections/SimplePageHero";
import NewsGrid from "@/components/ui/Cards/NewsCardGrid";
import { useNewsData } from "@/hooks/useNewsData";
import { useNewsPageData } from "@/hooks/useNewsPageData";

const News = () => {
  const { news, loading } = useNewsData();
  const newsPageData = useNewsPageData();

  const sortedNews = [...news].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div>
      <SimplePageHero
        title={newsPageData.hero.title}
        breadcrumbs={newsPageData.hero.breadcrumbs}
      />
      <section className="md:p-12 p-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
            </div>
          ) : sortedNews.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">لا توجد أخبار حالياً</p>
            </div>
          ) : (
            <NewsGrid newsItems={sortedNews} />
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
