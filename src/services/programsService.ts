import api from '@/lib/api';

export interface I18nText {
  ar: string;
  en: string;
  tr: string;
}

export interface ProgramItem {
  _id: string;
  title: I18nText;
  slug: string;
  description: I18nText;
  summary?: I18nText;
  startDate: string;
  endDate?: string;
  location?: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  author: { _id: string; name: string };
  status: 'upcoming' | 'ongoing' | 'completed';
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export const programsService = {

  getPublished: async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await api.get('/programs', { params });
    return data.data;
  },


  getBySlug: async (slug: string) => {
    const { data } = await api.get(`/programs/slug/${slug}`);
    return data.data.program;
  },


  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    try {
      const { data } = await api.get('/programs/admin', { params });
      console.log("API Response Data:", data); // Debugging: Log the API response data
      return data.data;
    } catch (error) {
      console.error("Error fetching all programs:", error);
      throw error;
    }
  },


  getAllForUsers: async (params?: { page?: number; limit?: number; search?: string }) => {
    try {
      const { data } = await api.get('/programs', { params }); // Use the public endpoint for users
      console.log("API Response Data for Users:", data); // Debugging: Log the API response data for users
      return data.data.data || []; // Return only the array of programs
    } catch (error) {
      console.error("Error fetching programs for users:", error);
      throw error;
    }
  },


  getAllForAdmin: async (params?: { page?: number; limit?: number; search?: string }) => {
    try {
      const { data } = await api.get('/programs/admin', { params }); // Use the admin endpoint for fetching programs
      console.log("API Response Data for Admin:", data); // Debugging: Log the API response data for admin
      return data.data;
    } catch (error) {
      console.error("Error fetching programs for admin:", error);
      throw error;
    }
  },


  getById: async (id: string) => {
    const { data } = await api.get(`/programs/${id}`);
    return data.data.program;
  },


  create: async (programData: Partial<ProgramItem>) => {
    // Ensure required fields are populated with default values if missing
    const requestBody = {
      title: {
        ar: programData.title?.ar || "Default Arabic Title",
        en: programData.title?.en || "Default English Title",
        tr: programData.title?.tr || "Default Turkish Title",
      },
      description: {
        ar: programData.description?.ar || "Default Arabic Description",
        en: programData.description?.en || "Default English Description",
        tr: programData.description?.tr || "Default Turkish Description",
      },
      startDate: programData.startDate || new Date().toISOString(),
      endDate: programData.endDate || null,
      location: programData.location || "Default Location",
      category: programData.category || "",
      tags: Array.isArray(programData.tags) ? programData.tags : [],
      coverImage: programData.coverImage || "",
      isPublished: typeof programData.isPublished === "boolean" ? programData.isPublished : false,
    };

    console.log("Request Body:", requestBody); // Debugging: Log the request body before sending the request

    try {
      const response = await api.post('/programs', requestBody);
      return response.data;
    } catch (error) {
      console.error("Error creating program:", error);
      throw error;
    }
  },


  update: async (id: string, programData: Partial<ProgramItem>) => {
    const { data } = await api.put(`/programs/${id}`, programData);
    return data.data.program;
  },


  delete: async (id: string) => {
    await api.delete(`/programs/${id}`);
  },


  togglePublish: async (id: string) => {
    const { data } = await api.patch(`/programs/${id}/toggle-publish`);
    return data.data.program;
  },
};
