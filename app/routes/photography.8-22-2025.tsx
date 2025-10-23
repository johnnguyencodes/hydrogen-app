import {Gallery} from '../../app/components/react-grid-gallery/Gallery';
import useFancybox from '~/lib/useFancybox';

export default function Photography() {
  const [fancyboxRef] = useFancybox({
    on: {
      '*': (_fb, slide) => {
        const img = slide.$el?.querySelector(
          'img, picture img',
        ) as HTMLImageElement | null;
        if (img) {
          img.loading = 'eager'; // don’t lazy the modal image
          // @ts-ignore – new attribute in modern browsers
          img.fetchPriority = 'high'; // promote in Chromium
          img.decoding = 'sync'; // decode sooner
        }
      },
    },
    placeFocusBack: false,
    Carousel: {
      Lazyload: {
        preload: 9,
      },
      infinite: true,
      Thumbs: {
        type: 'classic',
      },
      Toolbar: {
        display: {
          left: ['counter'],
          right: ['close'],
        },
      },
      Zoomable: {
        Panzoom: {
          mouseMoveFactor: 1.0,
        },
      },
    },
  });
  const images = [
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--012.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--013.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--014.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--016.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--017.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--018.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--038.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--040.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--042.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--058.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--062.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--006.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--008.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--009.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--010.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--012.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--013.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--014.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--020.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--022.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--024.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--026.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--028.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--030.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--032.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--038.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--040.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--044.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--046.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--048.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--049.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--050.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--052.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--056.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--058.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--068.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--070.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--071.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--072.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--073.jpg',
    },
  ];

  return (
    <div className="photography-container" ref={fancyboxRef}>
      <Gallery images={images} rowHeight={360} />
    </div>
  );
}
