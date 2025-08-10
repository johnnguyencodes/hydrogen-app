import {ProductImage} from './ProductImage';
import useFancybox from '~/lib/useFancybox';

export function CarouselImages({
  images,
  productTitle,
  width,
  height,
}: CarouselImagesProps) {
  return (
    <div className="lg:col-start-1 lg:row-span-full ">
      <div className="lg:top-4 lg:sticky">
        {images.length > 0 && (
          <div>
            <div className="carousel-image-desktop-container grid gap-1 grid-cols-12">
              {images.map((image: AdminImageWithMetadata, index: number) => (
                <div
                  key={image.image.url ?? index}
                  className={
                    image.meta.index === 0
                      ? 'col-span-12'
                      : 'col-span-4 lg:col-span-6'
                  }
                >
                  <ProductImage
                    key={image.image.url ?? index}
                    id={image.image.url ?? index}
                    image={{
                      __typename: 'Image',
                      url: image.image.url,
                    }}
                    alt={image.alt || `${productTitle} image`}
                    width={1000}
                    height={1000}
                    className="hover:brightness-90"
                    data-fancybox="gallery"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
