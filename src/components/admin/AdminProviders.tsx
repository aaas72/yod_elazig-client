"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { SiteSettingsProvider } from "@/hooks/useSiteSettings";
import { Toaster } from "react-hot-toast";

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
      {children}
      </SiteSettingsProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            direction: 'rtl',
          },
        }}
      />
    </AuthProvider>
  );
}
