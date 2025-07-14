import {ProductImage} from './ProductImage';

export function JournalEntry({
  entry,
  parsedImageData,
  productTitle,
  setImageGalleryArray,
  setIsImageGalleryVisible,
  setImageGalleryStartIndex,
  isImageGalleryVisible,
  width,
  height,
}: JournalEntryComponentProps) {
  function handleImageClick(): void {
    const generatedImageGallery = parsedImageData
      .filter((image) => image.meta.date === entry.date)
      .map((image) => ({
        original: `${image.image.url}&width=${image.image.width}&height=${image.image.height}&crop=center`,
        gallery: `${image.image.url}&width=1000&height=1000&crop=center`,
        thumbnail: `${image.image.url}&width=100&height=100&crop=center`,
      }));

    setImageGalleryArray(generatedImageGallery);
    setIsImageGalleryVisible(!isImageGalleryVisible);
  }

  return (
    <div
      className="journal-entry bg-[var(--color-bg-5)] rounded-md p-5 mb-10 "
      key={entry.date}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex-1">
          <div className="mb-3 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm font-medium text-[var(--color-fg-green)]">
                {entry.title}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-[var(--color-fg-green)]">
                {entry.date}
              </span>
            </div>
          </div>
          <div
            className="prose prose-p:text-[var(--color-fg-text)] prose-p:text-sm text-base prose-strong:text-[var(--color-fg-green)]"
            dangerouslySetInnerHTML={{__html: entry.content}}
          ></div>
        </div>
        <div className="journal-image-container flex-shrink-0 max-w-full md:max-w-[720px]">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {parsedImageData.map((image, idx) => {
              if (image.meta.date === entry.date) {
                return (
                  <div
                    className="overflow-hidden flex-shrink-0 w-48 h-48"
                    key={image.image?.url ?? idx}
                  >
                    <ProductImage
                      image={{
                        __typename: 'Image',
                        url: image.image.url,
                      }}
                      alt={
                        image.alt ||
                        `${productTitle} journal image ${image.meta.index}`
                      }
                      key={image.image.url ?? idx}
                      id={image.image.url ?? idx}
                      className="object-cover w-full h-full"
                      onClick={() => {
                        handleImageClick();
                        setImageGalleryStartIndex(image.meta.index);
                      }}
                      width={width}
                      height={height}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
