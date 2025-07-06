import ImageGallery from 'react-image-gallery';

export function ImageGalleryComponent({
  images,
  index,
  setImageGalleryArray,
  setIsImageGalleryVisible,
  isImageGalleryVisible,
  handleImageGalleryClick,
}: ImageGalleryComponentProps) {
  if (index === null) {
    index = 0;
  }

  return (
    <div>
      <button className="border border-black" onClick={handleImageGalleryClick}>
        Gallery Button
      </button>
      ;
      <ImageGallery images={images} index={index} />
    </div>
  );
}
