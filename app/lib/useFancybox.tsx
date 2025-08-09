import {useState, useEffect} from 'react';

import {type FancyboxOptions, Fancybox} from '@fancyapps/ui/dist/fancybox/';

export default function useFancybox(options: Partial<FancyboxOptions> = {}) {
  const [root, setRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (root) {
      Fancybox.bind(root, '[data-fancybox="gallery"]', options);
      return () => Fancybox.unbind(root);
    }
  }, [root, options]);

  return [setRoot];
}
