import type {RemixConfig} from '@remix-run/dev';

const config: RemixConfig = {
  future: {
    v3_singleFetch: true, // ✅ Applies to all loaders
  },
  // ...your existing config like routesDirectory, ignoredRouteFiles, etc.
};

export default config;
