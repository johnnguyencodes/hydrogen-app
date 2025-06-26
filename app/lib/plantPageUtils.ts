// app/lib/plantPageUtils.ts

// Month names lookup for consistent formatting
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/**
 * Filters out only those admin images whose URL contains the plant handle.
 */
export function filterPlantImagesByHandle(
  adminImageData: AdminImage[],
  productHandle: string,
): AdminImage[] {
  return adminImageData.filter((img) =>
    img.image?.url?.includes(`plants--${productHandle}`),
  );
}

/**
 * Adds metadata (rawDate, imageType, index) parsed from the filename.
 * Falls back to epoch date if naming doesn't match.
 */
export function addImageMetadata(img: AdminImage): AdminImageWithMetadata {
  const regex = /--(\d{4}-\d{2}-\d{2})--([a-z]+)--(\d{3})\./;
  const match = img.image.url.match(regex);

  if (!match) {
    return {
      ...img,
      meta: {
        rawDate: '1970-01-01',
        imageType: '',
        index: 0,
      },
    };
  }

  const [, rawDate, imageType, indexStr] = match;
  return {
    ...img,
    meta: {
      rawDate,
      imageType,
      index: Number(indexStr),
    },
  };
}

/**
 * Sort by rawDate (newest first), then imageType, then index.
 */
export function sortImagesWithMetadata(
  a: AdminImageWithMetadata,
  b: AdminImageWithMetadata,
): number {
  const aTime = new Date(a.meta.rawDate).getTime();
  const bTime = new Date(b.meta.rawDate).getTime();
  if (bTime !== aTime) return bTime - aTime;

  if (a.meta.imageType !== b.meta.imageType) {
    return a.meta.imageType.localeCompare(b.meta.imageType);
  }

  return a.meta.index - b.meta.index;
}

/**
 * Returns only those images tagged as 'carousel'.
 */
export function returnCarouselImages(
  sortedPlantImages: AdminImageWithMetadata[],
): AdminImageWithMetadata[] {
  return sortedPlantImages.filter((img) => img.meta.imageType === 'carousel');
}

/**
 * Returns the most recent rawDate from the carousel array, or null if empty.
 */
export function getLatestCarouselDate(
  carouselImages: AdminImageWithMetadata[],
): string | null {
  return carouselImages.length > 0 ? carouselImages[0].meta.rawDate : null;
}

/**
 * Returns only the images whose rawDate matches the latest date.
 */
export function getLatestCarouselImages(
  carouselImages: AdminImageWithMetadata[],
  latestCarouselDate: string | null,
): AdminImageWithMetadata[] {
  if (!latestCarouselDate) return [];
  return carouselImages.filter(
    (img) => img.meta.rawDate === latestCarouselDate,
  );
}

/**
 * Converts a YYYY-MM-DD string into "Month D, YYYY".
 */
export function formatYMDToLong(ymd: string): string {
  const [year, month, day] = ymd.split('-');
  const mIndex = Number(month) - 1;
  const monthName = MONTH_NAMES[mIndex] ?? month;
  const d = day.startsWith('0') ? day.slice(1) : day;
  return `${monthName} ${d}, ${year}`;
}

/**
 * Turn a YYYY-MM-DD ISO string into a long format date.
 */
export function returnFormattedDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  const m = Number(month) - 1;
  const d = Number(day);
  const monthName = MONTH_NAMES[m] ?? month;
  return `${monthName} ${d}, ${year}`;
}

/**
 * Pulls out key/value pairs from Shopify metafields into camelCased object.
 */
export function extractMetafieldValues(
  metafields: PlantCriticalMetafield[],
): Record<string, string> {
  return metafields.reduce<Record<string, string>>((acc, mf) => {
    if (mf.key && mf.value != null) {
      const camel = mf.key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      acc[camel] = mf.value;
    }
    return acc;
  }, {});
}
