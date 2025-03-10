// src/Footer.jsx
import React from 'react';
import VemreLogo from '../components/logo/vemre1.png';
import Stripe from '../components/logo/stripe.jpeg';
import Lemfi from '../components/logo/lemfi.jpeg';
import { FaGooglePlay } from "react-icons/fa6";
import { FaApple } from "react-icons/fa";

const FooterComp = () => {
  return (
    <footer className="bg-[#0b81a5] text-white">
      {/* First Row */}
      <div className="container flex flex-col items-center">
        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
          <div className="mb-4 md:mb-0 flex justify-center">
            <img src={VemreLogo} alt="Vemre Logo" className='w-30 h-28 md:w-36 md:h-[140px] lg:ml-10' />
          </div>
          <div className='flex flex-col items-center md:items-start py-4 px-14 lg:px-0'>
            <h1 className='text-center px-2 font-semibold pl-2 md:ml-14 py-2 text-2xl'>Our Partners</h1>
            <div className='flex flex-row justify-center md:justify-start'>
              <img src={Stripe} alt="Stripe Logo" className='rounded-full mx-2 size-16 md:ml-26'/>
              {/* Uncomment if you want to include Lemfi logo */}
              {/* <img src={Lemfi} alt="Lemfi Logo" className='rounded-full mx-2' /> */}
            </div>
          </div>
          <div className='md:mr-0 px-4 py-6 flex flex-col items-center md:flex md:flex-col'>
            <h1 className='pb-0 text-sm pl-2'>Install Our App</h1>
            <div className='flex gap-2 justify-center md:justify-start'>
              <a href="#">
                <div className='flex flex-row items-center gap-4 cursor-pointer'>
                  <h1 className='text-sm font-semibold border py-2 px-2 flex gap-3 items-center bg-black hover:bg-[#123b49]'> <FaGooglePlay /> Google </h1>
                </div>
              </a>
              <a href="#">
                <div className='flex flex-row items-center gap-4'>
                  <h1 className='text-[14px] font-semibold border py-2 px-2 flex gap-2 items-center bg-black hover:bg-[#123b49]'> <FaApple /> Apple </h1>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="container flex flex-col justify-center mx-auto px-4 text-center">
        <div>
          <p className="text-[12px] md:text-[16px] py-4">&copy; {new Date().getFullYear()} Vemre. All rights reserved.</p>
        </div>
        <div>
          <p className="text-[10px] md:text-sm pb-4 border-t py-2">Designed & Developed by <a className='text-teal-300 underline font-bold font-font2 text-xs md:text-sm hover:text-teal-400' target='blank' href="https://wa.me/message/4QUX4TP6QSK7C1">Netly Tech Solutions</a></p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComp;