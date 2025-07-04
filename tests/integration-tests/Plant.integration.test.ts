import {describe, it, expect} from 'vitest';
import {
  returnCarouselImages,
  getLatestCarouselDate,
  getLatestCarouselImages,
  extractMetafieldValues,
} from '../../app/lib/plantPageUtils';

describe('Plant Image Integration Flow', () => {
  const mediaData = [
    {
      alt: 'plants--pseudolithos-migiurtinus--2025-07-03--carousel--000.mp4',
      duration: 60000,
      preview: {
        status: 'READY',
        image: {
          url: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/preview_images/7a7b13c6479141508e33a2f0d29c4457.thumbnail.0000000000.jpg?v=1751583644',
          width: 640,
          height: 360,
        },
      },
      originalSource: {
        url: 'https://cdn.shopify.com/videos/c/o/v/7a7b13c6479141508e33a2f0d29c4457.mp4',
        width: 640,
        height: 360,
        format: 'mp4',
        mimeType: 'video/mp4',
      },
      sources: [
        {
          url: 'https://cdn.shopify.com/videos/c/vp/7a7b13c6479141508e33a2f0d29c4457/7a7b13c6479141508e33a2f0d29c4457.SD-480p-0.9Mbps-50540213.mp4',
          width: 852,
          height: 480,
          format: 'mp4',
          mimeType: 'video/mp4',
        },
      ],
      meta: {
        category: 'carousel',
        date: '2025-05-25',
        index: 0,
        ext: 'mp4',
      },
    },
    {
      alt: 'this is a gif',
      image: {
        url: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/plants--pseudolithos-migiurtinus--2025-07-03--journal--000.gif?v=1751576530',
        width: 640,
        height: 640,
      },
      meta: {
        category: 'journal',
        date: '2025-07-03',
        index: 1,
        ext: 'gif',
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
        index: 2,
        ext: 'webp',
      },
    },
    {
      alt: 'carousel',
      image: {
        url: 'image-3.webp',
        width: 2716,
        height: 2716,
      },
      meta: {
        category: 'carousel',
        date: '2025-01-12',
        index: 3,
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
        index: 4,
        ext: 'webp',
      },
    },
    {
      alt: '',
      sources: [
        {
          url: 'https://cdn.shopify.com/3d/models/o/7dfc40dd9ad0a191/plants--pseudolithos-migiurtinus--2024-12-08--model--000.glb',
          format: 'glb',
          mimeType: 'model/gltf-binary',
        },
        {
          url: 'https://cdn.shopify.com/3d/models/o/da6e8f432fc4e7c0/plants--pseudolithos-migiurtinus--2024-12-08--model--000.usdz',
          format: 'usdz',
          mimeType: 'model/vnd.usdz+zip',
        },
      ],
      meta: {
        category: 'model',
        date: '2024-12-08',
        index: 5,
        ext: 'glb',
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
    const carouselImages = returnCarouselImages(mediaData);
    expect(
      carouselImages.every((img) => img.meta.category === 'carousel'),
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
