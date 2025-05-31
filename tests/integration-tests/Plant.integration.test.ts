import {describe, it, expect} from 'vitest';
import {
  filterPlantImagesByHandle,
  addImageMetadata,
  sortImagesWithMetadata,
  returnCarouselImages,
  getLatestCarouselDate,
  getLatestCarouselImages,
  extractMetafieldValues,
} from '../../app/lib/plantPageUtils';

describe('Plant Image Integration Flow', () => {
  const productHandle = 'mammillaria-crucigera-tlalocii-3';

  const adminImageData = [
    {
      id: '1',
      alt: 'first image',
      image: {
        url: 'plants--mammillaria-crucigera-tlalocii-3--2025-05-25--carousel--001.webp',
      },
    },
    {
      id: '2',
      alt: 'second image',
      image: {
        url: 'plants--mammillaria-crucigera-tlalocii-3--2025-05-25--carousel--002.webp',
      },
    },
    {
      id: '3',
      alt: 'milestone image',
      image: {
        url: 'plants--mammillaria-crucigera-tlalocii-3--2025-04-20--milestone--001.webp',
      },
    },
    {
      id: '4',
      alt: 'other product',
      image: {
        url: 'plants--other-product--2025-05-25--carousel--001.webp',
      },
    },
  ];

  const metafields = [
    {
      namespace: 'plant',
      key: 'acquired-from',
      value: 'https://example.com',
      type: 'single_line_text_field',
    },
    {
      namespace: 'plant',
      key: 'llifle-database-link',
      value: 'https://llifle.com',
      type: 'single_line_text_field',
    },
  ];

  it('runs the full integration flow', () => {
    const filtered = filterPlantImagesByHandle(adminImageData, productHandle);
    expect(filtered.length).toBe(3);

    const withMetadata = filtered.map(addImageMetadata);
    expect(withMetadata.every((img) => img.meta)).toBe(true);

    const sorted = withMetadata.sort(sortImagesWithMetadata);
    expect(sorted[0].meta.date >= sorted[1].meta.date).toBe(true);

    const carouselImages = returnCarouselImages(sorted);
    expect(
      carouselImages.every((img) => img.meta.imageType === 'carousel'),
    ).toBe(true);

    const latestDate = getLatestCarouselDate(carouselImages);
    expect(latestDate).toBe('2025-05-25');

    const latestImages = getLatestCarouselImages(carouselImages, latestDate);
    expect(latestImages.length).toBe(2);

    const metaValues = extractMetafieldValues(metafields);
    expect(metaValues.acquiredFrom).toBe('https://example.com');
    expect(metaValues.llifleDatabaseLink).toBe('https://llifle.com');
  });
});
