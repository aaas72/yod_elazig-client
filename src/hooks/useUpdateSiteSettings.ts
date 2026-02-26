import { useState } from "react";
import { settingsService } from "@/services/settingsService";

export function useUpdateSiteSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateSettings = async (newSettings: Record<string, any>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await settingsService.update(newSettings);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "فشل تحديث الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  return { updateSettings, loading, error, success };
}
