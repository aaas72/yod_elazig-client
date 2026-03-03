import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import React from "react";
import { settingsService } from "@/services/settingsService";

interface SiteSettingsContextType {
  settings: any;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: null,
  loading: true,
  error: null,
  refresh: () => {},
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = () => {
    setLoading(true);
    settingsService.get()
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "حدث خطأ أثناء جلب الإعدادات");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return React.createElement(
    SiteSettingsContext.Provider,
    { value: { settings, loading, error, refresh: fetchSettings } },
    children
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
