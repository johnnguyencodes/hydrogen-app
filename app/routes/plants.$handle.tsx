import {Suspense, useEffect} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
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
  formatYMDToLong,
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

export async function loader({context, params}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  if (!handle) throw new Error('Expected product handle');

  const variables = {
    handle,
    metafieldIdentifiers: [
      {namespace: 'plant', key: 'llifle-database-link'},
      {namespace: 'plant', key: 'acquisition'},
      {namespace: 'plant', key: 'measurement'},
      {namespace: 'plant', key: 'watering-frequency'},
      {namespace: 'plant', key: 'growth-notes'},
      {namespace: 'plant', key: 'care-routine'},
    ],
  };

  // fetch both at once on the server
  const [{product}, adminImageData] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {variables}),
    fetchImagesFromAdminAPI(context),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // only journal is deferred to client/Hydration
  const journalPromise = storefront.query(JOURNAL_QUERY, {
    variables: {handle},
  });

  return {product, adminImageData, journalPromise};
}

async function fetchImagesFromAdminAPI(ctx: LoaderFunctionArgs['context']) {
  const ADMIN_API_URL = `https://${ctx.env.PUBLIC_STORE_DOMAIN}/admin/api/2025-04/graphql.json`;
  const res = await fetch(ADMIN_API_URL, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': ctx.env.FILES_ADMIN_API_ACCESS_TOKEN,
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
                  image { url }
                }
              }
            }
          }
        }
      `,
    }),
  });
  const {data} = (await res.json()) as {
    data: {files: {edges: Array<{node: any}>}};
  };
  return data.files.edges.map((e) => e.node);
}

export default function Plant() {
  const {product, adminImageData, journalPromise} =
    useLoaderData<typeof loader>();

  // analytics on mount
  useEffect(() => {
    if (window.analytics?.track) {
      window.analytics.track('plant_view', {
        id: product.id,
        title: product.title,
      });
    }
  }, [product.id, product.title]);

  // metafields
  const mf = extractMetafieldValues(
    product.metafields.filter(Boolean) as PlantCriticalMetafield[],
  );
  const {acquisition, measurement, llifleDatabaseLink, wateringFrequency} = mf;
  const parsedAcq = JSON.parse(acquisition) as AcquisitionData;
  const parsedMeas = JSON.parse(measurement) as MeasurementDataArray;
  const datePlantAcquired = returnFormattedDate(parsedAcq.date);
  const dateMeasurementTaken = returnFormattedDate(parsedMeas[0].date);

  // build carousel
  const unsorted = filterPlantImagesByHandle(adminImageData, product.handle);
  const sorted = unsorted.map(addImageMetadata).sort(sortImagesWithMetadata);
  const carouselAll = returnCarouselImages(sorted);
  const latestYMD = getLatestCarouselDate(carouselAll)!; // e.g. "2025-05-25"
  const formattedCarousel = formatYMDToLong(latestYMD);
  const modifiedDescriptionSnippet = (
    <p className="p1">(Plant photos taken on {formattedCarousel})</p>
  );
  const latestImgs = getLatestCarouselImages(carouselAll, latestYMD);

  return (
    <div className="plant-page">
      <div className="grid grid-cols-3 gap-10 min-h-screen">
        {/* Carousel */}
        <div className="col-span-2">
          {latestImgs.length > 0 && (
            <div className="carousel-images grid gap-1 grid-cols-2">
              {latestImgs.map((img, idx) => (
                <ProductImage
                  key={img.id ?? idx}
                  id={img.id ?? idx}
                  image={{__typename: 'Image', url: img.image.url}}
                  alt={img.alt || `${product.title} image`}
                  className="col-span-1"
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-span-1">
          <div className="flex justify-end mb-4">
            <Button size="sm" className="mr-2">
              <Heart />
            </Button>
            <Button size="sm">
              <Share />
            </Button>
          </div>
          <h1 className="text-3xl mb-5 font-medium">{product.title}</h1>
          {/* description + snippet */}
          <div className="prose p-5" id="plant-description">
            <div dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />
            {modifiedDescriptionSnippet}
          </div>
          {llifleDatabaseLink && (
            <a
              href={llifleDatabaseLink}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center mt-4 text-sm"
            >
              View species info on LLIFLE <ExternalLink className="ml-1" />
            </a>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="my-10 border-t" />
      <div className="grid grid-cols-3 gap-10">
        {/* Acquisition */}
        {parsedAcq && (
          <div className="bg-[var(--color-bg-1)] p-5 rounded-md text-center">
            {parsedAcq.method === 'seed-grown' && <Sprout size={36} />}
            {parsedAcq.method === 'purchased' && <BadgeDollarSign size={36} />}
            {parsedAcq.method === 'cutting' && <ScissorsLineDashed size={36} />}
            <p className="font-bold mt-2">
              {parsedAcq.method === 'seed-grown'
                ? 'Seed-grown'
                : parsedAcq.method === 'purchased'
                  ? `Purchased from ${parsedAcq.supplier}`
                  : 'Acquired from a cutting'}
            </p>
            <p>{datePlantAcquired}</p>
          </div>
        )}

        {/* Measurement */}
        {parsedMeas && (
          <div className="bg-[var(--color-bg-2)] p-5 rounded-md text-center">
            <Ruler size={36} />
            <p className="font-bold mt-2">Measurements</p>
            <p>
              {parsedMeas[0].height} × {parsedMeas[0].width} in pot{' '}
              {parsedMeas[0].pot}
            </p>
            <p>{dateMeasurementTaken}</p>
          </div>
        )}

        {/* Care (soil + watering) */}
        <div className="bg-[var(--color-bg-3)] p-5 rounded-md text-center">
          <Shovel size={36} />
          <p className="font-bold mt-2">Soil Mix</p>
          <ul className="list-disc list-inside">
            <li>8 parts pumice</li>
            <li>1 part calcinated clay</li>
            <li>1 part cactus soil</li>
          </ul>
          <p className="mt-4 font-bold">Water every {wateringFrequency}</p>
        </div>
      </div>

      {/* Deferred journal */}
      <Suspense fallback={<p>Loading journal…</p>}>
        <Await resolve={journalPromise}>
          {(data) => {
            const raw = data?.product?.journal?.value;
            let entries: PlantJournalEntry[] = [];
            try {
              entries = raw ? JSON.parse(raw) : [];
            } catch {
              console.error('Journal JSON parse error');
            }
            return entries.length > 0 ? (
              <ul className="mt-5 list-disc pl-5">
                {entries.map((e) => (
                  <li key={e.date}>
                    <strong>{e.date}</strong> — {e.content}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5">No journal entries yet.</p>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

// ─── GraphQL ─────────────────────────────────────────────────────────────────

const PRODUCT_QUERY = `#graphql
  query PlantProduct(
    $handle: String!
    $metafieldIdentifiers: [HasMetafieldsIdentifier!]!
  ) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      metafields(identifiers: $metafieldIdentifiers) {
        namespace
        key
        value
      }
    }
  }
`;

const JOURNAL_QUERY = `#graphql
  query PlantJournal($handle: String!) {
    product(handle: $handle) {
      journal: metafield(namespace: "plant", key: "journal") {
        value
      }
    }
  }
`;
