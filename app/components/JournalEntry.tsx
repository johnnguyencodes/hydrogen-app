import {ProductImage} from './ProductImage';

export function JournalEntry({
  entry,
  parsedImageData,
  productTitle,
  latestCarouselDateString,
}: JournalEntryComponentProps) {
  const imageGalleryArray = parsedImageData
    .filter(
      (image) =>
        image.meta.date === entry.date &&
        image.meta.date !== latestCarouselDateString,
    )
    .map((image) => image.image.url);
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
              const galleryImageArray = [];
              if (
                image.meta.date === entry.date &&
                image.meta.date !== latestCarouselDateString
              ) {
                galleryImageArray.push(image.image.url);
                return (
                  <div
                    className="overflow-hidden flex-shrink-0 w-48 h-48"
                    key={image.image?.url ?? idx}
                  >
                    <ProductImage
                      image={{
                        __typename: 'Image',
                        url: image.image?.url,
                      }}
                      alt={
                        image.alt ||
                        `${productTitle} journal image ${image.meta.index}`
                      }
                      key={image.image?.url ?? idx}
                      id={image.image?.url ?? idx}
                      className="object-cover w-full h-full"
                      onClick={() => console.log(imageGalleryArray)}
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
