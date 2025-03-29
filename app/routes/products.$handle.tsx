// Import type-safe loader context from Hydrogen
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';

// useLoaderData gives us the data returned from the loader
// MetaFunction helps generate SEO-friendly metadata
import {useLoaderData, type MetaFunction} from '@remix-run/react';

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
import {Button} from '~/components/ui/button';

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
export async function loader(args: LoaderFunctionArgs) {
  // Fetches any non-critical data that can load later
  const deferredData = loadDeferredData(args);

  // Waits for the important data needed to render the product
  const criticalData = await loadCriticalData(args);

  // Combine and return all data to the client
  return {...deferredData, ...criticalData};
}

/**
 * Load critical data needed before the page can be rendered.
 * This will call Shopify's Storefront API to get product data.
 */
async function loadCriticalData({
  context, // comes from createAppLoadContext() via server.ts
  params, // includes dynamic route params like product handle
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

  // Smartly preselect a variant, even if none is selected in URL
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

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

        {/* Example button (customize this) */}
        <Button>Click me</Button>
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
