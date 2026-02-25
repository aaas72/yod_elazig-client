import { useState, useEffect } from 'react';
import { eventsService } from '@/services/eventsService';

export const useEventsData = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    eventsService.getPublished({ limit: 100 })
      .then((res) => {
        let items = Array.isArray(res) ? res : res?.events || res?.data?.events || [];
        if (!cancelled) setEvents(items);
      })
      .catch(() => { if (!cancelled) setEvents([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { events, loading };
};
