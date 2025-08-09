import {ProductImage} from './ProductImage';
import {returnFormattedDate} from '~/lib/plantPageUtils';
import useFancybox from '~/lib/useFancybox';

export function JournalEntry({
  entry,
  parsedImageData,
  productTitle,
  width,
  height,
  backgroundColor,
}: JournalEntryComponentProps) {
  const bgColor = `bg-[var(--color-bg-${backgroundColor})]`;

  const formattedEntryDate = returnFormattedDate(entry.date);

  // use these npm packages
  // lightbox: https://yet-another-react-lightbox.com/plugins/thumbnails
  // justified gallery: https://benhowell.github.io/react-grid-gallery/examples/with-yet-another-react-lightbox

  return (
    <div
      className={`journal-entry ${bgColor} -mx-25 px-25 pb-15 pt-10 rounded-md `}
      key={entry.date}
    >
      <div className="flex flex-col gap-4">
        <div className="flex-1">
          <div className="mb-3 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-2xl font-medium text-[var(--color-fg-green)]">
                {entry.title}
              </span>
              <span className="text-lg font-medium text-[var(--color-fg-green)] mb-2">
                {formattedEntryDate}
              </span>
              <div
                className="prose prose-p:text-[var(--color-fg-text)] prose-p:text-sm text-base prose-strong:text-[var(--color-fg-green)] max-w-prose mx-auto"
                dangerouslySetInnerHTML={{__html: entry.content}}
              ></div>
            </div>
          </div>
        </div>
        <div className="journal-image-desktop-container lg:block">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
            {parsedImageData.map((image, idx) => {
              if (image.meta.date === entry.date) {
                return (
                  <div className="gap-1" key={image.image?.url ?? idx}>
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
                      className="object-cover w-full h-full hover:brightness-90"
                      width={width}
                      height={height}
                      data-fancybox="gallery"
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
