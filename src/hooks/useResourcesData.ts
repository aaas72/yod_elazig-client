'use client';

// Static resources data structure.
// JSON locale files do not exist in Next.js; components should use the i18n translation system instead.
// This hook returns an empty object as a fallback. Populate via the Next.js locales/translation.json files.

export const useResourcesData = () => {
  return {} as Record<string, any>;
};
