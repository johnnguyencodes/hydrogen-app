import ImageGallery from 'react-image-gallery';
import {ProductImage} from './ProductImage';
import LeftNav from './ImageGalleryLeftNav';
import RightNav from './ImageGalleryRightNav';

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
  function generateJournalImageGalleryArray(
    parsedImageData: AdminImageWithMetadata[],
  ) {
    return parsedImageData
      .filter((image) => image.meta.date === entry.date)
      .map((image) => ({
        original: `${image.image.url}&width=${image.image.width}&height=${image.image.height}&crop=center`,
        gallery: `${image.image.url}&width=1000&height=1000&crop=center`,
        thumbnail: `${image.image.url}&width=100&height=100&crop=center`,
      }));
  }

  const journalImageGalleryArray =
    generateJournalImageGalleryArray(parsedImageData);

  function handleImageClick(): void {
    setImageGalleryArray(journalImageGalleryArray);
    setIsImageGalleryVisible(!isImageGalleryVisible);
  }

  const startY = useRef(0);
  const startX = useRef(0);

  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    startY.current = touch.clientY;
    startX.current = touch.clientX;
  }

  function handleTouchMove(e: React.TouchEvent) {
    const touch = e.touches[0];
    const diffY = Math.abs(touch.clientY - startY.current);
    const diffX = Math.abs(touch.clientX - startX.current);

    // Let vertical scroll pass through
    if (diffY > diffX) {
      e.stopPropagation(); // Stop the gallery from hijacking the gesture
    }
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
            className="prose prose-p:text-[var(--color-fg-text)] prose-p:text-sm text-base prose-strong:text-[var(--color-fg-green)] max-w-prose"
            dangerouslySetInnerHTML={{__html: entry.content}}
          ></div>
          {journalImageGalleryArray.length > 0 && (
            <div className="journal-image-mobile-container lg:hidden -mx-10">
              <ImageGallery
                items={journalImageGalleryArray}
                showPlayButton={false}
                showFullscreenButton={false}
                additionalClass="h-full"
                showIndex={true}
                slideOnThumbnailOver={true}
                startIndex={0}
                renderLeftNav={(onClick, disabled) => (
                  <LeftNav onClick={onClick} disabled={disabled} />
                )}
                renderRightNav={(onClick, disabled) => (
                  <RightNav onClick={onClick} disabled={disabled} />
                )}
                renderItem={(item) => (
                  <div
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    className="overflow-hidden"
                  >
                    <a
                      href={item.original}
                      className="hover:cursor-zoom-in"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{display: 'block', width: '100%', height: '100%'}}
                    >
                      <img
                        className="image-gallery-image"
                        src={item.gallery}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                        alt=""
                      />
                    </a>
                  </div>
                )}
              />
            </div>
          )}
        </div>
        <div className="journal-image-desktop-container flex-shrink-0 hidden lg:inline lg:max-w-[350px] xl:max-w-[650px]">
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
