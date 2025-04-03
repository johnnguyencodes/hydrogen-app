// React and Remix imports
import {Suspense, useEffect} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';

// =========================
// Loader Function
// =========================

// Enables Remix future features, such as v3_singleFetch (raw object returned instead of Response)
export const config = {
  future: {
    v3_singleFetch: true,
  },
};

// Type definition for individual journal entries
type JournalEntry = {
  date: string;
  title: string;
  content: string;
  image?: string | null;
};

/**
 * The main loader Remix calls before rendering the route.
 * It returns both critical (synchronous) and deferred (asynchronous) data.
 */
export async function loader(args: LoaderFunctionArgs) {
  const criticalData = await loadCriticalData(args); // Required immediately to render
  const deferredData = loadDeferredData(args); // Can be loaded in parallel

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

  // Shopify storefront query using product handle
  const {product} = await storefront.query(PRODUCT_QUERY, {variables});

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return {product};
}

/**
 * Deferred data loader: fetches journal metafields separately.
 * This runs in parallel with `loadCriticalData`, and will be awaited by <Await />.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  const {storefront} = context;

  const journalPromise = storefront.query(JOURNAL_QUERY, {
    variables: {
      handle: params.handle,
    },
  });

  return {journalPromise};
}

// =========================
// React Component
// =========================

/**
 * The component receives the product and deferred journalPromise from useLoaderData().
 * Hydrated client-side after SSR.
 */
export default function Plant() {
  const {product, journalPromise} = useLoaderData<typeof loader>();

  // Log page view on the client
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

  return (
    <div className="plant-page">
      {/* Render core product info immediately */}
      <h1>{product.title}</h1>
      <div dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />

      {/* Display metafields like purchase origin, links, etc. */}
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

      {/* Deferred journal entry block — Suspense + Await */}
      <Suspense fallback={<p> Loading journal...</p>}>
        <Await resolve={journalPromise}>
          {(data) => {
            // Await gives us the result of journalPromise when it's done
            const metafield = data?.product?.journalEntries;

            console.log('Journal Entries:', metafield);
            console.log('[Raw metafield JSON]', metafield?.value);

            let journal: JournalEntry[] = [];

            try {
              // Parse the raw metafield JSON into a JS array
              journal = metafield?.value ? JSON.parse(metafield.value) : [];
            } catch (error) {
              console.error('Failed to parse journal JSON:', error);
            }

            // Render parsed journal entries
            return journal.length > 0 ? (
              <ul className="journal-entries">
                {journal.map((entry, index) => (
                  <li key={index}>
                    <strong>{entry.date}</strong> - {entry.content}
                  </li>
                ))}
              </ul>
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
 * Critical product data with specific metafields.
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

/**
 * Deferred journal query — fetches only the journal metafield by key.
 */
const JOURNAL_QUERY = `#graphql
  query PlantJournal($handle: String!) {
    product(handle: $handle) {
      journalEntries: metafield(namespace: "plant", key: "journal") {
        value
        type
      }
    }
  }
` as const;
