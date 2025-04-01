import {useEffect} from 'react';

export function GoogleTagManager() {
  useEffect(() => {
    // Ensure the dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Optional: push a general GTM-ready signal if needed
    window.dataLayer.push({event: 'gtm_ready'});
  }, []);

  return null;
}
