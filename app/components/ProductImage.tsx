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
        data-sizes="100vw"
        data-lazy-src={image.url}
      >
        <Image
          id={id}
          alt={alt}
          aspectRatio="1/1"
          data={image}
          className={clsx(className)}
          sizes={sizes}
          loading="lazy"
        ></Image>
      </a>
    </div>
  );
}
