export default function MasonryGallery({images}: {images: any[]}) {
  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-12 auto-rows-[50px] gap-1">
        {images.map((image, index) => (
          <div
            key={index}
            className={`overflow-hidden border relative ${image.className ?? ''}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
