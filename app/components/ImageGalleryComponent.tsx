import ImageGallery from 'react-image-gallery';
import {Button} from './ui/button';

export function ImageGalleryComponent({
  images,
  // setImageGalleryArray,
  // setIsImageGalleryVisible,
  // isImageGalleryVisible,
  handleImageGalleryClick,
}: ImageGalleryComponentProps) {
  // if (index === null) {
  //   index = 0;
  // }

  return (
    <div>
      <Button className="border border-black" onClick={handleImageGalleryClick}>
        Gallery Button
      </Button>
      <div>
        <ImageGallery items={images} />
      </div>
    </div>
  );
}
