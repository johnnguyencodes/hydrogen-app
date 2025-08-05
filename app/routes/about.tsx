import {AnimatePresence, motion} from 'motion/react';
import {useState} from 'react';
import {Button} from 'flowbite-react';
import MasonryGallery from '~/components/MasonryGallery';

export default function About() {
  const [isVisible, setIsVisible] = useState(true);

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

  const images = [
    {src: '', alt: 'Portrait 1', className: 'row-span-2'},
    {src: '', alt: 'Portrait 2', className: 'col-span-6'},
    {src: '', alt: 'Portrait 3', className: 'col-span-4'},
    {src: '', alt: 'Portrait 4', className: 'col-span-2'},
    {src: '', alt: 'Portrait 5'},
    {src: '', alt: 'Portrait 6', className: 'row-span-2 col-span-2'},
    {
      src: '',
      alt: 'Portrait 7',
      className: 'row-span-2 col-span-2',
    },
  ];
  return (
    <div className="about-page xxs:mx-5 2xl:mx-0">
      <p>This is the about page</p>
      <p>This is the flowbite button</p>
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
      <div style={container}>
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
