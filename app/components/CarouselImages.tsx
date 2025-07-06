import {ProductImage} from './ProductImage';

export function CarouselImages({
  latestCarouselImages,
  productTitle,
  setImageGalleryArray,
  setIsImageGalleryVisible,
  isImageGalleryVisible,
}: CarouselImagesProps) {
  function handleImageClick(): void {
    const generatedImageGallery = latestCarouselImages.map((image) => ({
      original: `${image.image.url}&width=2048&height=2048&crop=center`,
      thumbnail: `${image.image.url}&width=100&height=100&crop=center`,
    }));

    setImageGalleryArray(generatedImageGallery);
    setIsImageGalleryVisible(!isImageGalleryVisible);
  }

  return (
    <div className="col-span-2">
      {latestCarouselImages.length > 0 && (
        <div className="carousel-images grid gap-1 grid-cols-2">
          {latestCarouselImages.map((img, index) => (
            <ProductImage
              key={img.image.url ?? index}
              id={img.image.url ?? index}
              image={{
                __typename: 'Image',
                url: img.image.url,
              }}
              alt={img.alt || `${productTitle} image`}
              onClick={handleImageClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
