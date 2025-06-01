import {Image} from '@shopify/hydrogen';
import clsx from 'clsx';

export function ProductImage({image, alt, id, className}: ProductImageProps) {
  if (!image) {
    return <div className="product-image"></div>;
  }

  return (
    <div className="product-image">
      <Image
        id={id}
        alt={alt}
        aspectRatio="1/1"
        data={image}
        sizes="(min-width: 45em) 50vw, 100vw"
        className={clsx(className)}
      />
    </div>
  );
}
