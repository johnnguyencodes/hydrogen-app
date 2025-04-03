import {useNonce, Analytics} from '@shopify/hydrogen';
import {
  Links,
  Meta,
  Scripts,
  // useRouteLoaderData,
  ScrollRestoration,
  Outlet,
} from '@remix-run/react';
import tailwindCss from '~/styles/tailwind.css';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import {PageLayout} from '~/components/PageLayout';
// import {RootLoader} from './root';
import {Layout as VirtualLayout} from './components/Layout';

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  // const data = useRouteLoaderData<RootLoader>('root');

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss}></link>
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <Meta />
        <Links />
      </head>
      <body className="debug-screens">
        <VirtualLayout>
          <Outlet />
        </VirtualLayout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}
