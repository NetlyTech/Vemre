import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import VemreLogo from '../components/logo/vemre1.png';

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  // Function to handle smooth scrolling
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setNav(false); // Close the mobile navbar after clicking
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: 'Home', sectionId: 'home' },
    { id: 2, text: 'Services', sectionId: 'service' },
    { id: 3, text: 'About', sectionId: 'about' },
    { id: 4, text: 'Team', sectionId: 'team' },
    // { id: 5, text: 'Impact', sectionId: 'impact' },
    { id: 6, text: 'Contact', sectionId: 'contact' },
  ];

  // 0b81a5
  // 0b573d

  return (
    <div className='bg-[#0b573d] font-bold flex justify-between items-center h-18 md:h-20 lg:h-18 mx-auto lg:text-[16px] text-[#ffffff] lg:pr-8 sticky top-0 z-50'>
      {/* Logo */}
     <a href="#"> <img src={VemreLogo} alt="" className='cursor-pointer w-30 h-28 md:w-36 md:h-[140px] lg:pb-1' /></a> 

      {/* Desktop Navigation */}
      <ul className='hidden md:flex'>
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 hover:bg-[#123b49] m-2 cursor-pointer duration-300 hover:text-white'
            onClick={() => scrollToSection(item.sectionId)} // Add click handler
          >
            {item.text}
          </li>
        ))}
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className='block md:hidden px-4'>
        {nav ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-100 bg-[#0b573d] ease-in-out duration-500 z-999'
            : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%] z-999'
        }
      >
        {/* Mobile Logo */}
        <a href="#"><img src={VemreLogo} alt="" className='pr-4 w-36 h-32 lg:w-36 lg:h-[140px] lg:pb-1 cursor-pointer' /> </a>

        {/* Mobile Navigation Items */}
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 px-6 border-b rounded-xl hover:bg-[#123b49] duration-300 hover:text-white cursor-pointer border-gray-300'
            onClick={() => scrollToSection(item.sectionId)} // Add click handler
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;