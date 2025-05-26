import {ProductVariantFragment} from 'storefrontapi.generated';

export {};

declare global {
  interface Window {
    analytics?: {
      track: (event: string, payload?: Record<string, unknown>) => void;
    };
  }

  interface Env {
    FILES_ADMIN_API_ACCESS_TOKEN: string;
    FILES_ADMIN_API_KEY: string;
    FILES_ADMIN_API_SECRET_KEY: string;
  }

  type ProductImageProps = {
    image: ProductVariantFragment['image'];
    key?: string | number;
    alt?: string;
  };

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

  type ShopifyFilesResponse = {
    data: {
      files: {
        edges: Array<{
          node: {
            id: string;
            url: string;
            alt?: string;
            createdAt: string;
          };
        }>;
      };
    };
  };
}
