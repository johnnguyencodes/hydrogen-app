import ImageGallery from 'react-image-gallery';
import {Button} from './ui/button';

export function ImageGalleryComponent({
  images,
  handleImageGalleryClick,
}: ImageGalleryComponentProps) {
  // if (index === null) {
  //   index = 0;
  // }

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
          onClick={handleImageGalleryClick}
        >
          X
        </Button>
        <ImageGallery
          items={images}
          showPlayButton={false}
          additionalClass="h-full"
          showIndex={true}
          slideOnThumbnailOver={true}
          renderItem={(item) => (
            <a
              href={item.original}
              target="_blank"
              rel="noopener noreferrer"
              style={{display: 'block', width: '100%', height: '100%'}}
            >
              <img
                className="image-gallery-image"
                src={item.original}
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
