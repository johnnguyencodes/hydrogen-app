// React and Remix imports
import {Suspense, useEffect} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {ProductImage} from '~/components/ProductImage';
import {
  filterPlantImagesByHandle,
  addImageMetadata,
  sortImagesWithMetadata,
  returnCarouselImages,
  getLatestCarouselDate,
  getLatestCarouselImages,
  extractMetafieldValues,
  returnFormattedDate,
} from '~/lib/plantPageUtils';
import {Button} from '~/components/ui/button';
import {
  Heart,
  Share,
  ExternalLink,
  Sprout,
  BadgeDollarSign,
  ScissorsLineDashed,
  Ruler,
  Shovel,
  Pipette,
  Leaf,
} from 'lucide-react';

// =========================
// Loader Function
// =========================

/**
 * Remix runs this loader on the server before rendering the page.
 * We split data loading into critical (needed to render the page)
 * and deferred (optional, loaded later if needed).
 */
export async function loader(args: LoaderFunctionArgs) {
  const criticalData = await loadCriticalData(args); // Must-have data, required immediately to render
  const deferredData = loadDeferredData(args); // Optional data, can be loaded in parallel

  // Return both, including the deferred data wrapped as a promise
  return {
    ...criticalData,
    journalPromise: deferredData.journalPromise,
  };
}

/**
 * Critical data loader: fetches the Shopify product and core metafields.
 * If the product doesn't exist, throw a 404.
 */
async function loadCriticalData(args: LoaderFunctionArgs) {
  const {context, params} = args;
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const variables = {
    handle,
    metafieldIdentifiers: [
      {namespace: 'plant', key: 'llifle-database-link'},
      // Metafield definition
      // Namespace and key: "plant.acquisition"
      // Data type: JSON
      // Examples:
      //
      //   {
      //     "method": "seed-grown",
      //     "date": "2025-01-01"
      //   }
      //
      //  OR
      //
      // {
      //   "method": "purchased",
      //   "supplier": "Cactus exchange community on Reddit",
      //   "date": "2025-01-01"
      // }
      //
      // OR
      //
      //   {
      //     "method": "cutting",
      //     "date": "2025-01-01"
      //   }
      {namespace: 'plant', key: 'acquisition'},
      // Metafield definition
      // Namespace and key: "plant.measurement"
      // Data type: JSON
      // Examples:
      //
      // [{
      //   "height": "24 cm",
      //    "width": "24 cm",
      //    "pot": "2.5 in/\" plastic pot",
      //    "date": "2025-01-01"
      //  }]
      {namespace: 'plant', key: 'measurement'},
      {namespace: 'plant', key: 'watering-frequency'},
      {namespace: 'plant', key: 'growth-notes'},
      {namespace: 'plant', key: 'care-routine'},
    ],
  };

  // Shopify storefront query using product handle
  const [{product}, adminImageData] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {variables}),
    fetchImagesFromAdminAPI(args),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return {product, adminImageData};
}

/**
 * async function to fetch files uploaded to the Shopify store under Content > Files in the admin panel
 */

