import type {LoaderFunctionArgs} from 'react-router';
import type {Route} from './+types/$';

export async function loader({request}: LoaderFunctionArgs) {
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

export default function CatchAllPage() {
  return null;
}
