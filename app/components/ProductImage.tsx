import {Image} from '@shopify/hydrogen';

export function ProductImage({image, key, alt}: ProductImageProps) {
  if (!image) {
    return <div className="product-image"></div>;
  }

  return (
    <div className="product-image">
      <Image
        alt={alt}
        aspectRatio="1/1"
        data={image}
        key={key}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </div>
  );
}
