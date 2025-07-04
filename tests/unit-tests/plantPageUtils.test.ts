import {describe, it, expect} from 'vitest';
import {
  returnCarouselImages,
  getLatestCarouselDate,
  getLatestCarouselImages,
  extractMetafieldValues,
} from '../../app/lib/plantPageUtils';

describe('returnCarouselImages', () => {
  it('returns only images with imageType "carousel"', () => {
    const data = [
      {
        alt: 'carousel',
        image: {
          url: 'image-1.webp',
          width: 2716,
          height: 2716,
        },
        meta: {
          category: 'carousel',
          date: '2025-05-25',
          index: 0,
          ext: 'webp',
        },
      },
      {
        alt: 'journal',
        image: {
          url: 'image-2.webp',
          width: 2716,
          height: 2716,
        },
        meta: {
          category: 'journal',
          date: '2025-01-12',
          index: 1,
          ext: 'webp',
        },
      },
    ];
    const result = returnCarouselImages(data);
    expect(result).toHaveLength(1);
    expect(result[0].meta.index).toBe(0);
  });
});

describe('getLatestCarouselDate', () => {
  it('returns the date string of the most recent image', () => {
    const data = [
      {
        alt: 'carousel',
        image: {
          url: 'image-1.webp',
          width: 2716,
          height: 2716,
        },
        meta: {
          category: 'carousel',
          date: '2025-05-25',
          index: 0,
          ext: 'webp',
        },
      },
      {
        alt: 'journal',
        image: {
          url: 'image-2.webp',
          width: 2716,
          height: 2716,
        },
        meta: {
          category: 'journal',
          date: '2025-01-12',
          index: 1,
          ext: 'webp',
        },
      },
    ];
    const result = getLatestCarouselDate(data);
    expect(result).toBe('2025-05-25');
  });
});

describe('getLatestCarouselImages', () => {
  it('filters images that have the latest date', () => {
    const data = [
      {
        alt: 'carousel',
        image: {
          url: 'image-1.webp',
          width: 2716,
          height: 2716,
        },
        meta: {
          category: 'carousel',
          date: '2025-05-25',
          index: 0,
          ext: 'webp',
        },
      },
      {
        alt: 'carousel',
        image: {
          url: 'image-1.webp',
          width: 2716,
          height: 2716,
        },
        meta: {
          category: 'carousel',
          date: '2025-05-25',
          index: 1,
          ext: 'webp',
        },
      },
      {
        alt: 'carousel',
        image: {
          url: 'image-1.webp',
          width: 2716,
          height: 2716,
        },
        meta: {
          category: 'carousel',
          date: '2025-01-12',
          index: 0,
          ext: 'webp',
        },
      },
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
