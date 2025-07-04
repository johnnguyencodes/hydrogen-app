// This function maps through all the plant images and uses regex to find a file match
// If there is a match, enter metadata based on the regex match
// If there isn't a match, use general defaults as fallback for metadata

export function returnCarouselImages(images: AdminImageWithMetadata[]) {
  return images.filter((image) => image.meta.category === 'carousel');
}

export function getLatestCarouselDate(
  carouselImages: AdminImageWithMetadata[],
): string | null {
  if (carouselImages.length === 0) return null;

  return carouselImages.reduce((latest, img) => {
    return img.meta.date > latest ? img.meta.date : latest;
  }, carouselImages[0].meta.date);
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
