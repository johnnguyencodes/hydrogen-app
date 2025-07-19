import {ProductImage} from './ProductImage';

export function CarouselImages({
  images,
  productTitle,
  setImageGalleryArray,
  setIsImageGalleryVisible,
  setImageGalleryStartIndex,
  isImageGalleryVisible,
  width,
  height,
}: CarouselImagesProps) {
  function handleImageClick(): void {
    const generatedImageGallery = images.map((image) => ({
      original: `${image.image.url}&width=${image.image.width}&height=${image.image.height}&crop=center`,
      gallery: `${image.image.url}&width=1000&height=1000&crop=center`,
      thumbnail: `${image.image.url}&width=100&height=100&crop=center`,
    }));

    setImageGalleryArray(generatedImageGallery);
    setIsImageGalleryVisible(!isImageGalleryVisible);
  }

  return (
    <div className="lg:col-start-1 lg:row-span-full ">
      <div className="lg:top-[var(--navbar-height)] lg:sticky">
        {images.length > 0 && (
          <div className="carousel-images grid gap-1 grid-cols-2">
            {images.map((image: AdminImageWithMetadata, index: number) => (
              <ProductImage
                key={image.image.url ?? index}
                id={image.image.url ?? index}
                image={{
                  __typename: 'Image',
                  url: image.image.url,
                }}
                alt={image.alt || `${productTitle} image`}
                onClick={() => {
                  handleImageClick();
                  setImageGalleryStartIndex(image.meta.index);
                }}
                width={width}
                height={height}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
