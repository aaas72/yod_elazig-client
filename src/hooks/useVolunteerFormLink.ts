import { useEffect, useState } from "react";
import { settingsService } from "@/services/settingsService";

export function useVolunteerFormLink() {
  const [formLink, setFormLink] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    settingsService
      .get()
      .then((settings) => {
        console.log('Returned settings from API:', settings);
        setFormLink(settings?.volunteerFormLink || undefined);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "حدث خطأ أثناء جلب الرابط");
        setLoading(false);
      });
  }, []);

  return { formLink, loading, error };
}
