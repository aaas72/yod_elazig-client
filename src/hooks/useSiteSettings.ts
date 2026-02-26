import { useEffect, useState } from "react";
import { settingsService } from "@/services/settingsService";

export function useSiteSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    settingsService.get()
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "حدث خطأ أثناء جلب الإعدادات");
        setLoading(false);
      });
  }, []);

  return { settings, loading, error };
}
