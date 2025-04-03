// React and Remix imports
import {useEffect} from 'react';
import {useLoaderData} from '@remix-run/react';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';

// =========================
// Loader Function
// =========================

/**
 * Remix runs this loader on the server before rendering the page.
 * We split data loading into critical (needed to render the page)
 * and deferred (optional, loaded later if needed).
 */
export async function loader(args: LoaderFunctionArgs) {
  const criticalData = await loadCriticalData(args); // Must-have data
  const deferredData = loadDeferredData(args); // Optional data

  return {
    ...criticalData,
    ...deferredData,
  };
}

/**
 * Load data that is *required* for the page to render.
 * If this data fails (e.g. missing handle or product), we throw.
 */
async function loadCriticalData({context, params}: LoaderFunctionArgs) {
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
    ],
  };

  // Calls Shopify Storefront API using the pre-injected storefront client
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables,
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }
  return {product};
}

/**
 * Load data that is *optional* or can be loaded after initial render.
 * Great for journal entries, growth photos, logs, etc.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // Future implementation: hydrate with care notes, photos, etc.
  return {};
}

// =========================
// React Component
// =========================

/**
 * Hydrated on the client after server-side rendering.
 * Uses the `product` returned from the loader.
 */
export default function Plant() {
  const {product} = useLoaderData<typeof loader>(); // Get product from server

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
   * Simple HTML layout showing the plant title and description.
   * Uses Shopify's product.descriptionHtml (trusted, sanitized).
   */
  return (
    <div className="plant-page">
      <h1>{product.title}</h1>
      <div dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />
      {Array.isArray(product.metafields) && product.metafields.length > 0 ? (
        product.metafields.map((field, idx) =>
          field ? (
            <p key={idx}>
              <strong>{field.key.replace(/-/g, ' ')}:</strong> {field.value}
            </p>
          ) : null,
        )
      ) : (
        <p>No extra details available.</p>
      )}
    </div>
  );
}

// =========================
// GraphQL Definitions
// =========================

/**
 * A minimal GraphQL fragment for Shopify Product data.
 * This is reused in the query below for consistency.
 */

const PRODUCT_QUERY = `#graphql
  query PlantProduct($handle: String!, $metafieldIdentifiers: [HasMetafieldsIdentifier!]!) {
    product(handle: $handle) {
      id
      title
      descriptionHtml
      metafields(identifiers: $metafieldIdentifiers) {
        namespace
        key
        value
        type
      }
    }
  }
` as const;
