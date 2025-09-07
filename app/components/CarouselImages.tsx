import {ProductImage} from './ProductImage';

export function CarouselImages({images, productTitle}: CarouselImagesProps) {
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
                    sizes={
                      image.meta.index === 0
                        ? '(max-width: 440px) 400px, (max-width: 540px) 500px, (max-width: 640px) 600px, (max-width: 740px) 700px, (max-width: 840px) 800px, (max-width: 940px) 900px, (max-width: 1023px) 1000px, (max-width: 1120px) 600px, (max-width: 1220px) 700px, (max-width: 1320px) 800px, (max-width: 1535px) 900px, 1000px'
                        : '(max-width: 345px) 100px, (max-width: 650px) 200px, (max-width: 940px) 300px, (max-width: 1023px) 400px, (max-width: 1124px) 300px, (max-width: 1324px) 400px, 500px'
                    }
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
