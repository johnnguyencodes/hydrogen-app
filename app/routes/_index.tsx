import {type MetaFunction} from '@remix-run/react';
import HeroCarousel2 from '../components/HeroCarousel';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

const carouselItems = [
  <div
    key="1"
    className="flex h-96 items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white"
  >
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-2">Slide 1</h2>
      <p className="text-lg">Welcome to the carousel</p>
    </div>
  </div>,
  <div
    key="2"
    className="flex h-96 items-center justify-center bg-gradient-to-br from-green-500 to-teal-600 text-white"
  >
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-2">Slide 2</h2>
      <p className="text-lg">Navigate with arrows or dots</p>
    </div>
  </div>,
  <div
    key="3"
    className="flex h-96 items-center justify-center bg-gradient-to-br from-orange-500 to-red-600 text-white"
  >
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-2">Slide 3</h2>
      <p className="text-lg">Smooth transitions included</p>
    </div>
  </div>,
  <div
    key="4"
    className="flex h-96 items-center justify-center bg-gradient-to-br from-pink-500 to-rose-600 text-white"
  >
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-2">Slide 4</h2>
      <p className="text-lg">Click any dot to jump to a slide</p>
    </div>
  </div>,
];

export default function Homepage() {
  return (
    <div className="home-page xxs:mx-5 2xl:mx-0 mt-4">
      <HeroCarousel2
        items={carouselItems}
        autoPlay={true}
        autoPlayInterval={15000}
      />
      <header className="hero rounded-md text-base lg:top-4">
        <h1 className="hero-title text-pretty text-5xl font-medium text-[var(--color-fg-green)] max-w-[35ch] mb-5">
          Web developer, plant dad, and an <u>obsessed</u> beginner
          photographer.
        </h1>
        <div className="prose max-w-prose prose-p:text-small">
          <p className="hero-paragraph font-medium leading-tight max-w-prose text-pretty text-[var(--color-fg-text)]">
            My name is John and welcome to my corner of the internet.
          </p>
        </div>
      </header>
    </div>
  );
}
