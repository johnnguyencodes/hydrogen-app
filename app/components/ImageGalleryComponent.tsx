import ImageGallery from 'react-image-gallery';
import {Button} from './ui/button';
import {Dice1, Heart, X} from 'lucide-react';
import LeftNav from './ImageGalleryLeftNav';
import RightNav from './ImageGalleryRightNav';

export function ImageGalleryComponent({
  images,
  startIndex,
  setImageGalleryStartIndex,
  handleImageGalleryClick,
}: ImageGalleryComponentProps) {
  function handleTouchMove(e: React.TouchEvent) {
    const touch = e.touches[0];
    const deltaY = Math.abs(touch.clientY - touchStartY);
    const deltaX = Math.abs(touch.clientX - touchStartX);

    // Prevent swipe if the user moved more vertically than horizontally
    if (deltaY > deltaX) {
      e.stopPropagation(); // stop gallery from handling it
    }
  }

  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }
  return (
    <div
      className="fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-90"
      onClick={handleImageGalleryClick}
    >
      <div
        className="relative w-full h-full max-w-5xl max-h-[100vh] mx-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <Button
          className="absolute top-0 right-0 z-100 bg-transparent text-white bg-black/40 rounded-none leading-none py-2.5 px-5 font-bold cursor-pointer"
          onClick={() => {
            handleImageGalleryClick();
            setImageGalleryStartIndex(0);
          }}
        >
          <X size={24} className="size-custom" />
        </Button>
        <ImageGallery
          items={images}
          showPlayButton={false}
          showFullscreenButton={false}
          additionalClass="h-full"
          showIndex={true}
          slideOnThumbnailOver={true}
          startIndex={startIndex}
          renderLeftNav={(onClick, disabled) => (
            <LeftNav onClick={onClick} disabled={disabled} />
          )}
          renderRightNav={(onClick, disabled) => (
            <RightNav onClick={onClick} disabled={disabled} />
          )}
          renderItem={(item) => (
            <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
              <a
                href={item.original}
                target="_blank"
                rel="noopener noreferrer"
                style={{display: 'block', width: '100%', height: '100%'}}
              >
                <img
                  className="image-gallery-image cursor-zoom-in"
                  src={item.gallery}
                  style={{width: '100%', height: '100%', objectFit: 'contain'}}
                  alt=""
                />
              </a>
            </div>
          )}
        />
      </div>
    </div>
  );
}
