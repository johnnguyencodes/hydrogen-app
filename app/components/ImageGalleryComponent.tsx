import ImageGallery from 'react-image-gallery';
import {Button} from './ui/button';
import {X} from 'lucide-react';

export function ImageGalleryComponent({
  images,
  startIndex,
  setImageGalleryStartIndex,
  handleImageGalleryClick,
}: ImageGalleryComponentProps) {
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
          className="absolute top-0 right-0 z-100 bg-transparent text-white hover:text-blue-500 bg-black/40 rounded-none leading-none py-2.5 px-5 font-bold hover:bg-black/40 cursor-pointer transition-none"
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
