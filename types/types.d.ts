export {};

declare global {
  interface Window {
    analytics?: {
      track: (event: string, payload?: Record<string, unknown>) => void;
    };
    gtag?: (...args: any[]) => void;
    dataLayer: unknown[];
  }
}
