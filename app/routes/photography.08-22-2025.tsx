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
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--012--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--013--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--014--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--016--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--017--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--018--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--038--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--040--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--042--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--058--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-08-22--062--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--006--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--008--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--009--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--010--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--012--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--013--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--014--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--020--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--022--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--024--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--026--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--028--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--030--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--032--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--038--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--040--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--044--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--046--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--048--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--049--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--050--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--052--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--056--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--058--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--068--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--070--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--071--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--072--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
    {
      src: 'https://files.johnnguyen.codes/cdn/shop/files/photography--2025-09-10--073--half-frame--pentax-17--25mm--fujifilm--400--unknown--unknown.jpg',
    },
  ];

  return (
    <div className="photography-container" ref={fancyboxRef}>
      <Gallery images={images} rowHeight={360} />
    </div>
  );
}
