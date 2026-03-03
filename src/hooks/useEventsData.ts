import { useState, useEffect } from 'react';
import { eventsService } from '@/services/eventsService';

export const useEventsData = (limit = 100) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    eventsService.getPublished({ limit })
      .then((res) => {
        let items = Array.isArray(res) ? res : res?.events || res?.data?.events || [];
        if (!cancelled) setEvents(items);
      })
      .catch(() => { if (!cancelled) setEvents([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [limit]);

  return { events, loading };
};
