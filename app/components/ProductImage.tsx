import {Image} from '@shopify/hydrogen';
import clsx from 'clsx';

export function ProductImage({
  image,
  alt,
  id,
  className,
  onClick,
}: ProductImageProps & {onClick?: () => void}) {
  if (!image) {
    return <div className="product-image"></div>;
  }

  return (
    <div className="product-image cursor-pointer" onClick={onClick}>
      <Image
        id={id}
        alt={alt}
        aspectRatio="1/1"
        data={image}
        className={clsx(className)}
      />
    </div>
  );
}
