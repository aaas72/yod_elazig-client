import api from '@/lib/api';

export interface FormField {
  name: string;
  label: { ar: string; en: string; tr: string };
  type: 'text' | 'textarea' | 'number' | 'email' | 'date' | 'select' | 'file';
  required: boolean;
  options?: string[];
  placeholder?: { ar: string; en: string; tr: string };
}

export interface FormItem {
  _id: string;
  title: { ar: string; en: string; tr: string };
  description?: { ar: string; en: string; tr: string };
  slug: string;
  fields: FormField[];
  isActive: boolean;
  createdAt: string;
}

export interface FormSubmission {
  _id: string;
  form: string;
  data: Record<string, any>;
  createdAt: string;
}

export const formsService = {
  // Public
  getBySlug: async (slug: string) => {
    const { data } = await api.get(`/forms/public/${slug}`);
    return data.data.form;
  },

  submit: async (formId: string, submissionData: Record<string, any>) => {
    const { data } = await api.post('/forms/submit', { formId, data: submissionData });
    return data.data.submission;
  },

  // Admin
  getAll: async () => {
    const { data } = await api.get('/forms');
    return data.data.forms;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/forms/${id}`);
    return data.data.form;
  },

  create: async (formData: Partial<FormItem>) => {
    const { data } = await api.post('/forms', formData);
    return data.data.form;
  },

  update: async (id: string, formData: Partial<FormItem>) => {
    const { data } = await api.put(`/forms/${id}`, formData);
    return data.data.form;
  },

  delete: async (id: string) => {
    await api.delete(`/forms/${id}`);
  },

  getSubmissions: async (formId: string) => {
    const { data } = await api.get(`/forms/${formId}/submissions`);
    return data.data.submissions;
  },
};
