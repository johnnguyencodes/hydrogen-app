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
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-25--001--full-frame--nikon-d850--sigma-105mm-macro--45mp--iso-64--f8--1-30s.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-25--002--full-frame--nikon-d850--nikkor-28mm-ais--45mp--iso-400--f8--1-250s.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-25--003--full-frame--nikon-d850--sigma-105mm-macro--45mp--iso-64--f8--1-30s.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-25--004--full-frame--nikon-d850--sigma-105mm-macro--45mp--iso-64--f8--1-50s.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-25--005--full-frame--nikon-d850--sigma-105mm-macro--45mp--iso-400--f8--1-800s.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-25--006--full-frame--nikon-d850--sigma-105mm-macro--45mp--iso-200--f8--1-100s.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-25--007--full-frame--nikon-d850--sigma-105mm-macro--45mp--iso-1000--f8--1-1600s.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-25--008--full-frame--nikon-d850--sigma-105mm-macro--45mp--iso-64--f8--1-400s.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-25--009--full-frame--nikon-d850--nikkor-50mm-ais--45mp--iso-64--f4--1-640s.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-25--010--full-frame--nikon-d850--nikkor-50mm-ais--45mp--iso-64--f4--1-800s.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-25--011--full-frame--nikon-d850--nikkor-50mm-ais--45mp--iso-64--f4--1-500s.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-25--012--full-frame--nikon-d850--sigma-105mm-macro--45mp--iso-200--f8--1-400s.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-25--013--full-frame--nikon-d850--sigma-105mm-macro--45mp--iso-400--f8--1-640s.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-10-25--014--full-frame--nikon-d850--sigma-105mm-macro--45mp--iso-400--f8--1-640s.jpg',
    },
  ];

  return (
    <div className="photography-container" ref={fancyboxRef}>
      <Gallery images={images} rowHeight={360} />
    </div>
  );
}
