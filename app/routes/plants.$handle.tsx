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

  function extractFilename(url: string): string {
    return url.split('/').pop()?.split('?')[0] || '';
  }

  return json.data.files.edges
    .map((edge: any) => {
      const {alt, image} = edge.node;
      const filename = extractFilename(image.url);
      return {
        ...edge.node,
        filename,
        image,
        alt,
      };
    })
    .sort((a, b) => a.filename.localeCompare(b.filename));
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

  const metafieldValues = extractMetafieldValues(
    product.metafields.filter(Boolean) as PlantCriticalMetafield[],
  );

  console.log('metafieldValues:', metafieldValues);

  const {acquisition, measurement, llifleDatabaseLink, wateringFrequency} =
    metafieldValues;

  const parsedAcquisition = JSON.parse(acquisition) as AcquisitionData;

  const parsedMeasurement = JSON.parse(measurement) as MeasurementDataArray;

  const datePlantAcquired = returnFormattedDate(parsedAcquisition.date);

  const dateMeasurementTaken = returnFormattedDate(parsedMeasurement[0].date);

  /**
   * HTML markup starts here
   */

  return (
    <div className="plant-page">
      <div className="grid grid-cols-3 gap-10 relative min-h-screen">
        {/* Render core product info immediately */}
        <div className="col-span-2"></div>
        <div className="col-span-1">
          <div className="flex justify-end">
            <Button size="sm" className="mr-3">
              <Heart />
            </Button>
            <Button size="sm">
              <Share />
            </Button>
          </div>
          <h1 className="text-3xl mb-5 mt-3 font-medium leading-tight max-w-[30ch] text-balance text-[var(--color-fg-green)]">
            {product.title}
          </h1>
          <div className="lg:sticky lg:top-[64px] lg:self-start rounded-md bg-[var(--color-bg-3)] prose prose-p:text-[var(--color-fg-text)] prose-p:text-sm text-base prose-strong:text-[var(--color-fg-green)]">
            <div
              className="prose p-5"
              id="plant-description"
              dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
            />
          </div>
        </div>
      </div>
      <div className="block border border-[var(--color-fg-text)] my-10"></div>
      <div className="">
        <div className="grid grid-cols-3 gap-10">
          <div className="cols-span-1 flex flex-col justify-center">
            <h2 className="text-balance text-5xl font-medium text-[var(--color-fg-green)]">
              {product.title}
            </h2>
            {llifleDatabaseLink && (
              <a
                href={llifleDatabaseLink}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 flex items-center text-[var(--color-fg-text)] hover:text-[var(--color-fg-text-hover)]"
              >
                <span className="inline-flex items-center border-b border-transparent hover:border-current">
                  View species info on LLIFLE
                  <ExternalLink size="16" className="ml-1" />
                </span>
              </a>
            )}
          </div>
          {parsedAcquisition && (
            <div className="col-span-1 rounded-md bg-[var(--color-bg-1)] flex flex-col items-center p-5">
              {parsedAcquisition?.method === 'seed-grown' && (
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-4xl bg-[var(--color-bg-green)] p-1 text-[var(--color-fg-text)] border-[1.5px] border-[var(--color-fg-text)]">
                    <Sprout size={36} />
                  </div>
                  <p className="font-bold text-[var(--color-fg-green)] mt-1">
                    Seed-grown
                  </p>
                  <p className="text-[var(--color-fg-text)]">
                    {datePlantAcquired}
                  </p>
                </div>
              )}
              {parsedAcquisition?.method === 'purchased' && (
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-4xl bg-[var(--color-bg-green)] p-1 text-[var(--color-fg-text)] border-[1.5px] border-[var(--color-fg-text)]">
                    <BadgeDollarSign size={36} />
                  </div>
                  <p className="font-bold text-[var(--color-fg-green)] mt-1">
                    Purchased from
                  </p>
                  <p className="text-[var(--color-fg-text)]">
                    {parsedAcquisition.supplier}
                  </p>
                  <p className="text-[var(--color-fg-text)]">
                    {datePlantAcquired}
                  </p>
                </div>
              )}
              {parsedAcquisition?.method === 'cutting' && (
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-4xl bg-[var(--color-bg-green)] p-1 text-[var(--color-fg-text)] border-[1.5px] border-[var(--color-fg-text)]">
                    <ScissorsLineDashed size={36} />
                  </div>
                  <p className="font-bold text-[var(--color-fg-green)] mt-1">
                    Acquired from a cutting:
                  </p>
                  <p className="text-[var(--color-fg-text)]">
                    {datePlantAcquired}
                  </p>
                </div>
              )}
            </div>
          )}
          {parsedMeasurement && (
            <div className="col-span-1 rounded-md bg-[var(--color-bg-2)] p-5">
              <div className="flex flex-col items-center justify-center">
                <div className="rounded-4xl bg-[var(--color-bg-green)] p-[5px] text-[var(--color-fg-text)] border-[1.5px] border-[var(--color-fg-text)]">
                  <Ruler size={34} />
                </div>
                <p className="font-bold text-[var(--color-fg-green)] mt-1">
                  Measurements
                </p>
                <p className="text-[var(--color-fg-text)]">
                  {parsedMeasurement[0].height} x {parsedMeasurement[0].width}{' '}
                  in a {parsedMeasurement[0].pot}
                </p>
                <p className="text-[var(--color-fg-text)]">
                  {dateMeasurementTaken}
                </p>
              </div>
            </div>
          )}
          <div className="col-span-1 rounded-md bg-[var(--color-bg-3)] p-5">
            <div className="flex flex-col items-center justify-center">
              <div className="relative rounded-4xl bg-[var(--color-bg-green)] p-[7px] text-[var(--color-fg-text)] border-[1.5px] border-[var(--color-fg-text)]">
                <Shovel
                  className="relative left-[1.25px] bottom-[1.25px]"
                  size={30}
                />
              </div>
              <p className="font-bold text-[var(--color-fg-green)] mt-1">
                Soil Mix
              </p>
              <ul className="text-[var(--color-fg-text)] text-center text-pretty">
                <li>8 parts pumice</li>
                <li>1 part calcinated clay</li>
                <li>1 part cactus soil</li>
              </ul>
              <p className="font-bold text-[var(--color-fg-green)] mt-3">
                Top Dressing
              </p>
              <p className="text-[var(--color-fg-text)]"> calcinated clay</p>
            </div>
          </div>
          <div className="col-span-1 rounded-md bg-[var(--color-bg-4)] p-5">
            <div className="flex flex-col items-center justify-center">
              <div className="relative rounded-4xl bg-[var(--color-bg-green)] p-[7px] text-[var(--color-fg-text)] border-[1.5px] border-[var(--color-fg-text)]">
                <Pipette
                  className="relative left-[.25px] bottom-[.25px]"
                  size={30}
                />
              </div>
              <p className="font-bold text-[var(--color-fg-green)] mt-1">
                Fertilizer Regimen{' '}
              </p>
            </div>
            <p className="text-[var(--color-fg-text)] mb-3">
              Mix 67 μL Schultz Cactus Plus (2–2–7), 133 μL Grow More Cactus
              Juice (1–7–6), 133 μL of espom salt stock solution (5 g/30 mL),
              and 30 mg chelated micronutrients per 1 L reverse osmosis water.
            </p>
            <p className="text-[var(--color-fg-text)]">
              Alternate with plain RO water to flush salts.
            </p>
          </div>
          <div className="col-span-1 rounded-md bg-[var(--color-bg-5)] p-5">
            <div className="flex flex-col items-center justify-center">
              <div className="relative rounded-4xl bg-[var(--color-bg-green)] p-[7px] text-[var(--color-fg-text)] border-[1.5px] border-[var(--color-fg-text)]">
                <Leaf
                  className="relative left-[1.25px] bottom-[1.25px]"
                  size={30}
                />
              </div>
              <p className="font-bold text-[var(--color-fg-green)] mt-1">
                Care Regimen
              </p>
              <ul className="text-[var(--color-fg-text)] text-center text-pretty">
                <li>Grown indoors with 24/7 fan circulation</li>
                <li>15 hours of light daily under T5 6500K LEDs</li>
                <li>Deep watered every {wateringFrequency}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Deferred journal entry block — Suspense + Await */}
      <Suspense fallback={<p> Loading journal...</p>}>
        <Await resolve={journalPromise}>
          {/* data is the resolved value of journalPromise */}
          {(data) => {
            // Await gives us the result of journalPromise when it's done
            const metafield = data?.product?.journal;

            let journal: PlantJournalEntry[] = [];

            try {
              // Parse the raw metafield JSON into a JS array
              journal = metafield?.value
                ? (JSON.parse(metafield.value) as PlantJournalEntry[])
                : [];
            } catch (error) {
              console.error('Failed to parse journal JSON:', error);
            }

            // Render parsed journal entries
            return journal.length > 0 ? (
              <div className="mt-5">
                <ul className="journal-entries">
                  {journal.map((entry) => (
                    <li key={entry.date}>
                      <strong>{entry.date}</strong> - {entry.content}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No journal entries yet.</p>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
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
