import React, { ReactNode } from "react";
import NavBar from "../components/ui/NavBar";
import Footer from "../components/ui/Sections/FooterSection";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
