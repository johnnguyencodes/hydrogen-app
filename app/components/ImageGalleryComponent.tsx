import ImageGallery from 'react-image-gallery';
import {Button} from './ui/button';

export function ImageGalleryComponent({
  images,
  startIndex,
  setImageGalleryStartIndex,
  handleImageGalleryClick,
}: ImageGalleryComponentProps) {
  console.log('startIndex:', startIndex);
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
          className="absolute top-2 -right-20 z-10"
          onClick={() => {
            handleImageGalleryClick();
            setImageGalleryStartIndex(0);
          }}
        >
          X
        </Button>
        <ImageGallery
          items={images}
          showPlayButton={false}
          additionalClass="h-full"
          showIndex={true}
          slideOnThumbnailOver={true}
          startIndex={startIndex}
          renderItem={(item) => (
            <a
              href={item.original}
              target="_blank"
              rel="noopener noreferrer"
              style={{display: 'block', width: '100%', height: '100%'}}
            >
              <img
                className="image-gallery-image"
                src={item.gallery}
                style={{width: '100%', height: '100%', objectFit: 'contain'}}
                alt=""
              />
            </a>
          )}
        />
      </div>
    </div>
  );
}
