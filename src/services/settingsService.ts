import api from '@/lib/api';

export const settingsService = {
  get: async () => {
    const { data } = await api.get('/settings');
    return data.data.settings;
  },

  update: async (settingsData: Record<string, unknown>) => {
    const { data } = await api.put('/settings', settingsData);
    return data.data.settings;
  },
};
