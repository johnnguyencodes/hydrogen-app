// Virtual entry point for the app
// These lines are importing Remix’s server build using a Vite virtual module.
// Remix compiles all your routes and loaders into this build for server use.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import * as remixBuild from 'virtual:remix/server-build';

// Handles redirects (e.g., /products -> /collections/all) using Shopify settings
// Lets you use 301 URL redirects managed from the Shopify admin panel.
import {storefrontRedirect} from '@shopify/hydrogen';

// This creates a request handler compatible with Remix and Shopify’s Oxygen runtime
// Oxygen is a worker-based runtime for hosting Hydrogen storefronts at the edge. This runtime is a JavaScript-based HTTP server
// designed for serverless or edge-computing contexts. Workers adapt web browser APIs for server-side applications, so we can use
// JS-standard Fetch, Streams, URL, Cache-Control, and Web Crypto APIs when the hydrogen store is deployed to Oxygen.
// Essentially, It's an HTTP server function that accepts an HTTP request, it runs your JavaScript code and it spits out an HTTP
// response.  It allows the ability to run React code on the server without having to worry about how it's going to scale.
import {createRequestHandler} from '@shopify/remix-oxygen';
/**
 * The request object could look like this if the user visits https://johnnguyen.codes/products/plant-1
 * Request {
     method: 'GET',
     url: 'https://your-hydrogen-app.com/products/plant-1',
     headers: Headers {
       'accept': 'text/html',
       'user-agent': 'Mozilla/5.0',
       'cookie': 'cartSession=abc123',
       ...
     },
     body: null,
     redirect: 'follow',
     signal: AbortSignal {},
     ...
  }

  The request is passed directly into Remix as the argument in the handleRequest function, which will return a response that will be passed
  into the Remix route loaders or actions to provide access to cookies, headers, form data, URL parameters on the server, just like in the browser.
 */

// You define this file — it sets up your app context (Shopify client, sessions, etc.)
import {createAppLoadContext} from '~/lib/context';

/**
 * Export a fetch handler in module format.
 * Shopify Oxygen looks for this `fetch()` method when serving your app.
 * This is the main function that Shopify Oxygen will call on every request.
 */
export default {
  async fetch(
    request: Request, // Incoming HTTP request, as demonstrated above
    env: Env, // Shopify environment bindings (env vars)
    executionContext: ExecutionContext, // Worker execution context (background tasks)
  ): Promise<Response> {
    try {
      // 👇 Sets up the app’s context: Shopify API client, session, provides custom logic or helpers to all Remix loaders, etc.
      const appLoadContext = await createAppLoadContext(
        request,
        env,
        executionContext,
      );

      /**
       * Create the Remix request handler and pass it:
       * - the compiled app (`remixBuild`, Remix's server build of the app)
       * - the current mode (development/production)
       * - the context used in all loaders/actions
       *
       * This sets up the Remix app's server logic and injects loadContext so your Remix loader functions can access Shopify
       * clients or sessions
       */

      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => appLoadContext, // makes `context` available in Remix loaders
      });

      // 👇 Call Remix to handle the request (routes, loaders, rendering, etc.)
      // This actually runs the Remix app and returns a response
      const response = await handleRequest(request);

      // Inject the correct CSP to allow GTM scripts to run
      const nonce = appLoadContext.nonce;

      const csp = [
        `default-src 'self'`,
        `script-src 'self' 'nonce-${nonce}' https://cdn.shopify.com https://www.googletagmanager.com`,
        `connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com`,
        `img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com`,
        `style-src 'self' 'unsafe-inline'`,
        `frame-src https://www.googletagmanager.com`,
      ].join('; ');

      response.headers.set('Content-Security-Policy', csp);

      // 👇 If session data has changed (e.g., user login, cart update), commit the cookie
      if (appLoadContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await appLoadContext.session.commit(),
        );
      }

      // 👇 Handle 404s by checking Shopify's redirect settings
      if (response.status === 404) {
        /**
         * This checks if Shopify has a redirect rule (in admin > navigation > URL redirects)
         * and applies it. If not, it just returns the 404 response.
         * Even though we are running a headless site, the app can still use Shopify's native URL redirects
         * defined in the Shopify admin panel
         */
        return storefrontRedirect({
          request,
          response,
          // storefront is a preconfigured Shopify Storefront GraphQL API client
          storefront: appLoadContext.storefront,
        });
      }

      // 👇 If not a 404, return the Remix-rendered response
      return response;
    } catch (error) {
      // 👇 Catch-all for unexpected errors
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

// 🧪 Recap of What This File Enables

// ✅ Server-side rendering via Remix
// ✅ Shopify Storefront API access in all your routes
// ✅ Session and cookie support
// ✅ Shopify-native 301/302 redirects
// ✅ Secure environment variable usage with env
