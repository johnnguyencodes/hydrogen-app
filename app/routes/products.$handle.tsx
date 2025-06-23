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
  safeParseJson,
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

  const metafields = extractMetafieldValues(
    product.metafields.filter(Boolean) as PlantCriticalMetafield[],
  );

  const parsedAcquisition = safeParseJson<AcquisitionData>(
    metafields.acquisition,
  );
  const parsedMeasurement = safeParseJson<MeasurementDataArray>(
    metafields.measurement,
  );
  const formattedAcquisitionDate = parsedAcquisition?.date
    ? returnFormattedDate(parsedAcquisition.date)
    : null;
  const formattedMeasurementDate = parsedMeasurement?.[0]?.date
    ? returnFormattedDate(parsedMeasurement[0].date)
    : null;

  return {
    product,
    adminImageData,
    llifleDatabaseLink: metafields.llifleDatabaseLink || null,
    wateringFrequency: metafields.wateringFrequency || null,
    parsedAcquisition,
    parsedMeasurement,
    formattedAcquisitionDate,
    formattedMeasurementDate,
  };
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
  const {
    product,
    adminImageData,
    journalPromise,
    llifleDatabaseLink,
    wateringFrequency,
    parsedAcquisition,
    parsedMeasurement,
    formattedAcquisitionDate,
    formattedMeasurementDate,
  } = useLoaderData<typeof loader>();

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

  const unsortedPlantImages = filterPlantImagesByHandle(
    adminImageData,
    product.handle,
  );

  const sortedPlantImages = unsortedPlantImages
    .map(addImageMetadata)
    .sort(sortImagesWithMetadata);

  const carouselImages = returnCarouselImages(sortedPlantImages);

  const latestCarouselDateString = getLatestCarouselDate(
    carouselImages,
  ) as string;

  const latestCarouselImages = getLatestCarouselImages(
    carouselImages,
    latestCarouselDateString,
  );

  /**
   * HTML markup starts here
   */

  return (
    <div className="plant-page">
      <div className="grid grid-cols-3 gap-10 relative min-h-screen">
        {/* Render core product info immediately */}
        <div className="col-span-2">
          {latestCarouselImages.length > 0 && (
            <div className="carousel-images grid gap-1 grid-cols-2">
              {latestCarouselImages.map((img, index) => (
                <ProductImage
                  key={img.id ?? index}
                  id={img.id ?? index}
                  image={{
                    __typename: 'Image',
                    url: img.image.url,
                  }}
                  alt={img.alt || `${product.title} image`}
                  className="col-span-1"
                />
              ))}
            </div>
          )}
        </div>
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
                    {formattedAcquisitionDate}
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
                    {formattedAcquisitionDate}
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
                    {formattedAcquisitionDate}
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
                  {formattedMeasurementDate}
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

// // Import type-safe loader context from Hydrogen
// import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';

// // useLoaderData gives us the data returned from the loader
// // MetaFunction helps generate SEO-friendly metadata
// import {useLoaderData, type MetaFunction} from '@remix-run/react';

// // Hydrogen helpers for working with product variants and analytics
// import {
//   getSelectedProductOptions, // parses selected options from URL
//   Analytics, // handles analytics events
//   useOptimisticVariant, // smartly guesses which variant to show
//   getProductOptions, // returns formatted list of product options
//   getAdjacentAndFirstAvailableVariants, // helps with variant switching
//   useSelectedOptionInUrlParam, // syncs selected variant to URL search params
// } from '@shopify/hydrogen';

// // Local UI components for product display
// import {ProductPrice} from '~/components/ProductPrice';
// import {ProductImage} from '~/components/ProductImage';
// import {ProductForm} from '~/components/ProductForm';

// // Set SEO metadata for this page using product info from the loader
// export const meta: MetaFunction<typeof loader> = ({data}) => {
//   return [
//     {title: `Hydrogen | ${data?.product.title ?? ''}`},
//     {
//       rel: 'canonical',
//       href: `/products/${data?.product.handle}`,
//     },
//   ];
// };

// // Main loader function: runs on the server before rendering the page
// // type LoaderFunctionArgs = {
// //  request: Request;
// //  context: AppLoadContext;
// //  params: Params;
// // }
// export async function loader(args: LoaderFunctionArgs) {
//   // Fetches any non-critical data that can load later
//   const deferredData = loadDeferredData(args);

//   // Waits for the important data needed to render the product
//   const criticalData = await loadCriticalData(args);

//   // Combine and return all data to the client
//   return {...deferredData, ...criticalData};
// }

// /**
//  * Load data necessary for rendering content above the fold. This is the critical data
//  * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
//  *
//  * Load critical data needed before the page can be rendered.
//  * This will call Shopify's Storefront API to get product data.
//  */
// async function loadCriticalData({
//   context, // comes from createAppLoadContext() via server.ts
//   params, // includes dynamic route params like product handle from the URL and any other URL param
//   request, // the full HTTP request
// }: LoaderFunctionArgs) {
//   const {handle} = params;
//   const {storefront} = context; // this was injected by server.ts and created in context.ts

//   if (!handle) {
//     throw new Error('Expected product handle to be defined');
//   }

//   // Query Shopify's Storefront API for product data
//   const [{product}] = await Promise.all([
//     storefront.query(PRODUCT_QUERY, {
//       variables: {
//         handle,
//         selectedOptions: getSelectedProductOptions(request), // get variant from URL if available
//       },
//     }),
//     // Future: you can load more stuff in parallel here
//   ]);

//   // If no product found, return 404
//   if (!product?.id) {
//     throw new Response(null, {status: 404});
//   }

//   // Return the product data to the loader
//   return {product};
// }

// /**
//  * Load data for rendering content below the fold. This data is deferred and will be
//  * fetched after the initial page load. If it's unavailable, the page should still 200.
//  * Make sure to not throw any errors here, as it will cause the page to 500.*
//  *
//  * Load non-critical data that can load after initial render.
//  * Example: product reviews, recommendations, etc.
//  */
// function loadDeferredData({context, params}: LoaderFunctionArgs) {
//   // Nothing deferred yet, but this is where you'd add it
//   return {};
// }

// // Client-side component: hydrated with loader data from the server
// export default function Product() {
//   // Pull product data returned by the loader
//   const {product} = useLoaderData<typeof loader>();

//   // Optimistically selects a variant with given available variant information
//   //
//   // Smartly preselect a variant, even if none is selected in URL
//   const selectedVariant = useOptimisticVariant(
//     product.selectedOrFirstAvailableVariant,
//     getAdjacentAndFirstAvailableVariants(product),
//   );

//   // Sets the search param to the selected variant without navigation
//   // only when no search params are set in the url
//   //
//   // Update URL search params with selected variant (no reload)
//   useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

//   // Extract product options (e.g., Size, Color)
//   const productOptions = getProductOptions({
//     ...product,
//     selectedOrFirstAvailableVariant: selectedVariant,
//   });

//   const {title, descriptionHtml} = product;

//   return (
//     <div className="product">
//       {/* Product image */}
//       <ProductImage image={selectedVariant?.image} />

//       <div className="product-main">
//         {/* Product title */}
//         <h1>{title}</h1>

//         {/* Pricing display */}
//         <ProductPrice
//           price={selectedVariant?.price}
//           compareAtPrice={selectedVariant?.compareAtPrice}
//         />

//         {/* Variant selectors + add to cart */}
//         <ProductForm
//           productOptions={productOptions}
//           selectedVariant={selectedVariant}
//         />

//         {/* Product description */}
//         <p>
//           <strong>Description</strong>
//         </p>
//         <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
//       </div>

//       {/* Sends product view event to analytics */}
//       <Analytics.ProductView
//         data={{
//           products: [
//             {
//               id: product.id,
//               title: product.title,
//               price: selectedVariant?.price.amount || '0',
//               vendor: product.vendor,
//               variantId: selectedVariant?.id || '',
//               variantTitle: selectedVariant?.title || '',
//               quantity: 1,
//             },
//           ],
//         }}
//       />
//     </div>
//   );
// }

// // GraphQL fragments for reusability
// const PRODUCT_VARIANT_FRAGMENT = `#graphql
//   fragment ProductVariant on ProductVariant {
//     availableForSale
//     compareAtPrice {
//       amount
//       currencyCode
//     }
//     id
//     image {
//       __typename
//       id
//       url
//       altText
//       width
//       height
//     }
//     price {
//       amount
//       currencyCode
//     }
//     product {
//       title
//       handle
//     }
//     selectedOptions {
//       name
//       value
//     }
//     sku
//     title
//     unitPrice {
//       amount
//       currencyCode
//     }
//   }
// ` as const;

// // Product fragment with rich info + nested variant fragment
// const PRODUCT_FRAGMENT = `#graphql
//   fragment Product on Product {
//     id
//     title
//     vendor
//     handle
//     descriptionHtml
//     description
//     encodedVariantExistence
//     encodedVariantAvailability
//     options {
//       name
//       optionValues {
//         name
//         firstSelectableVariant {
//           ...ProductVariant
//         }
//         swatch {
//           color
//           image {
//             previewImage {
//               url
//             }
//           }
//         }
//       }
//     }
//     selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
//       ...ProductVariant
//     }
//     adjacentVariants(selectedOptions: $selectedOptions) {
//       ...ProductVariant
//     }
//     seo {
//       description
//       title
//     }
//   }
//   ${PRODUCT_VARIANT_FRAGMENT}
// ` as const;

// // Final GraphQL query used by storefront.query()
// const PRODUCT_QUERY = `#graphql
//   query Product(
//     $country: CountryCode
//     $handle: String!
//     $language: LanguageCode
//     $selectedOptions: [SelectedOptionInput!]!
//   ) @inContext(country: $country, language: $language) {
//     product(handle: $handle) {
//       ...Product
//     }
//   }
//   ${PRODUCT_FRAGMENT}
// ` as const;

// // Recap of how server.ts and context.ts hydrate this route
// // 1️⃣ User requests /products/plant-handle
// // 2️⃣ server.ts receives the request via fetch()
// // 3️⃣ server.ts calls createAppLoadContext() from context.ts
// // 4️⃣ context.ts creates the storefront client and returns it in context
// // 5️⃣ loader() in products.$handle.tsx is called with { context, params, request }
// // 6️⃣ storefront.query(...) fetches product data
// // 7️⃣ Loader returns { product } to Remix
// // 8️⃣ useLoaderData() injects product into the React component
// // 9️⃣ Hydrogen helpers enhance UX
// // 🔟 The page is rendered and hydrated 💧
// //
// // Layer >	Responsibility
// // server.ts >>	Handles the raw HTTP request, sets up context using createAppLoadContext, and passes it to Remix’s loader()
// // context.ts >>	Creates and returns the storefront client + session and other values for the context object
// // products.$handle.tsx → loader() >>	Gets context.storefront, uses it to fetch the product, and returns it to the UI
// // useLoaderData() >> Hydrates the React component with the product fetched on the server
