import type React from 'react';
import {useEffect, useState} from 'react';
import {cn} from '~/lib/utils';

interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function HeroCarousel({
  items,
  autoPlay,
  autoPlayInterval,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoPlay) return; // Only run if autoplay is enabled

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [autoPlay, autoPlayInterval, items.length]);

  return (
    <div className="relative w-full">
      {/* Carousel Content */}
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{transform: `translateX(-${currentIndex * 100}%)`}}
        >
          {items.map((item, index) => (
            <div key={index} className="min-w-full">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              currentIndex === index
                ? 'w-8 bg-primary'
                : 'w-2 bg-primary/30 hover:bg-primary/50',
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
