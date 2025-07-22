import ImageGallery from 'react-image-gallery';
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
  function generateCarouselImageGalleryArray(images: AdminImageWithMetadata[]) {
    return images.map((image) => ({
      original: `${image.image.url}&width=${image.image.width}&height=${image.image.height}&crop=center`,
      gallery: `${image.image.url}&width=1000&height=1000&crop=center`,
      thumbnail: `${image.image.url}&width=100&height=100&crop=center`,
    }));
  }

  const imageCarouselImageArray = generateCarouselImageGalleryArray(images);

  function handleImageClick(): void {
    setImageGalleryArray(imageCarouselImageArray);
    setIsImageGalleryVisible(!isImageGalleryVisible);
  }

  return (
    <div className="lg:col-start-1 lg:row-span-full ">
      <div className="lg:top-[var(--navbar-height)] lg:sticky">
        {images.length > 0 && (
          <div>
            <div className="carousel-image-mobile-container lg:hidden gap-1 grid-cols-2 -mx-5">
              <ImageGallery
                items={imageCarouselImageArray}
                showPlayButton={false}
                additionalClass="h-full"
                showIndex={true}
                slideOnThumbnailOver={true}
                startIndex={0}
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
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                      alt=""
                    />
                  </a>
                )}
              />
            </div>
            <div className="carousel-image-desktop-container hidden lg:grid gap-1 grid-cols-2">
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
          </div>
        )}
      </div>
    </div>
  );
}
