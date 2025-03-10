import React, { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

const AccordionItem = ({ title, content, isOpen, onToggle }) => {
  return (
    <div className="border-2 border-gray-300 mx-4 md:mx-12 lg:border rounded-2xl my-3">
      <div
        className="flex justify-between items-center p-4 cursor-pointer transition duration-300 ease-in-out"
        onClick={onToggle}
      >
        <h2 className="relative text-[14px] lg:px-0 lg:text-xl font-semibold">{title}</h2>
        
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
      title: 'QUESTION 1',
      content: 'ANSWER 1',
    },
    
    {
      title: 'QUESTION 2',
      content: 'ANSWER 2',
    },
    {
      title: 'QUESTION 3',
      content: "ANSWER 3",
    },
    {
      title: 'QUESTION 4',
      content: 'ANSWER 4',
    },

    {
      title: 'QUESTION 5',
      content: "ANSWER 5",
    },
    {
      title: 'QUESTION 6',
      content: "ANSWER 6",
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='flex flex-col font-font3 text-gray-800 bg-white'>
          <div className='pt-6 pb-3 lg:pt-12'>
            <h1 className='text-lg md:text-xl lg:text-2xl font-semibold text-center'>Frequently Asked Questions</h1>
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