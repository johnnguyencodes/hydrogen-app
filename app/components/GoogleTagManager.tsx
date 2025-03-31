import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function GoogleTagManager() {
  const {subscribe, register} = useAnalytics();
  const {ready} = register('Google Tag Manager');

  useEffect(() => {
    // Triggering a custom event in GTM when a plant page is viewed
    subscribe('plant_view', () => {
      window.dataLayer.push({
        event: 'plant_view',
        plant_id: window.location.pathname, // defined in GTM as {{Page Path}}
        plant_title: 'document.title', // defined in GTM that looks for `h1` as a CSS selector
      });
    });
    // Add another subscription to push another GA4 event

    ready();
  }, []);

  return null;
}
