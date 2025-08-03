export default function MasonryGallery({images}: {images: any[]}) {
  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-3 auto-rows-[250px] gap-4">
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
