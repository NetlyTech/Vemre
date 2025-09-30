
import React from 'react';

const About = () => {
  return (
    <section id='about'>
    <div className="py-10 bg-gray-300">
      <div className="container mx-auto px-8 lg:px-16 py-4 flex flex-col lg:flex-row items-center">
        <div className="mb-6 md:mb-0">
          <img
             src={"/pics/aboutt.jpg"}
            alt="About Us"
            className="lg:w-[550px] w-full h-auto rounded-lg shadow-lg md:pb-8"
          />
        </div>
        <div className="w-full md:w-full lg:w-1/2 md:pl-0 lg:pl-10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-0 md:py-6 text-black text-center">About</h2>
          <p className="text-black text-justify">
          <strong className='font-bold  text-black'>VEMRE </strong>  is a technology company, bridging the gap between Nigeria  Tech  Savvies (e.g graphics designers, website/app developers, content writers, data scientists/analysts, cybersecurity engineers/analysts etc) and the GLOBAL TECH SPACE MARKET. We facilitate Tech Savvies penetration into the GLOBAL TECH ECOSYSTEM, helping them to render their services and get paid easily through a SECURE, RELIABLE, EASY, AND ROBUST, (SRER) international payment receiving gateway platform which provides all available means of receiving payment internationally.
          </p>
          <p className="text-black mt-4">
          <strong className='font-bold text-black'>MISSION: </strong>  
          Helping Tech Savvies penetrate the GLOBAL TECH SPACE MARKET with ease.  
          </p>
          <p className="text-black mt-4">
          <strong className='font-bold text-gray-20 '>VISION: </strong>  
          Employment creation and boosting economies of developing countries, by empowering and motivating Tech Savvies to fully utilize their potentials and get rewarded handsomely in the GLOBAL TECH SPACE MARKET.
          </p>
        </div>
      </div>
    </div>
    </section>
  );
};

export default About;