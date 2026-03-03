import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import MainLayout from "./layouts/MainLayout";
import ScrollToTop from "./components/ScrollToTop";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Public Pages — lazy loaded
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AboutCityPage = lazy(() => import("./pages/AboutCityPage"));
const AboutUniversityPage = lazy(() => import("./pages/AboutUniversityPage"));
const AccessPage = lazy(() => import("./pages/AccessPage"));
const ProgramsPage = lazy(() => import("./pages/ProgramsPage"));
const ActivityDetailPage = lazy(() => import("./pages/ProgramDetailPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const NewsDetailPage = lazy(() => import("./pages/NewsDetailPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const VolunteerPage = lazy(() => import("./pages/VolunteerPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const JoinMembershipPage = lazy(() => import("./pages/JoinMembershipPage"));
const PublicFormPage = lazy(() => import("./pages/PublicFormPage"));

// Admin — lazy loaded
import ProtectedRoute from "./components/ProtectedRoute";
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const LoginPage = lazy(() => import("./pages/admin/LoginPage"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const AdminNewsPage = lazy(() => import("./pages/admin/AdminNewsPage"));
const AdminEventsPage = lazy(() => import("./pages/admin/AdminEventsPage"));
const AdminProgramsPage = lazy(() => import("./pages/admin/AdminProgramsPage"));
const AdminAchievementsPage = lazy(() => import("./pages/admin/AdminAchievementsPage"));
const AdminFaqPage = lazy(() => import("./pages/admin/AdminFaqPage"));
const AdminGalleryPage = lazy(() => import("./pages/admin/AdminGalleryPage"));
const AdminTickerPage = lazy(() => import("./pages/admin/AdminTickerPage"));
const AdminMembersPage = lazy(() => import("./pages/admin/AdminMembersPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminVolunteersPage = lazy(() => import("./pages/admin/AdminVolunteersPage"));
const AdminSettingsPage = lazy(() => import("./pages/admin/AdminSettingsPage"));
const AdminFormsPage = lazy(() => import("./pages/admin/AdminFormsPage"));
const AdminFormSubmissionsPage = lazy(() => import("./pages/admin/AdminFormSubmissionsPage"));
const AdminReportsPage = lazy(() => import("./pages/admin/AdminReportsPage"));



function App() {
    const [visitCount, setVisitCount] = useState(0);
    useEffect(() => {
      let count = Number(localStorage.getItem('siteVisitCount') || 0);
      count++;
      localStorage.setItem('siteVisitCount', count.toString());
      setVisitCount(count);
    }, []);
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;

    // Set tab title based on language
    if (i18n.language === "ar") {
      document.title = "اتحاد الطلاب اليمنيين في تركيا - فرع الازيغ";
    } else if (i18n.language === "tr") {
      document.title = "Türkiye'deki Yemenli Öğrenciler Birliği - Elazığ Şubesi";
    } else {
      document.title = "Yemeni Students Union in Turkey - Elazig Branch";
    }
  }, [i18n.language]);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  const getLoadingText = () => {
    switch (i18n.language) {
      case "ar":
        return "جاري التحميل...";
      case "en":
        return "Loading...";
      case "tr":
        return "Yükleniyor...";
      default:
        return "جاري التحميل...";
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingSpinner fullScreen text={getLoadingText()} />}
      </AnimatePresence>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<LoadingSpinner fullScreen text={getLoadingText()} />}>
        <Routes>
          <Route element={<MainLayout><Outlet /></MainLayout>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about-city" element={<AboutCityPage />} />
            <Route path="/about-university" element={<AboutUniversityPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/programs/:id" element={<ActivityDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/volunteer" element={<VolunteerPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/forms/:slug" element={<PublicFormPage />} />
          </Route>
          <Route path="/join-membership" element={<JoinMembershipPage />} />
{/* archive access page (alias "archive" as well) */}
            <Route path="/access" element={<AccessPage />} />
            <Route path="/archive" element={<AccessPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
            <Route path="admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<DashboardPage />} />
              <Route path="news" element={<AdminNewsPage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="programs" element={<AdminProgramsPage />} />
              <Route path="achievements" element={<AdminAchievementsPage />} />
              <Route path="faq" element={<AdminFaqPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="ticker" element={<AdminTickerPage />} />
              <Route path="members" element={<AdminMembersPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="forms" element={<AdminFormsPage />} />
              <Route path="forms/:formId/submissions" element={<AdminFormSubmissionsPage />} />
            <Route path="volunteers" element={<AdminVolunteersPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
