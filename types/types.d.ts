export {};

declare global {
  interface Window {
    analytics?: {
      track: (event: string, payload?: Record<string, unknown>) => void;
    };
  }

  // Type definition for individual journal entries
  type PlantJournalEntry = {
    date: string;
    title: string;
    content: string;
    image?: string | null;
  };

  type PlantCriticalMetafield = {
    namespace: string;
    key: string;
    value: string;
    type: string;
  };
}
