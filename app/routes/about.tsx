import {AnimatePresence, motion} from 'motion/react';
import {useState, useEffect} from 'react';
import {Button, ButtonGroup} from 'flowbite-react';
import MasonryGallery from '~/components/MasonryGallery';
import useFancybox from '~/lib/useFancybox';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import type {Route} from './+types/about';

export default function About() {
  const [isVisible, setIsVisible] = useState(true);
  const [fancyboxRef1] = useFancybox({});
  const [fancyboxRef2] = useFancybox({});

  // Framer motion variables
  const container: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: 100,
    height: 160,
    position: 'relative',
  };

  const box: React.CSSProperties = {
    width: 100,
    height: 100,
    backgroundColor: '#0cdcf7',
    borderRadius: '10px',
  };

  const button: React.CSSProperties = {
    backgroundColor: '#0cdcf7',
    borderRadius: '10px',
    padding: '10px 20px',
    color: '#0f1115',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  };

  // Masonry gallery
  const images = [
    {src: '', alt: 'Portrait 1', className: 'row-span-7 col-span-5'},
    {src: '', alt: 'Portrait 2', className: 'row-span-20 col-span-7'},
    {src: '', alt: 'Portrait 3', className: 'row-span-7 col-span-5'},
    {src: '', alt: 'Portrait 4', className: 'row-span-12 col-span-5'},
    {src: '', alt: 'Portrait 5', className: 'row-span-6 col-span-7'},
  ];

  return (
    <div className="about-page xxs:mx-5 2xl:mx-0">
      <p>This is the about page</p>
      <p>This is the flowbite button</p>
      <Button> Hello </Button>
      <MasonryGallery images={images} />
      <p>
        Donec cursus ipsum quis felis imperdiet pretium. Maecenas ut mauris
        pellentesque, blandit nunc ut, facilisis enim. Fusce cursus rhoncus
        malesuada. In dolor erat, lobortis elementum maximus at, mattis in
        justo. Suspendisse ante sapien, venenatis eget nisl fermentum, aliquet
        luctus mauris. Donec eu nisl vitae est porttitor varius. Maecenas
        malesuada gravida ligula, eget fermentum leo condimentum ac. Nunc
        efficitur fermentum tellus, id rhoncus sem aliquet non. Sed sit amet
        tortor nulla. Nulla vitae odio luctus, maximus nunc at, varius mauris.
        Nam fermentum ligula ut risus accumsan, non fermentum mi accumsan.
        Curabitur ut velit tortor. Praesent eu risus elementum, egestas justo
        et, tempus sem. Suspendisse at nisl nec lectus pretium pharetra at
        semper mi. Quisque lacus felis, lobortis vel felis id, pharetra
        imperdiet leo. Mauris tempor euismod nulla vitae mollis.
      </p>

      <div className="fancybox" ref={fancyboxRef1}>
        <p>This is fancybox</p>
        <a
          data-fancybox="gallery"
          href="https://cdn.shopify.com/s/files/1/0934/9293/6987/files/plants--mammillaria-crucigera-tlalocii-3--2025-05-25--carousel--001.webp?v=1748282238&width=1000&height=1000&crop=center"
        >
          <img
            src="https://cdn.shopify.com/s/files/1/0934/9293/6987/files/plants--mammillaria-crucigera-tlalocii-3--2025-05-25--carousel--001.webp?v=1748282238&width=1000&height=1000&crop=center"
            alt="Sample image #1"
          />
        </a>
        <a
          data-fancybox="gallery"
          href="https://cdn.shopify.com/s/files/1/0934/9293/6987/files/plants--mammillaria-crucigera-tlalocii-3--2025-05-25--carousel--002.webp?v=1748282238&width=1000&height=1000&crop=center"
        >
          <img
            src="https://cdn.shopify.com/s/files/1/0934/9293/6987/files/plants--mammillaria-crucigera-tlalocii-3--2025-05-25--carousel--002.webp?v=1748282238&width=1000&height=1000&crop=center"
            alt="Sample image #1"
          />
        </a>
        <a
          data-fancybox="gallery"
          href="https://cdn.shopify.com/s/files/1/0934/9293/6987/files/plants--mammillaria-crucigera-tlalocii-3--2025-05-25--carousel--003.webp?v=1748282238&width=1000&height=1000&crop=center"
        >
          <img
            src="https://cdn.shopify.com/s/files/1/0934/9293/6987/files/plants--mammillaria-crucigera-tlalocii-3--2025-05-25--carousel--003.webp?v=1748282238&width=1000&height=1000&crop=center"
            alt="Sample image #1"
          />
        </a>
      </div>
      <div className="fancybox" ref={fancyboxRef2}>
        <p>This is fancybox</p>
        <a
          data-fancybox="gallery"
          href="https://cdn.shopify.com/s/files/1/0934/9293/6987/files/plants--mammillaria-crucigera-tlalocii-3--2025-05-25--carousel--004.webp?v=1748282238&width=1000&height=1000&crop=center"
        >
          <img
            src="https://cdn.shopify.com/s/files/1/0934/9293/6987/files/plants--mammillaria-crucigera-tlalocii-3--2025-05-25--carousel--004.webp?v=1748282238&width=1000&height=1000&crop=center"
            alt="Sample image #1"
          />
        </a>
        <a
          data-fancybox="gallery"
          href="https://cdn.shopify.com/s/files/1/0934/9293/6987/files/plants--mammillaria-crucigera-tlalocii-3--2025-05-25--carousel--005.webp?v=1748282238&width=1000&height=1000&crop=center"
        >
          <img
            src="https://cdn.shopify.com/s/files/1/0934/9293/6987/files/plants--mammillaria-crucigera-tlalocii-3--2025-05-25--carousel--005.webp?v=1748282238&width=1000&height=1000&crop=center"
            alt="Sample image #1"
          />
        </a>
        <a
          data-fancybox="gallery"
          href="https://cdn.shopify.com/s/files/1/0934/9293/6987/files/plants--mammillaria-crucigera-tlalocii-3--2025-05-25--carousel--006.webp?v=1748282238&width=1000&height=1000&crop=center"
        >
          <img
            src="https://cdn.shopify.com/s/files/1/0934/9293/6987/files/plants--mammillaria-crucigera-tlalocii-3--2025-05-25--carousel--006.webp?v=1748282238&width=1000&height=1000&crop=center"
            alt="Sample image #1"
          />
        </a>
      </div>
      <div style={container}>
        <p>This is framer motion</p>
        <AnimatePresence initial={false}>
          {isVisible ? (
            <motion.div
              initial={{opacity: 0, scale: 0}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0}}
              style={box}
              key="box"
            />
          ) : null}
        </AnimatePresence>
        <motion.button
          style={button}
          onClick={() => setIsVisible(!isVisible)}
          whileTap={{y: 1}}
        >
          {isVisible ? 'Hide' : 'Show'}
        </motion.button>
      </div>
    </div>
  );
}
