"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";

interface ContactFormProps {
  lang: Locale;
  formData: {
    title: string;
    fields: {
      name: { label: string; placeholder: string };
      email: { label: string; placeholder: string };
      subject: { label: string; placeholder: string };
      message: { label: string; placeholder: string };
    };
    submit: string;
    success: string;
    error: string;
  };
}

export default function ContactForm({ lang, formData }: ContactFormProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setFormState({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 p-8 rounded-2xl text-center">
        <div className="text-5xl mb-4">✓</div>
        <p className="text-green-800 font-bold text-lg">
          {formData.success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {formData.fields.name.label}
        </label>
        <input
          type="text"
          required
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          placeholder={formData.fields.name.placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {formData.fields.email.label}
        </label>
        <input
          type="email"
          required
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
          placeholder={formData.fields.email.placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
          dir="ltr"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {formData.fields.subject.label}
        </label>
        <input
          type="text"
          required
          value={formState.subject}
          onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
          placeholder={formData.fields.subject.placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {formData.fields.message.label}
        </label>
        <textarea
          required
          rows={5}
          value={formState.message}
          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
          placeholder={formData.fields.message.placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm">{formData.error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-red-700 text-white py-3 px-6 rounded-xl font-bold hover:bg-red-800 transition-colors disabled:opacity-50"
      >
        {formData.submit}
      </button>
    </form>
  );
}
