// useLoaderData gives us the data returned from the loader
// MetaFunction helps generate SEO-friendly metadata
// Import type-safe loader context from Hydrogen
import {
  useLoaderData,
  type MetaFunction,
  type LoaderFunctionArgs,
} from 'react-router';

import type {Route} from './+types/products.$handle';

// Hydrogen helpers for working with product variants and analytics
import {
  getSelectedProductOptions, // parses selected options from URL
  Analytics, // handles analytics events
  useOptimisticVariant, // smartly guesses which variant to show
  getProductOptions, // returns formatted list of product options
  getAdjacentAndFirstAvailableVariants, // helps with variant switching
  useSelectedOptionInUrlParam, // syncs selected variant to URL search params
} from '@shopify/hydrogen';

// Local UI components for product display
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';

// Set SEO metadata for this page using product info from the loader
export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

// Main loader function: runs on the server before rendering the page
// type LoaderFunctionArgs = {
//  request: Request;
//  context: AppLoadContext;
//  params: Params;
// }
export async function loader(args: LoaderFunctionArgs) {
  // Fetches any non-critical data that can load later
  const deferredData = loadDeferredData(args);

  // Waits for the important data needed to render the product
  const criticalData = await loadCriticalData(args);

  // Combine and return all data to the client
  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 *
 * Load critical data needed before the page can be rendered.
 * This will call Shopify's Storefront API to get product data.
 */
async function loadCriticalData({
  context, // comes from createAppLoadContext() via server.ts
  params, // includes dynamic route params like product handle from the URL and any other URL param
  request, // the full HTTP request
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context; // this was injected by server.ts and created in context.ts

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // Query Shopify's Storefront API for product data
  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions: getSelectedProductOptions(request), // get variant from URL if available
      },
    }),
    // Future: you can load more stuff in parallel here
  ]);

  // If no product found, return 404
  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // Return the product data to the loader
  return {product};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.*
 *
 * Load non-critical data that can load after initial render.
 * Example: product reviews, recommendations, etc.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // Nothing deferred yet, but this is where you'd add it
  return {};
}

// Client-side component: hydrated with loader data from the server
export default function Product() {
  // Pull product data returned by the loader
  const {product} = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  //
  // Smartly preselect a variant, even if none is selected in URL
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  //
  // Update URL search params with selected variant (no reload)
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Extract product options (e.g., Size, Color)
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  return (
    <div className="product">
      {/* Product image */}
      <ProductImage image={selectedVariant?.image} />

      <div className="product-main">
        {/* Product title */}
        <h1>{title}</h1>

        {/* Pricing display */}
        <ProductPrice
          price={selectedVariant?.price}
          compareAtPrice={selectedVariant?.compareAtPrice}
        />

        {/* Variant selectors + add to cart */}
        <ProductForm
          productOptions={productOptions}
          selectedVariant={selectedVariant}
        />

        {/* Product description */}
        <p>
          <strong>Description</strong>
        </p>
        <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      </div>

      {/* Sends product view event to analytics */}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

// GraphQL fragments for reusability
const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

// Product fragment with rich info + nested variant fragment
const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

// Final GraphQL query used by storefront.query()
const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

// Recap of how server.ts and context.ts hydrate this route
// 1️⃣ User requests /products/plant-handle
// 2️⃣ server.ts receives the request via fetch()
// 3️⃣ server.ts calls createAppLoadContext() from context.ts
// 4️⃣ context.ts creates the storefront client and returns it in context
// 5️⃣ loader() in products.$handle.tsx is called with { context, params, request }
// 6️⃣ storefront.query(...) fetches product data
// 7️⃣ Loader returns { product } to Remix
// 8️⃣ useLoaderData() injects product into the React component
// 9️⃣ Hydrogen helpers enhance UX
// 🔟 The page is rendered and hydrated 💧
//
// Layer >	Responsibility
// server.ts >>	Handles the raw HTTP request, sets up context using createAppLoadContext, and passes it to Remix’s loader()
// context.ts >>	Creates and returns the storefront client + session and other values for the context object
// products.$handle.tsx → loader() >>	Gets context.storefront, uses it to fetch the product, and returns it to the UI
// useLoaderData() >> Hydrates the React component with the product fetched on the server
