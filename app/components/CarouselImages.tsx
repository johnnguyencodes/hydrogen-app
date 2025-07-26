import {useRef} from 'react';
import ImageGallery from 'react-image-gallery';
import {ProductImage} from './ProductImage';
import LeftNav from './ImageGalleryLeftNav';
import RightNav from './ImageGalleryRightNav';

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

  const startY = useRef(0);
  const startX = useRef(0);

  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    startY.current = touch.clientY;
    startX.current = touch.clientX;
  }

  function handleTouchMove(e: React.TouchEvent) {
    const touch = e.touches[0];
    const diffY = Math.abs(touch.clientY - startY.current);
    const diffX = Math.abs(touch.clientX - startX.current);

    // Let vertical scroll pass through
    if (diffY > diffX) {
      e.stopPropagation(); // Stop the gallery from hijacking the gesture
    }
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
                showFullscreenButton={false}
                additionalClass="h-full"
                showIndex={true}
                slideOnThumbnailOver={true}
                startIndex={0}
                renderLeftNav={(onClick, disabled) => (
                  <LeftNav onClick={onClick} disabled={disabled} />
                )}
                renderRightNav={(onClick, disabled) => (
                  <RightNav onClick={onClick} disabled={disabled} />
                )}
                renderItem={(item) => (
                  <div
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    className="overflow-hidden"
                  >
                    <a
                      href={item.original}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:cursor-zoom-in"
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
                  </div>
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
                  className="hover:brightness-90"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
