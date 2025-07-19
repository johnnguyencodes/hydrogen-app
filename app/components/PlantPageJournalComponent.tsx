import {Suspense} from 'react';
import {Await} from '@remix-run/react';
import {JournalEntry} from './JournalEntry';

export function PlantPageJournalComponent({
  journalPromise,
  parsedImageData,
  productTitle,
  latestCarouselDateString,
  setImageGalleryArray,
  setIsImageGalleryVisible,
  isImageGalleryVisible,
  thumbnailImageWidth,
  thumbnailImageHeight,
  imageGalleryStartIndex,
  setImageGalleryStartIndex,
}: PlantPageJournalComponentProps) {
  return (
    <Suspense fallback={<p> Loading journal...</p>}>
      <Await resolve={journalPromise}>
        {/* data is the resolved value of journalPromise */}
        {(data) => {
          // Await gives us the result of journalPromise when it's done
          const journalMetafield = data?.product?.journal;

          let journal: JournalEntry[] = [];

          try {
            // Parse the raw metafield JSON into a JS array
            journal = journalMetafield?.value
              ? (JSON.parse(journalMetafield.value) as JournalEntry[])
              : [];
          } catch (error) {
            console.error('Failed to parse journal JSON:', error);
          }

          // Render parsed journal entries
          return journal.length > 0 ? (
            <div className="mt-10">
              <h3 className="text-3xl mb-5 mt-3 font-medium leading-tight max-w-[30ch] text-balance text-[var(--color-fg-green)]">
                Journal Entries
              </h3>

              <div className="journal-entries">
                {journal.map((entry) => (
                  <JournalEntry
                    entry={entry}
                    key={entry.date}
                    parsedImageData={parsedImageData}
                    productTitle={productTitle}
                    latestCarouselDateString={latestCarouselDateString}
                    setImageGalleryArray={setImageGalleryArray}
                    setIsImageGalleryVisible={setIsImageGalleryVisible}
                    isImageGalleryVisible={isImageGalleryVisible}
                    width={thumbnailImageWidth}
                    height={thumbnailImageHeight}
                    imageGalleryStartIndex={imageGalleryStartIndex}
                    setImageGalleryStartIndex={setImageGalleryStartIndex}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>No journal entries yet.</p>
          );
        }}
      </Await>
    </Suspense>
  );
}
