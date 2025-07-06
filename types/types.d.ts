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
    FILES_ADMIN_API_VERSION: string;
  }

  export interface FilesResponse {
    files: {
      edges: Array<{
        node: {
          alt: string;
          url?: string;
          image?: {
            url: string;
            width: number;
            height: number;
          };
          duration?: number;
          preview?: {
            status: string;
            image: {
              url: string;
              width: number;
              height: number;
            };
          };
          originalSource?: {
            url: string;
            width: number;
            height: number;
            format: string;
            mimeType: string;
          };
          sources?: Array<{
            url: string;
            width?: number;
            height?: number;
            format: string;
            mimeType: string;
          }>;
        };
      }>;
    };
  }

  export type AdminFile = FilesResponse['files']['edges'][number]['node'];

  type AdminImage = {
    alt: string;
    image: {
      url: string;
    };
  };

  type AdminImageWithMetadata = AdminFile & {
    meta: {
      category: string;
      date: string;
      index: number;
      ext: string;
    };
  };

  type ProductImageProps = {
    image: ProductVariantFragment['image'];
    key: string | number;
    alt: string;
    id: string;
    className?: string;
  };

  type JournalEntry = {
    date: string;
    title: string;
    content: string;
    journalType: string;
  };

  type ImageGalleryItem = {
    original: string;
    thumbnail: string;
  };

  type ImageGalleryArray = ImageGalleryItem[];

  type ImageGalleryComponentProps = {
    images: imageGalleryItem[];
    // index: number;
    // setImageGalleryArray: React.Dispatch<
    //   React.SetStateAction<imageGalleryArray>
    // >;
    // setIsImageGalleryVisible: React.Dispatch<React.SetStateAction<boolean>>;
    // isImageGalleryVisible: boolean;
    handleImageGalleryClick: () => void;
  };

  type CarouselImagesProps = {
    handleImageGalleryClick: () => void;
    images: AdminImageWithMetadata[];
    productTitle: string;
    setImageGalleryArray: React.Dispatch<
      React.SetStateAction<imageGalleryArray>
    >;
    setIsImageGalleryVisible: React.Dispatch<React.SetStateAction<boolean>>;
    isImageGalleryVisible: boolean;
  };

  type JournalEntryComponentProps = {
    entry: JournalEntry;
    key: string;
    parsedImageData: AdminImageWithMetadata[];
    productTitle: string;
    latestCarouselDateString: string;
    setImageGalleryArray: React.Dispatch<
      React.SetStateAction<imageGalleryArray>
    >;
    setIsImageGalleryVisible: React.Dispatch<React.SetStateAction<boolean>>;
    isImageGalleryVisible: boolean;
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

  type AdminResponse = any | null;

  type AdminAPIResponse = {
    errors: Error[] | null;
    data: object | null;
  };

  type AdminClient = (
    query: string | null,
    options: {variables: object | null},
  ) => Promise<AdminResponse>;
}
