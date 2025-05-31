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

describe('filterPlantImagesByHandle', () => {
  it('filters images by matching product handle', () => {
    const data = [
      {
        id: '1',
        alt: '',
        image: {url: 'plants--mammillaria--2025-01-01--carousel--001.webp'},
      },
      {id: '2', alt: '', image: {url: 'other--not-a-match--image.webp'}},
    ];
    const result = filterPlantImagesByHandle(data, 'mammillaria');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});

describe('addImageMetadata', () => {
  it('adds metadata for correctly structured filenames', () => {
    const img = {
      id: '1',
      alt: '',
      image: {url: 'plants--x--2025-01-01--carousel--001.webp'},
    };
    const result = addImageMetadata(img);
    expect(result.meta.imageType).toBe('carousel');
    expect(result.meta.index).toBe(1);
    expect(result.meta.date).toBeInstanceOf(Date);
  });

  it('uses fallback metadata for malformed filenames', () => {
    const img = {id: '2', alt: '', image: {url: 'invalid-url.webp'}};
    const result = addImageMetadata(img);
    expect(result.meta.imageType).toBe('');
    expect(result.meta.index).toBe(0);
  });
});

describe('sortImagesWithMetadata', () => {
  it('sorts by date, then type, then index', () => {
    const a = addImageMetadata({
      id: '1',
      alt: '',
      image: {url: 'plants--x--2025-01-01--carousel--001.webp'},
    });
    const b = addImageMetadata({
      id: '2',
      alt: '',
      image: {url: 'plants--x--2024-01-01--journal--002.webp'},
    });
    const c = addImageMetadata({
      id: '3',
      alt: '',
      image: {url: 'plants--x--2025-01-01--journal--001.webp'},
    });

    const sorted = [b, c, a].sort(sortImagesWithMetadata);
    expect(sorted[0].id).toBe('1');
  });
});

describe('returnCarouselImages', () => {
  it('returns only images with imageType "carousel"', () => {
    const data = [
      addImageMetadata({
        id: '1',
        alt: '',
        image: {url: 'plants--x--2025-01-01--carousel--001.webp'},
      }),
      addImageMetadata({
        id: '2',
        alt: '',
        image: {url: 'plants--x--2025-01-01--journal--001.webp'},
      }),
    ];
    const result = returnCarouselImages(data);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});

describe('getLatestCarouselDate', () => {
  it('returns the ISO date string of the most recent image', () => {
    const data = [
      addImageMetadata({
        id: '1',
        alt: '',
        image: {url: 'plants--x--2025-05-25--carousel--001.webp'},
      }),
      addImageMetadata({
        id: '2',
        alt: '',
        image: {url: 'plants--x--2025-01-12--carousel--001.webp'},
      }),
    ];
    const result = getLatestCarouselDate(data);
    expect(result).toBe('2025-05-25');
  });
});

describe('getLatestCarouselImages', () => {
  it('filters to images matching the latest date', () => {
    const data = [
      addImageMetadata({
        id: '1',
        alt: '',
        image: {url: 'plants--x--2025-05-25--carousel--001.webp'},
      }),
      addImageMetadata({
        id: '2',
        alt: '',
        image: {url: 'plants--x--2025-05-25--carousel--002.webp'},
      }),
      addImageMetadata({
        id: '3',
        alt: '',
        image: {url: 'plants--x--2025-01-12--carousel--001.webp'},
      }),
    ];
    const latestDate = getLatestCarouselDate(data);
    const result = getLatestCarouselImages(data, latestDate);
    expect(result).toHaveLength(2);
  });
});

describe('extractMetafieldValues', () => {
  it('maps and camelCases valid metafields', () => {
    const fields = [
      {key: 'purchase-origin', value: 'web', namespace: '', type: ''},
      {key: 'llifle-database-link', value: 'url', namespace: '', type: ''},
    ];
    const result = extractMetafieldValues(fields);
    expect(result).toEqual({
      purchaseOrigin: 'web',
      llifleDatabaseLink: 'url',
    });
  });
});
