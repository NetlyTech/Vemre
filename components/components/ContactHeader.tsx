'use client';

import React from 'react';
  import Image from 'next/image';  
  import CustomerCareImage from '@/public/pics/contact.png';  

  const ContactHeader: React.FC = () => {
    return (
      <div className="flex items-center rounded-b-sm shadow-lg justify-center mb-8 w-full">
       
       <div>
         <h4 className="text-green-800 text-center text-3xl md:text-4xl font-extrabold mb-2">Get In Touch</h4>
        <h1 className="text-center text-[12px] md:text-[16px] lg:text-[20px] font-bold mb-4">
          Visit Us on Site or Contact Us Today!
        </h1>
       </div>
        <div className=" mb-6">

          <Image
            src={CustomerCareImage}
            alt="Customer care representative making an enquiry"
          
            className="pt-4 w-96" 
          />
        </div>
      </div>
    );
  };

  export default ContactHeader;
