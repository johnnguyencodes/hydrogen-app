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
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-04--full-frame--nikon-f2--35mm-105mm-zoom-ais--kodak-gold--200--unknown--unknown--001.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-04--full-frame--nikon-f2--35mm-105mm-zoom-ais--kodak-gold--200--unknown--unknown--002.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-04--full-frame--nikon-f2--35mm-105mm-zoom-ais--kodak-gold--200--unknown--unknown--003.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-04--full-frame--nikon-f2--35mm-105mm-zoom-ais--kodak-gold--200--unknown--unknown--004.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-04--full-frame--nikon-f2--35mm-105mm-zoom-ais--kodak-gold--200--unknown--unknown--005.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-04--full-frame--nikon-f2--35mm-105mm-zoom-ais--kodak-gold--200--unknown--unknown--006.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-05--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--001.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-05--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--002.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-05--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--003.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-05--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--004.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-05--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--005.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-05--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--006.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-05--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--007.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-05--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown--008.jpg',
    },
  ];

  return (
    <div className="photography-container" ref={fancyboxRef}>
      <Gallery images={images} rowHeight={360} />
    </div>
  );
}
