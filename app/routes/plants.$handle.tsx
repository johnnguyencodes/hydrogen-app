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
  toCamelCase,
} from '~/lib/plantPageUtils';

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
      {namespace: 'plant', key: 'acquired-from'},
      {namespace: 'plant', key: 'llifle-database-link'},
      {namespace: 'plant', key: 'date-brought-home'},
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
 *
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
 * Hydrated client-side after SSR.
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

  const unsortedPlantImages = filterPlantImagesByHandle(
    adminImageData,
    product.handle,
  );

  const sortedPlantImages = unsortedPlantImages
    .map(addImageMetadata)
    .sort(sortImagesWithMetadata);

  const carouselImages = returnCarouselImages(sortedPlantImages);

  const latestCarouselDate = getLatestCarouselDate(carouselImages);

  const latestCarouselImages = getLatestCarouselImages(
    carouselImages,
    latestCarouselDate,
  );

  /**
   * Simple HTML layout showing the plant title and description.
   * Uses Shopify's product.descriptionHtml (trusted, sanitized).
   */

  const metafieldValues = product.metafields.reduce(
    (acc: Record<string, string>, metafield: Record<string, string>) => {
      if (metafield?.key && metafield?.value !== null) {
        const key = toCamelCase(metafield.key);
        acc[key] = metafield.value;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <div className="plant-page">
      {/* Render core product info immediately */}
      <h1>{product.title}</h1>
      <div dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />

      {latestCarouselImages.length > 0 && (
        <div>
          {latestCarouselImages.map((img, index) => (
            <ProductImage
              key={img.id ?? index}
              id={img.id ?? index}
              image={{
                __typename: 'Image',
                url: img.image.url,
              }}
              alt={img.alt || `${product.title} image`}
            />
          ))}
        </div>
      )}

      {/* Display metafields like purchase origin, links, etc. */}
      {Array.isArray(product.metafields) && product.metafields.length > 0 ? (
        product.metafields
          .filter(Boolean)
          .map((field: PlantCriticalMetafield) =>
            field ? (
              <p key={field.key}>
                <strong>{field.key.replace(/-/g, ' ')}:</strong> {field.value}
              </p>
            ) : null,
          )
      ) : (
        <p>No extra details available.</p>
      )}

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
