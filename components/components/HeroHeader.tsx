"use client"

import React, { useState, useEffect } from 'react';

const slides = [
  {
    id: 1,
    title: 'Welcome to Vemre',
    description: 'Naija Tech Savvies Penetrating the Global Tech Space with Ease.',
    image: '/pics/1slide.jpg',
  },
  {
    id: 2,
    title: 'Explore Our Services',
    description: 'Globalization Made Easy for Naija Tech Savvies.',
    image: '/pics/2slide.jpg' ,
  },
  {
    id: 3,
    title: 'Navigating the Global Tech Market Space',
    description: 'Helping Tech Savvies Penetrate the Global Tech Market with Ease.',
    image: '/pics/3rdslide copy.jpg'  ,
  },
];

const HeroHeader = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id='home'>
    <div className="relative w-full h-80 md:h-[450px] lg:h-[480px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover inset-0 bl" 
          />

          <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold py-1 md:py-2 text-center">{slide.title}</h2>
            <p className="mt-2 text-sm md:text-lg lg:text-xl text-center px-8">{slide.description}</p>
          </div>
        </div>
      ))}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 px-3 bg-gray-700 text-white text-xs p-2 rounded-full md:px-5 md:text-2xl cursor-pointer hover:bg-gray-600"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white text-xs md:text-2xl px-3 md:px-5 p-2 rounded-full cursor-pointer hover:bg-gray-600"
      >
        &#10095;
      </button>
    </div>
    </section>
  );
};

export default HeroHeader;