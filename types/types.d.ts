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
    width: number;
    height: number;
    sizes: string;
  };

  type AcquisitionData = {
    method: string;
    pText: string;
    aHref: string;
    aText: string;
    date: string;
  };

  type MeasurementData = {
    height: string;
    width: string;
    pot: string;
    date: string;
  };

  type MeasurementDataArray = MeasurementData[];

  type PlantPageSpecsProps = {
    productTitle: string;
    llifleDatabaseLink: string;
    parsedAcquisition: AcquisitionData;
    datePlantAcquired: string;
    parsedMeasurement: MeasurementDataArray;
    dateMeasurementTaken: string;
    wateringFrequency: string;
  };

  type JournalEntry = {
    date: string;
    title: string;
    content: string;
    journalType: string;
  };

  type ImageGalleryItem = {
    original: string;
    gallery: string;
    thumbnail: string;
  };

  type ImageGalleryArray = ImageGalleryItem[];

  type PlantPageTitleProps = {
    productTitle: string;
  };

  type PlantPageDescriptionProps = {
    modifiedProductDescription: string;
  };

  type CarouselImagesProps = {
    images: AdminImageWithMetadata[];
    productTitle: string;
    width: number;
    height: number;
  };

  type PlantPageJournalComponentProps = {
    journalPromise: Promise<PlantJournalQuery & StoreFrontError>;
    parsedImageData: AdminImageWithMetadata[];
    productTitle: string;
    latestCarouselDateString: string;
    thumbnailImageWidth: number;
    thumbnailImageHeight: number;
    sizes: string;
    fancyboxRef: any;
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
    width: number;
    height: number;
    setImageGalleryStartIndex: React.Dispatch<React.SetStateAction<number>>;
    imageGalleryStartIndex: number;
    sizes: string;
    backgroundColor: number;
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
            alt: string;
            createdAt: string;
          };
        }>;
      };
    };
  };

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
