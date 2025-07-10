import {ProductImage} from './ProductImage';

export function CarouselImages({
  images,
  productTitle,
  setImageGalleryArray,
  setIsImageGalleryVisible,
  isImageGalleryVisible,
}: CarouselImagesProps) {
  function handleImageClick(): void {
    const generatedImageGallery = images.map((image) => ({
      original: `${image.image.url}&width=${image.image.width}&height=${image.image.height}&crop=center`,
      thumbnail: `${image.image.url}&width=100&height=100&crop=center`,
    }));

    setImageGalleryArray(generatedImageGallery);
    setIsImageGalleryVisible(!isImageGalleryVisible);
  }

  return (
    <div className="col-span-2">
      {images.length > 0 && (
        <div className="carousel-images grid gap-1 grid-cols-2">
          {images.map((img: AdminImageWithMetadata, index: number) => (
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
