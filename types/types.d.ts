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

  type AdminImage = {
    id: string;
    alt: string;
    image: {
      url: string;
    };
  };

  type AdminImageWithMetadata = AdminImage & {
    meta: {
      date: Date;
      imageType: string;
      index: number;
    };
  };

  type ProductImageProps = {
    image: ProductVariantFragment['image'];
    key: string | number;
    alt: string;
    id: string;
    className?: string;
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

  type AcquisitionData =
    | {method: 'seed-grown'; date: string}
    | {method: 'cutting'; date: string}
    | {method: 'purchased'; supplier: string; date: string};

  type MeasurementData = {
    height: string;
    width: string;
    pot: string;
    date: string;
  };

  type MeasurementDataArray = MeasurementData[];

  type ShopifyFilesResponse = {
    data: {
      files: {
        edges: Array<{
          node: {
            id: string;
            url: string;
            alt: string;
            createdAt: string;
          };
        }>;
      };
    };
  };

  interface AdminImageWithMetadata {
    alt: string;
    image: {url: string};
    meta: {
      date: string; // e.g. "YYYY-MM-DD"
      imageType: string;
      index: number;
    };
  }
}
