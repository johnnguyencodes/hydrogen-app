import {useLoaderData} from '@remix-run/react';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader(args: LoaderFunctionArgs) {
  // this will fetch data later
  return {};
}

export default function PlantPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Plant Page</h1>
    </div>
  );
}
