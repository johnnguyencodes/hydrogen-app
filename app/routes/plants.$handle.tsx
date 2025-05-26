// React and Remix imports
import {Suspense, useEffect} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {ProductImage} from '~/components/ProductImage';

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
      {namespace: 'plant', key: 'purchase-origin'},
      {namespace: 'plant', key: 'llifle-link'},
      {namespace: 'plant', key: 'receive-date'},
      {namespace: 'plant', key: 'last watered'},
      {namespace: 'plant', key: 'growing conditions'},
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
 * Load data that is *optional* or can be loaded after initial render.
 * Great for journal entries, growth photos, logs, etc.
 *
 * This runs in parallel with `loadCriticalData`, and will be awaited by <Await />.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected handle to be defined in loadDeferredData');
  }

  const journalPromise = storefront.query(JOURNAL_QUERY, {
    variables: {handle},
  });

  return {journalPromise};
}

/**
 * async function to grab files uploaded to the store under Content > Files in the admin panel
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

// =========================
// React Component
// =========================

/**
 * Hydrated on the client after server-side rendering.
 * Uses the `product` returned from the loader.
 *
 * The component receives the product and deferred journalPromise from useLoaderData().
 * Hydrated client-side after SSR.
 */

export default function Plant() {
  const {product, journalPromise, adminImageData} =
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

  const unsortedPlantImages = adminImageData.filter((img) =>
    img.image?.url?.includes(`plants--${product.handle}`),
  );

  // each plant image is a Shopify file object. Each object has a .image.url that must be named with the following structure
  // `plants--${product.handle}--${mediaType}--2025-12-31.webp`
  // where mediaType can be either
  //   - carousel
  //   - journal
  //   - milestone

  const unsortedCarouselImages = unsortedPlantImages.filter((img) =>
    img.image?.url?.includes('carousel'),
  );

  const sortedCarouselImages = unsortedCarouselImages.slice().sort((a, b) => {
    const extractInfo = (url: string) => {
      const match = url.match(/--carousel--(\d{4}-\d{2}-\d{2})--(\d{2})\.webp/);
      if (!match) return {date: new Date(0), index: 0}; // fallback
      return {
        date: new Date(match[1]), // e.g., 2025-05-25
        index: parseInt(match[2], 10), // e.g., 04
      };
    };

    const aInfo = extractInfo(a.image.url);
    const bInfo = extractInfo(b.image.url);

    // First: sort by date descending (most recent first)
    if (bInfo.date.getTime() !== aInfo.date.getTime()) {
      return bInfo.date.getTime() - aInfo.date.getTime();
    }

    // Second: sort by index ascending
    return aInfo.index - bInfo.index;
  });

  /**
   * Simple HTML layout showing the plant title and description.
   * Uses Shopify's product.descriptionHtml (trusted, sanitized).
   */

  return (
    <div className="plant-page">
      {/* Render core product info immediately */}
      <h1>{product.title}</h1>
      <div dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />

      {sortedCarouselImages.length > 0 && (
        <div className="carousel">
          {sortedCarouselImages.map((img, index) => (
            <ProductImage key={img.id ?? index} image={{...img.image}} />
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
