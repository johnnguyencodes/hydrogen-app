import {useEffect} from 'react';
import {useLocation} from '@remix-run/react';

export function GoogleTagManager() {
  const location = useLocation();

  useEffect(() => {
    if (!window.dataLayer) window.dataLayer = [];

    // Push gtm.js event again on route change
    window.dataLayer.push({
      event: 'gtm.js',
      'gtm.start': new Date().getTime(),
    });

    console.log('[GTM] gtm.js event manually re-pushed on route change');
  }, [location.pathname]); // re-run on route change

  return null;
}
