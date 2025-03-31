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
    subscribe('product_viewed', () => {
      // Triggering a custom event in GTM when a product is viewed
      window.dataLayer.push({
        event: 'plant_view',
        plant_id: window.location.pathname, // or whatever you use
        plant_title: 'document.title', // replace with dynamic title
      });
    });

    ready();
  }, []);

  return null;
}
