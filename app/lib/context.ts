// Hydrogen provides this helper to create a "load context" for Remix
// It gives you access to `storefront`, `session`, `cache`, etc.
import {createHydrogenContext} from '@shopify/hydrogen';

// Custom session utility you (or the Hydrogen starter) defined
// Handles reading/writing to cookies
import {AppSession} from '~/lib/session';

// A reusable GraphQL fragment used to fetch cart data
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 *
 * This function is called in server.ts and returns an object that becomes
 * available in every Remix route's loader/action as `context`
 */
export async function createAppLoadContext(
  request: Request, // Incoming HTTP request (from server.ts)
  env: Env, // Environment variables (Shopify tokens, etc)
  executionContext: ExecutionContext, // Oxygen background context
) {
  // Open a cache instance in the worker and a custom session insance.
  //
  // If your SESSION_SECRET env var isn’t set, fail early for security
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  // Bind the executionContext’s waitUntil method
  // Used to defer background tasks (e.g., log requests, cache writes)
  const waitUntil = executionContext.waitUntil.bind(executionContext);

  // Run these two setup tasks in parallel:
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'), // Creates a named cache (standard Web API cache)
    AppSession.init(request, [env.SESSION_SECRET]), // Initializes session (via cookie parsing)
  ]);

  // Core Hydrogen context setup
  const hydrogenContext = createHydrogenContext({
    // storefront is internally set up and returned when createHydrogenContext is invoked
    env, // For access to storefront token, domain, etc.
    request, // Used to read headers, cookies, method, etc.
    cache, // Optional cache to store/persist query results
    waitUntil, // For background tasks
    session, // Hydrogen-compatible session manager
    i18n: {
      language: 'EN',
      country: 'US',
    },
    cart: {
      queryFragment: CART_QUERY_FRAGMENT, // Default cart fields used when calling `cart.create()` or `cart.fetch()`
    },
  });

  return {
    ...hydrogenContext,
    // You can spread in other custom things if needed (like your own database client)
    // expose custom env variables so they are available in context.env
    env: {
      ...env,
      FILES_ADMIN_API_ACCESS_TOKEN: env.FILES_ADMIN_API_ACCESS_TOKEN,
      FILES_ADMIN_API_KEY: env.FILES_ADMIN_API_KEY,
      FILES_ADMIN_API_SECRET_KEY: env.FILES_ADMIN_API_SECRET_KEY,
    },
  };
}
