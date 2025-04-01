import React, { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

const AccordionItem = ({ title, content, isOpen, onToggle }) => {
  return (
    <div className="border-2 border-green-800 mx-4 md:mx-12 lg:border-3 rounded-2xl my-3">
      <div
        className="flex justify-between items-center p-4 cursor-pointer transition duration-300 ease-in-out"
        onClick={onToggle}
      >
        <h2 className="relative text-[12px] lg:px-0 lg:text-xl font-semibold">{title}</h2>
        
        <span className='absolute right-12 md:right-20 md:text-xl text-lg lg:right-72 lg:text-3xl'>{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown /> }</span>
      </div>
      {isOpen && <div className="px-6 md:px-4 pb-4 lg:py-4 lg:px-8 text-gray-700">{content}</div>}
    </div>
  );
};

const Accordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const items = [
    {
      title: 'What services does Vemre offer?',
      content: 'Vemre provides international payment solutions, equipment/software renting, third-party integration, and customer-driven tech solutions.',
    },
    
    {
      title: 'How does Vemre help Nigerian Tech Savvies?',
      content: 'We bridge the gap between Nigerian tech professionals and the global market, ensuring seamless service delivery and international payments.',
    },
    {
      title: 'Is Vemre’s international payment gateway secure?',
      content: "Yes, our SRER (Secure, Reliable, Easy, and Robust) payment gateway ensures safe and efficient international transactions.",
    },
    {
      title: 'Can I rent tech equipment from Vemre?',
      content: 'Yes, we offer renting of high-end technological equipment and software to support tech professionals.',
    },

    {
      title: 'How do I get started with Vemre?',
      content: "Simply sign up on our platform, explore our services, and start accessing global opportunities with ease.",
    },
    {
      title: 'How can I contact Vemre for support?',
      content: "You can reach us via email at Info@vemre.com, call +1 404 939 3126, or visit our office in Covington, GA.",
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='flex flex-col font-font3 text-black bg-[#ccd5d4]'>
          <div className='pt-6 pb-3 lg:pt-12'>
            <h1 className='text-sm md:text-2xl lg:text-3xl font-sans font-bold text-center'>FAQs</h1>
          </div>
      <div className="lg:px-48 lg:pt-10 lg:pb-10">
      {items.map((item, index) => (
        <AccordionItem
        key={index}
        title={item.title}
        content={item.content}
        isOpen={openIndex === index}
        onToggle={() => handleToggle(index)}
      />  
      ))}
    </div>
    
    </div>
  );
};

export default Accordion;