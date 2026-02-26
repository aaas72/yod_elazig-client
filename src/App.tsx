import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import MainLayout from "./layouts/MainLayout";
import ScrollToTop from "./components/ScrollToTop";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Public Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AboutCityPage from "./pages/AboutCityPage";
import AboutUniversityPage from "./pages/AboutUniversityPage";
import AccessPage from "./pages/AccessPage";
import ProgramsPage from "./pages/ProgramsPage";
import ActivityDetailPage from "./pages/ProgramDetailPage";
import ContactPage from "./pages/ContactPage";
import NewsPage from "./pages/NewsPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import ResourcesPage from "./pages/ResourcesPage";
import VolunteerPage from "./pages/VolunteerPage";
import FaqPage from "./pages/FaqPage";
import NotFoundPage from "./pages/NotFoundPage";
import JoinMembershipPage from "./pages/JoinMembershipPage";
import PublicFormPage from "./pages/PublicFormPage";

// Admin
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import AdminNewsPage from "./pages/admin/AdminNewsPage";
import AdminEventsPage from "./pages/admin/AdminEventsPage";
import AdminProgramsPage from "./pages/admin/AdminProgramsPage";
import AdminAchievementsPage from "./pages/admin/AdminAchievementsPage";
import AdminFaqPage from "./pages/admin/AdminFaqPage";
import AdminGalleryPage from "./pages/admin/AdminGalleryPage";
import AdminTickerPage from "./pages/admin/AdminTickerPage";
import AdminMembersPage from "./pages/admin/AdminMembersPage";
import AdminVolunteersPage from "./pages/admin/AdminVolunteersPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminFormsPage from "./pages/admin/AdminFormsPage";
import AdminFormSubmissionsPage from "./pages/admin/AdminFormSubmissionsPage";



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
      document.title = "اتحاد الطلاب اليمنيين في تركيا - فرع إلاذغ";
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
          <Route path="/access" element={<AccessPage />} />

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
              <Route path="forms" element={<AdminFormsPage />} />
              <Route path="forms/:formId/submissions" element={<AdminFormSubmissionsPage />} />
            <Route path="volunteers" element={<AdminVolunteersPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
