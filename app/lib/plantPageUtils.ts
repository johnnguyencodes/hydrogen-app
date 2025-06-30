// Each plant image is a Shopify file object. Each object has a .image.url that must be named with the following structure
// `plants--${product.handle}--YYYY-MM-DD--${imageType}--${index}.${fileExtension}`
// For example: plants--mammillaria-crucigera-tlalocii-3--2025-05-25--carousel--001.webp
export function filterPlantImagesByHandle(
  adminImageData: AdminImage[],
  productHandle: string,
) {
  return adminImageData.filter((img) =>
    img.image?.url?.includes(`plants--${productHandle}`),
  );
}

// Since unSortedPlantImages is only concerned about the first two parts of the shopify file object's url,
// the sorting logic will only be concerned about the latter 3 parts of the url:
//   - date
//   - image type
//   - index
// where imageType can be either
//   - carousel
//   - journal
//   - milestone
// fileExtension can be any file type, but in my comments I am assuming all images will be in .webp format.
export function addImageMetadata(img: AdminImage): AdminImageWithMetadata {
  const regex = /--(\d{4}-\d{2}-\d{2})--([a-z]+)--(\d{3})\./;
  const match = img.image.url.match(regex);

  if (!match) {
    return {
      ...img,
      meta: {
        date: new Date(0),
        imageType: '',
        index: 0,
      },
    };
  }

  const [, dateStr, imageType, indexStr] = match;

  return {
    ...img,
    meta: {
      date: new Date(dateStr),
      imageType,
      index: parseInt(indexStr, 10),
    },
  };
}

export function sortImagesWithMetadata(
  a: AdminImageWithMetadata,
  b: AdminImageWithMetadata,
): number {
  const {date: aDate, imageType: aImageType, index: aIndex} = a.meta;
  const {date: bDate, imageType: bImageType, index: bIndex} = b.meta;

  // 1. Sort by date (most recent first)
  const aDateObj = new Date(aDate);
  const bDateObj = new Date(bDate);

  if (bDateObj.getTime() !== aDateObj.getTime()) {
    return bDateObj.getTime() - aDateObj.getTime();
  }

  // 2. Sort by imageType alphabetically
  if (aImageType !== bImageType) {
    return aImageType.localeCompare(bImageType);
  }

  // 3. Sort by index from lowest to highest
  return aIndex - bIndex;
}

// This function maps through all the plant images and uses regex to find a file match
// If there is a match, enter metadata based on the regex match
// If there isn't a match, use general defaults as fallback for metadata
export function returnCarouselImages(
  sortedPlantImages: AdminImageWithMetadata[],
) {
  return sortedPlantImages.filter((img) => img.meta?.imageType === 'carousel');
}

export function getLatestCarouselDate(
  carouselImages: AdminImageWithMetadata[],
) {
  const carouselImageDateObj = new Date(carouselImages[0].meta.date);

  return carouselImages.length > 0
    ? carouselImageDateObj.toISOString().split('T')[0]
    : null;
}

export function getLatestCarouselImages(
  carouselImages: AdminImageWithMetadata[],
  latestCarouselDate: string | null,
) {
  if (!latestCarouselDate) return [];
  return carouselImages.filter(
    (img) => getISODate(img.meta.date) === latestCarouselDate,
  );
}

function getISODate(date: Date | string) {
  return new Date(date).toISOString().split('T')[0];
}

export function extractMetafieldValues(
  metafields: PlantCriticalMetafield[],
): Record<string, string> {
  return metafields.reduce(
    (acc: Record<string, string>, metafield: Record<string, string>) => {
      if (metafield?.key && metafield.value !== null) {
        const key = toCamelCase(metafield.key);
        acc[key] = metafield.value;
      }
      return acc;
    },
    {},
  );
}

export function returnFormattedDate(dateBroughtHome: string): string {
  const [year, month, day] = dateBroughtHome.split('-').map(Number);

  // Month is 0-based in JS Date
  const modifiedDateBroughtHome = new Date(year, month - 1, day);

  const formattedDate = modifiedDateBroughtHome.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return formattedDate;
}

function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}
