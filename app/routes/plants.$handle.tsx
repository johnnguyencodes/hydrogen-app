// React and Remix imports
import {useState} from 'react';
import {useLoaderData} from '@remix-run/react';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {CarouselImages} from '~/components/CarouselImages';
import {ImageGalleryComponent} from '~/components/ImageGalleryComponent';
import {
  returnCarouselImages,
  getLatestCarouselDate,
  getLatestCarouselImages,
  extractMetafieldValues,
  returnFormattedDate,
} from '~/lib/plantPageUtils';
import {PlantPageDescription} from '~/components/PlantPageDescription';
import {PlantPageSpecs} from '~/components/PlantPageSpecs';
import {PlantPageJournalComponent} from '~/components/PlantPageJournalComponent';
import {PlantPageTitle} from '~/components/PlantPageTitle';

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
      {namespace: 'plant', key: 'images'},
      {namespace: 'plant', key: 'llifle-database-link'},
      // Metafield definition
      // Namespace and key: "plant.acquisition"
      // Data type: JSON
      // Examples:
      //
      //   {
      //     "method": "Seed Grown",
      //     "pText": "Something about acquiring seeds",
      //     "aText": "Text for link if needed",
      //     "aHref": "URL for link if needed",
      //     "date": "YYYY-MM-DD"
      //   }
      //
      //  OR
      //
      // {
      //   "method": "Purchased from",
      //   "pText": "something about the purchase",
      //   "aText": "Name of store",
      //   "aHret": "https://url.com",
      //   "date": "YYYY-MM-DD"
      // }
      //
      // OR
      //
      //   {
      //     "method": "Cutting",
      //     "pText": "Something about the cutting",
      //     "aText": "Text for link if needed",
      //     "aHref": "URL for link if needed",
      //     "date": "YYYY-MM-DD"
      //   }
      {namespace: 'plant', key: 'acquisition'},
      // Metafield definition
      // Namespace and key: "plant.measurement"
      // Data type: JSON
      // Examples:
      //
      // [{
      //   "height": "xx cm",
      //    "width": "xx cm",
      //    "pot": "x.x in/\" plastic pot",
      //    "date": "2025-01-01"
      //  }]
      {namespace: 'plant', key: 'measurement'},
      {namespace: 'plant', key: 'watering-frequency'},
      {namespace: 'plant', key: 'growth-notes'},
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
  // state, state setters, and state handlers
  const {product, journalPromise} = useLoaderData<typeof loader>();
  // const [isImageGalleryVisible, setIsImageGalleryVisible] = useState(false);
  // const [imageGalleryArray, setImageGalleryArray] = useState<
  //   ImageGalleryItem[]
  // >([]);
  // const [imageGalleryStartIndex, setImageGalleryStartIndex] =
  //   useState<number>(0);

  // const handleImageGalleryClick = () => {
  //   setIsImageGalleryVisible(!isImageGalleryVisible);
  // };

  // preparing metafield data
  const metafieldValues = extractMetafieldValues(
    product.metafields.filter(Boolean) as PlantCriticalMetafield[],
  );
  const {acquisition, measurement, llifleDatabaseLink, wateringFrequency} =
    metafieldValues;

  // image data manipulation
  const rawImageData = metafieldValues.images;
  const parsedImageData = JSON.parse(rawImageData) as AdminImageWithMetadata[];
  const carouselImages = returnCarouselImages(parsedImageData);
  const latestCarouselDateString = getLatestCarouselDate(
    carouselImages,
  ) as string;
  const carouselImagesDate = new Date(latestCarouselDateString);
  const formattedCarousalImagesDate = carouselImagesDate.toLocaleString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  );
  const latestCarouselImages = getLatestCarouselImages(
    carouselImages,
    latestCarouselDateString,
  );

  const additonalDescription = `<p class="p1">(Plant photos taken on ${formattedCarousalImagesDate})`;
  const modifiedProductDescription =
    product.descriptionHtml + additonalDescription;
  const parsedAcquisition = JSON.parse(acquisition) as AcquisitionData;
  const parsedMeasurement = JSON.parse(measurement) as MeasurementDataArray;
  const datePlantAcquired = returnFormattedDate(parsedAcquisition.date);
  const dateMeasurementTaken = returnFormattedDate(parsedMeasurement[0].date);

  /**
   * HTML markup starts here
   */

  return (
    <div className="plant-page xxs:mx-5 2xl:mx-0 mt-4">
      {/* {isImageGalleryVisible ? (
        <div className="desktop-image-gallery-container">
          <ImageGalleryComponent
          // images={imageGalleryArray}
          // startIndex={imageGalleryStartIndex}
          // handleImageGalleryClick={handleImageGalleryClick}
          // setImageGalleryStartIndex={setImageGalleryStartIndex}
          />
        </div>
      ) : null} */}
      <div className="grid lg:grid-cols-[1fr_440px] lg:grid-rows-[min-content_1fr] gap-5 gap-x-10 relative min-h-screen">
        {/* Render core product info immediately */}
        <PlantPageTitle productTitle={product.title} />
        <CarouselImages
          // handleImageGalleryClick={handleImageGalleryClick}
          images={latestCarouselImages}
          productTitle={product.title}
          // setImageGalleryArray={setImageGalleryArray}
          // setIsImageGalleryVisible={setIsImageGalleryVisible}
          // isImageGalleryVisible={isImageGalleryVisible}
          width={500}
          height={500}
          // imageGalleryStartIndex={imageGalleryStartIndex}
          // setImageGalleryStartIndex={setImageGalleryStartIndex}
        />
        <PlantPageDescription
          modifiedProductDescription={modifiedProductDescription}
        />
      </div>
      <div className="block border border-[var(--color-fg-text)] my-10"></div>
      <PlantPageSpecs
        productTitle={product.title}
        llifleDatabaseLink={llifleDatabaseLink}
        parsedAcquisition={parsedAcquisition}
        datePlantAcquired={datePlantAcquired}
        parsedMeasurement={parsedMeasurement}
        dateMeasurementTaken={dateMeasurementTaken}
        wateringFrequency={wateringFrequency}
      />
      <PlantPageJournalComponent
        journalPromise={journalPromise}
        parsedImageData={parsedImageData}
        productTitle={product.title}
        latestCarouselDateString={latestCarouselDateString}
        // setImageGalleryArray={setImageGalleryArray}
        // setIsImageGalleryVisible={setIsImageGalleryVisible}
        // isImageGalleryVisible={isImageGalleryVisible}
        thumbnailImageWidth={400}
        thumbnailImageHeight={400}
        // imageGalleryStartIndex={imageGalleryStartIndex}
        // setImageGalleryStartIndex={setImageGalleryStartIndex}
      />
      <div className="w-full xl:mt-15"></div>
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
