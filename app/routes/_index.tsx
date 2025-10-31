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
      <HeroCarousel2 items={carouselItems} />
      <header className="hero rounded-md text-base lg:top-4">
        <h1 className="hero-title text-balance text-5xl font-medium text-[var(--color-fg-green)] mb-5">
          Hey there, John here!
        </h1>
        <h2 className="hero-paragraph text-3xl font-medium leading-tight max-w-[30ch] text-balance text-[var(--color-fg-text)]">
          I am a web developer, and welcome to my digital corner.
        </h2>
      </header>
      <div className="prose prose-p:text-[var(--color-fg-text)] prose-p:text-sm text-base prose-strong:text-[var(--color-fg-green)] max-w-prose">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vel
          varius enim. Maecenas vel lacus ut elit aliquam egestas eu ut metus.
          Vivamus luctus sodales tempus. Nullam malesuada nunc a lectus aliquam
          varius. Nam turpis purus, mattis vitae cursus sed, viverra quis magna.
          Sed vel egestas mi, et bibendum neque. Nullam consequat, tortor nec
          hendrerit bibendum, quam ex blandit tellus, a aliquam dolor orci a
          erat. Ut vel vestibulum urna. Etiam euismod nulla dui, vitae efficitur
          ligula posuere sit amet. Donec sed quam nec dui blandit hendrerit in
          vel erat.
        </p>
      </div>
    </div>
  );
}
