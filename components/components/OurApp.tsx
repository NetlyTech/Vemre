import React from 'react';
const OurApp = () => {
  return (

      <div id="about-app" className="section-p1 bg-[#ccd5d4]">
      <h1 className='text-center text-lg md:text-xl lg:text-3xl py-6 font-semibold'>
        Download Our <a href="#" className='text-green-800 font-bold cursor-pointer underline'>App</a>
      </h1>
      <div className='flex justify-center'>
        {/* <video 
          autoPlay 
          muted 
          loop 
          className="w-full h-auto lg:size-8/12 rounded-4xl"
        >
          <source src={"/banner.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
      </div>
    </div>
  );
}

export default OurApp;