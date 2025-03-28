// Virtual entry point for the app
// These lines are importing Remix’s server build using a Vite virtual module.
// Remix compiles all your routes and loaders into this build for server use.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import * as remixBuild from 'virtual:remix/server-build';

// Handles redirects (e.g., /products -> /collections/all) using Shopify settings
import {storefrontRedirect} from '@shopify/hydrogen';

// This creates a request handler compatible with Remix and Shopify’s Oxygen runtime
import {createRequestHandler} from '@shopify/remix-oxygen';

// You define this file — it sets up your app context (Shopify client, sessions, etc.)
import {createAppLoadContext} from '~/lib/context';

/**
 * Export a fetch handler in module format.
 * Shopify Oxygen looks for this `fetch()` method when serving your app.
 */
export default {
  async fetch(
    request: Request, // Incoming HTTP request
    env: Env, // Shopify environment bindings (env vars)
    executionContext: ExecutionContext, // Worker execution context (background tasks)
  ): Promise<Response> {
    try {
      // 👇 Sets up the app’s context: Shopify API client, session, etc.
      const appLoadContext = await createAppLoadContext(
        request,
        env,
        executionContext,
      );

      /**
       * Create the Remix request handler and pass it:
       * - the compiled app (`remixBuild`)
       * - the current mode (development/production)
       * - the context used in all loaders/actions
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => appLoadContext, // makes `context` available in Remix loaders
      });

      // 👇 Call Remix to handle the request (routes, loaders, rendering, etc.)
      const response = await handleRequest(request);

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
         */
        return storefrontRedirect({
          request,
          response,
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