async function fetchImagesFromAdminAPI({context}: LoaderFunctionArgs) {
  const ADMIN_API_URL = `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/2025-04/graphql.json`;
  const response = await fetch(ADMIN_API_URL, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': context.env.FILES_ADMIN_API_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query Files {
          files(first: 100) {
            edges {
              node {
                ... on MediaImage {
                  id
                  alt
                  image {
                    url
                  }
                }
              }  
            }
          }
        }
      `,
    }),
  });

  const json = (await response.json()) as ShopifyFilesResponse;

  return json.data.files.edges.map((edge: any) => edge.node);
}

/**
 * Load data that is *optional* and can be deferred initial render.
 * This runs in parallel with `loadCriticalData`, and will be awaited by <Await />.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected handle to be defined in loadDeferredData');
  }

  const queryOptions = {
    variables: {
      handle,
    },
  };

  const journalPromise = storefront.query(JOURNAL_QUERY, queryOptions);

  const carouselCopyPromise = storefront.query(
    CAROUSEL_COPY_QUERY,
    queryOptions,
  );

  return {journalPromise, carouselCopyPromise};
}

// =========================
// React Component
// =========================

/**
 * Hydrated on the client after server-side rendering.
 * Uses the `product` returned from the loader.
 *
 * The component receives the critical product data and deferred journalPromise from useLoaderData().
 * Hydrated client-side after SSR
 */

export default function Plant() {
  const {product, adminImageData, journalPromise} =
    useLoaderData<typeof loader>();

  /**
   * Analytics: track page view when the plant page is viewed.
   * Uses window.analytics.track() if available; logs fallback if not.
   */
  useEffect(() => {
    if (typeof window !== 'undefined' && window?.analytics?.track) {
      window.analytics.track('plant_view', {
        id: product.id,
        title: product.title,
      });
    } else {
      console.warn('[Analytics Fallback] plant_view', {
        id: product.id,
        title: product.title,
      });
    }
  }, [product.id, product.title]);

  /**
   * Manipulating data from critical loader to be usable on the page
   */

  // const unsortedPlantImages = filterPlantImagesByHandle(
  //   adminImageData,
  //   product.handle,
  // );

  // const sortedPlantImages = unsortedPlantImages
  //   .map(addImageMetadata)
  //   .sort(sortImagesWithMetadata);

  // const carouselImages = returnCarouselImages(sortedPlantImages);

  // const latestCarouselDateString = getLatestCarouselDate(
  //   carouselImages,
  // ) as string;

  // const carouselImagesDate = new Date(latestCarouselDateString);

  // const formattedCarousalImagesDate = carouselImagesDate.toLocaleString(
  //   'en-US',
  //   {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //   },
  // );

  // const additonalDescription = `<p class="p1">(Plant photos taken on ${formattedCarousalImagesDate})`;

  // const modifiedProductDescription =
  //   product.descriptionHtml + additonalDescription;

  // const latestCarouselImages = getLatestCarouselImages(
  //   carouselImages,
  //   latestCarouselDateString,
  // );

  // const metafieldValues = extractMetafieldValues(
  //   product.metafields.filter(Boolean) as PlantCriticalMetafield[],
  // );

  // console.log('metafieldValues:', metafieldValues);

  // const {acquisition, measurement, llifleDatabaseLink, wateringFrequency} =
  //   metafieldValues;

  // const parsedAcquisition = JSON.parse(acquisition) as AcquisitionData;

  // const parsedMeasurement = JSON.parse(measurement) as MeasurementDataArray;

  // const datePlantAcquired = returnFormattedDate(parsedAcquisition.date);

  // const dateMeasurementTaken = returnFormattedDate(parsedMeasurement[0].date);

  /**
   * HTML markup starts here
   */

  return <div className="plant-page"></div>;
}

// =========================
// GraphQL Definitions
// =========================

/**
 * Critical product data with specific metafields defined in loadCriticalData
 */
const PRODUCT_QUERY = `#graphql
  query PlantProduct($handle: String!, $metafieldIdentifiers: [HasMetafieldsIdentifier!]!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      images(first: 1) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      metafields(identifiers: $metafieldIdentifiers) {
        namespace
        key
        value
        type
      }
    }
  }
` as const;

/**
 * Deferred journal query — fetches only the journal metafield by key.
 * This is different from how the metafield query is structured in the PRODUCT_QUERY because we are only querying for one singula
 * metafield, so this can be directly defined in the graphql query.
 */
const JOURNAL_QUERY = `#graphql
  query PlantJournal($handle: String!) {
    product(handle: $handle) {
      journal: metafield(namespace: "plant", key: "journal") {
        namespace
        key
        value
        type
      }
    }
  }
` as const;

const CAROUSEL_COPY_QUERY = `#graphql
  query PlantCarouselCopy($handle: String!) {
    product(handle: $handle) {
      journal: metafield(namespace: "plant", key: "carousel-copy") {
        namespace
        key
        value
        type
      }
    }
  }
` as const;
