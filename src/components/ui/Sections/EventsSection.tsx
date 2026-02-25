import SectionTitle from "../Titles/SectionTitle";
import ActivityCard from "../Cards/ProgramCard";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { useProgramsData } from "@/hooks/useProgramsData";
import { useHomeData } from "@/hooks/useHomeData";
import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer, {
  StaggerItem,
} from "@/components/animations/StaggerContainer";
import { useEventsData } from "@/hooks/useEventsData";

export default function EventsSection() {
  const DataActivities = useEventsData(); // Use events data instead of programs data
  const activitiesItems = (DataActivities.events as Array<{
    slug: string;
    title: string | { tr?: string };
    location?: string;
    coverImage?: string;
  }>).slice(0, 6); // Access events instead of programs
  const homeData = useHomeData();

  return (
    <section className="w-full  py-22 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-16">
          <FadeIn direction="up">
            <SectionTitle
              title={homeData.sections.events.title}
              className="text-primary font-bold text-xl md:text-2xl text-red-700"
            />
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activitiesItems.map((activity) => (
            <StaggerItem key={activity.slug}>
              <Link to={`/events/${activity.slug}`}>
                <ActivityCard
                  title={typeof activity.title === "string" ? activity.title : activity.title?.tr || ""}
                  description={activity.location || ""}
                  imageUrl={activity.coverImage}
                />
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn direction="up" delay={0.4}>
          <Button
            href="/events" // Update button link to events
            className={
              "mt-20 w-fit text-sm text-red-800 border-red-800 mx-auto hover:bg-red-800 hover:text-white bg-transparent "
            }
            variant={"secondary"}
          >
            {homeData.sections.events.buttonText}
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
