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
      className={`journal-entry ${bgColor} xxs:-mx-5 xxs:px-5 xxs:rounded-none xl:-mx-25 xl:px-25 pb-15 pt-10 xl:rounded-md`}
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
          <div className="grid grid-cols-12 gap-1">
            {parsedImageData.map((image, idx) => {
              if (image.meta.date === entry.date) {
                return (
                  <div
                    className={
                      image.meta.index <= 2
                        ? 'gap-1 col-span-4'
                        : 'gap-1 col-span-2'
                    }
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
                      className="object-cover w-full h-full hover:brightness-90"
                      width={width}
                      height={height}
                      sizes={
                        image.meta.index <= 2
                          ? '(max-width: 350px) 100px, (max-width: 650px) 200px, (max-width: 950px) 300px, (max-width: 1246px) 400px, 500px'
                          : '(max-width: 660px) 100px, (max-width: 1260px) 200px, 300px'
                      }
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
