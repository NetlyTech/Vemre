// src/Footer.jsx
import React, { useState } from 'react';
import Stripe from '../components/logo/stripe.jpeg';
import Efcc from '../components/logo/efcc.jpg';
import Lemfi from '../components/logo/lemfi.jpeg';
import VemreLogo from '../components/logo/vemre1.png';
import { FaGooglePlay } from "react-icons/fa6";
import { FaApple } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import Link from 'next/link';



  const FooterComp = () => {

  return (
    <footer className="bg-[#0b573d] text-white">
      {/* First Row */}
      <div className="container flex flex-col items-center">
        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
          <div className="mb-4 md:mb-0 flex justify-center">
            <img src={"/logo/vemre1.png"} alt="Vemre Logo" className='w-36 h-32 md:w-36 md:h-[140px] lg:ml-10 lg:mx-32 md:mx-8' />
          </div>
          {/* <div className='flex flex-col items-center md:items-start py-4 px-14 md:px-4 lg:px-16'>
            <h1 className='text-center px-2 font-semibold pl-2 md:pr-10 md:px-6 lg:px-4 py-2 text-lg md:text-xl lg:text-2xl'>Our Partners</h1>
            <div className='flex flex-row justify-center md:justify-start'>
              <img src={Stripe} alt="Stripe Logo" className='rounded-full mx-2 size-10 md:ml-2'/>
              
               <img src={Lemfi} alt="Lemfi Logo" className='rounded-full mx-2 size-10' /> 
               <img src={Efcc} alt="Efcc Logo" className='rounded-full mx-2 size-10' /> 
            </div>
         </div> */}

          <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Follow Us</h1>
      <div className="flex space-x-4">
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="text-white hover:text-blue-800 transition duration-200 size-6 lg:size-8"/>
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaXTwitter className="hover:text-blue-600 transition duration-200 size-6  lg:size-8" />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-pink-600 hover:text-pink-700 transition duration-200 size-6 lg:size-8" />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="text-blue-500 hover:text-blue-900 transition duration-200 size-6 lg:size-8" />
        </a>
      </div>
    </div>


          <div className='md:pr-5 lg:mr-12 px-4 py-2 flex flex-col items-center md:flex md:flex-col'>
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
      
      
      <div className="container flex flex-col justify-center mx-auto px-4 text-center"> 

      <div className='space-x-6'>
      <Link href="/terms" className="text-white underline">
                Terms & Conditions 
      </Link>
      <Link href="/privacy" className="text-white underline">
                Privacy Policy 
      </Link>
        </div>

        <div>
          <p className="text-[12px] md:text-[16px] py-4">&copy; {new Date().getFullYear()} Vemre. All rights reserved.</p>
        </div>
        <div>
          <p className="text-[10px] md:text-sm pb-4 border-t py-2">Designed & Developed by <a className='text-teal-300 underline font-bold font-font2 text-xs md:text-sm hover:text-teal-400' target='blank' href="https://wa.me/2348139376563">Netly Tech Solutions</a></p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComp;