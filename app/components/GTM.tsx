import {useEffect} from 'react';

export function GTM({gtmId}: {gtmId: string}) {
  useEffect(() => {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [gtmId]);

  return null;
}
