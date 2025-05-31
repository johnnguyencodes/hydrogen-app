import {Image} from '@shopify/hydrogen';

export function ProductImage({image, alt, id}: ProductImageProps) {
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
      />
    </div>
  );
}
