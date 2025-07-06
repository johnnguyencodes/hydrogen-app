import ImageGallery from 'react-image-gallery';

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
      <button className="border border-black" onClick={handleImageGalleryClick}>
        Gallery Button
      </button>
      <div>
        <ImageGallery items={images} />
      </div>
    </div>
  );
}
