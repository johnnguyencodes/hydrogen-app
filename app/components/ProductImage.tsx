import {Image} from '@shopify/hydrogen';
import clsx from 'clsx';

export function ProductImage({
  image,
  alt,
  id,
  className,
  sizes,
}: ProductImageProps) {
  if (!image) {
    return <div className="product-image"></div>;
  }

  return (
    <div className="product-image cursor-zoom-in">
      <a
        data-fancybox="gallery"
        href={image.url}
        data-src={`${image.url}&width=3024`} // Default source if srcset fails
        data-srcset={`
    ${image.url}&width=200 200w,
    ${image.url}&width=400 400w,
    ${image.url}&width=800 800w,
    ${image.url}&width=1200 1200w,
    ${image.url}&width=1600 1600w,
    ${image.url}&width=2000 2000w,
    ${image.url}&width=2400 2400w,
    ${image.url}&width=3024 3024w
  `}
        data-sizes="
    (max-width: 480px) 100vw,
    (max-width: 768px) 100vw,
    (max-width: 1024px) 100vw,
    (max-width: 1440px) 100vw,
    (max-width: 1600px) 100vw,
    (max-width: 1800px) 100vw,
    3024px
  "
      >
        <Image
          id={id}
          alt={alt}
          aspectRatio="1/1"
          data={image}
          className={clsx(className)}
          sizes={sizes}
        ></Image>
      </a>
    </div>
  );
}
