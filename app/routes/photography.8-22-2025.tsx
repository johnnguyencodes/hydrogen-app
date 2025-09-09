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
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--000.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--002.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--004.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--006.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--008.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--010.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--012.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--014.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--016.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--018.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--020.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--022.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--024.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--026.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--028.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--030.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--032.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--034.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--036.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--038.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--040.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--042.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--044.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--046.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--048.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--050.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--052.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--054.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--056.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--058.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--060.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--062.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--064.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--066.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--068.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--070.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--072.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--074.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--076.jpg',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0934/9293/6987/files/photography--pentax-17--half-frame--2025-08-22--25mm--fujifilm--400--unknown--unknown--078.jpg',
    },
  ];

  return (
    <div className="photography-container" ref={fancyboxRef}>
      <Gallery images={images} rowHeight={360} />
    </div>
  );
}
