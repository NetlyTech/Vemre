"use client"

import React, { useEffect, useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import Image from 'next/image'
import Link from 'next/link';
import { usePathname , useRouter} from 'next/navigation';


const navRoute = [
    { id: 2, text: 'Services', sectionId: 'service' },
    { id: 3, text: 'About', sectionId: 'about' },
    // { id: 4, text: 'Team', sectionId: 'team' },
    // { id: 5, text: 'Contact', sectionId: 'contact' },
    { id: 5, text: 'Contact', link: '/contact' },
  ];

const Navbar = () => {
  const router = useRouter();
  const [nav, setNav] = useState(false);
  const [navItems, setNavItems] = useState(navRoute);
   const pathname = usePathname();

   const publicRoutes = ["/"]

   const isPublicRoute = publicRoutes.some((route) => pathname === route)
  

  const handleNav = () => {
    setNav(!nav);
  };

  // Function to handle smooth scrolling
  const scrollToSection = (id:string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setNav(false); // Close the mobile navbar after clicking
  };



  
  
  useEffect(() => {
    const checkAuth = () => {
      // const isAuthenticated = authCookie?.includes("authenticated")
      const cookies = document.cookie.split(";")
      const authCookie = cookies.find((cookie) => cookie.trim().startsWith("auth="))
      const token = localStorage.getItem("accessToken") || "";
  
       if (!token || !authCookie) {
        setNavItems(navRoute); 
      } 
        else {
          setNavItems([...navRoute,  { id: 6, text: 'Dashboard', sectionId: 'dashboard' },])
        } 

      }
  
      checkAuth()
    }, [pathname])




  return (
    <div className='bg-[#0b573d] font-bold flex justify-between items-center h-18 md:h-20 lg:h-18 mx-auto lg:text-[16px] text-[#ffffff] lg:pr-8 sticky top-0 z-50'>
      {/* Logo */}
     <Link href="/" > 
      <Image src={"/logo/vemre1.png"} 
       width={100}
       height={100}
     alt="avatar"  className='cursor-pointer w-30 h-28 md:w-36 md:h-[140px] lg:pb-1' /></Link> 

    {isPublicRoute && <>




      {/* Desktop Navigation */}
      <ul className='hidden md:flex'>
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 hover:bg-[#123b49] m-2 cursor-pointer duration-300 hover:text-white'
            onClick={() => {
              if(item.id === 6) {
                router.push('/dashboard');
                return
              }
               if (item.link) {
               router.push(item.link);
              } else if (item.sectionId) {
              scrollToSection(item.sectionId);
              }
              setNav(false); // Close mobile nav after click (optional)
              }}
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
        {/* <a href="#"> */}
        <Link href="/">
          <Image src={"/logo/vemre1.png"} 
         alt="avatar"
         width={100}
         height={100}
        
        className='pr-4 w-32 h-28 lg:w-36 lg:h-[140px] lg:pb-1 cursor-pointer' /> </Link>

        {/* Mobile Navigation Items */}
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 px-6 border-b rounded-xl hover:bg-[#123b49] duration-300 hover:text-white cursor-pointer border-gray-300'
           onClick={() => {
              if(item.id === 6) {
                router.push('/dashboard');
                return
              }
              
              if (item.link) {
               router.push(item.link);
               } else if (item.sectionId) {
              scrollToSection(item.sectionId);
              }
              setNav(false); // Close mobile nav after click (optional)
              }}
          >
            {item.text}
          </li>
        ))}
      </ul>

     </>}
    </div>
  );
};

export default Navbar;