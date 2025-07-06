import ImageGallery from 'react-image-gallery';
import {Button} from './ui/button';
import {Dice1} from 'lucide-react';

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
          className="absolute top-4 right-4 z-10"
          onClick={handleImageGalleryClick}
        >
          X
        </Button>
        <ImageGallery
          items={images}
          showPlayButton={false}
          additionalClass="h-full"
        />
      </div>
    </div>
  );
}
