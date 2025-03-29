import {useLoaderData} from '@remix-run/react';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({context, params}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Response('No handle provided', {status: 400});
  }

  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions: [],
    },
  });

  if (!product.id) {
    throw new Response('Product not found', {status: 404});
  }

  return {product};
}

export default function PlantPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Plant Page</h1>
    </div>
  );
}
