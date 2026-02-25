import SectionTitle from "../Titles/SectionTitle";
import NewsGrid from "../Cards/NewsCardGrid";
import Button from "@/components/ui/Button";
import { useNewsData } from "@/hooks/useNewsData";
import { useHomeData } from "@/hooks/useHomeData";
import FadeIn from "@/components/animations/FadeIn";

export default function NewsSection() {
  const { news: DataNews, loading } = useNewsData();
  const newsItems = DataNews.slice(0, 6);
  const homeData = useHomeData();

  return (
    <section className="w-full bg-linear-to-b from-[#1E1E1E] to-[#383838]  py-22 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-16">
          <FadeIn direction="up">
            <SectionTitle
              title={homeData.sections.news.title}
              className="text-primary font-bold text-xl md:text-2xl text-white"
            />
          </FadeIn>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <NewsGrid newsItems={newsItems} />
        )}

        <FadeIn direction="up" delay={0.4}>
          <Button
            href="/news"
            className={
              "mt-20 w-fit text-sm border text-white border-white mx-auto hover:bg-white hover:text-gray-900 bg-transparent "
            }
            variant={"secondary"}
          >
            {homeData.sections.news.buttonText}
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
