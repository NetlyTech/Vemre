// "use client";

// import React, { useEffect, useState } from 'react';
// import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
// import Image from 'next/image';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// ////

// const navRoute = [
//   { id: 1, text: 'Home', link: '/' },
//   { id: 2, text: 'Services', sectionId: 'service' },
//   { id: 3, text: 'About', sectionId: 'about' },
//   { id: 5, text: 'Contact', link: '/contact' },
// ];

// const Navbar = () => {
//   const router = useRouter();
//   const [nav, setNav] = useState(false);
//   const [navItems, setNavItems] = useState(navRoute);
//   const pathname = usePathname();

//   const handleNav = () => {
//     setNav(!nav);
//   };

//   // Function to handle smooth scrolling (only if section exists)
//   const scrollToSection = (id: string) => {
//     const section = document.getElementById(id);
//     if (section) {
//       section.scrollIntoView({ behavior: 'smooth' });
//     }
//     setNav(false); // Close the mobile navbar after clicking
//   };

//   // Unified click handler for all nav items
//   const handleNavClick = (item: any) => {
//     if (item.id === 6) {
//       // Dashboard: Always navigate
//       router.push('/dashboard');
//     } else if (item.link) {
//       // Contact: Navigate if not already there; otherwise scroll to top
//       if (pathname === item.link) {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//       } else {
//         router.push(item.link);
//       }
//     } else if (item.sectionId) {
//       // Services/About: Scroll if on home; otherwise navigate to home
//       if (pathname === '/') {
//         scrollToSection(item.sectionId);
//       } else {
//         router.push('/'); // Navigate to home, where sections exist
//       }
//     }
//     setNav(false); // Close mobile nav after any click
//   };

//   useEffect(() => {
//     const checkAuth = () => {
//       const cookies = document.cookie.split(";");
//       const authCookie = cookies.find((cookie) => cookie.trim().startsWith("auth="));
//       const token = localStorage.getItem("accessToken") || "";

//       const isAuthenticated = !!(token && authCookie);
//       const newNavItems = isAuthenticated 
//         ? [...navRoute, { id: 6, text: 'Dashboard', sectionId: 'dashboard' }]
//         : navRoute;

//       // Only update if changed (prevents unnecessary re-renders)
//       if (JSON.stringify(newNavItems) !== JSON.stringify(navItems)) {
//         setNavItems(newNavItems);
//       }
//     };

//     checkAuth();
//   }, [pathname]);  // Dependency unchanged, but internal check optimizes

//   return (
//     <div className='bg-[#0b573d] font-bold flex justify-between items-center h-20 mx-auto lg:text-[16px] text-[#ffffff] lg:pr-8 sticky top-0 z-50'>
//       {/* Logo - Always shows */}
//       <Link href="/"> 
//         <Image 
//           src="/logo/vemre1.png" 
//           width={100}
//           height={100}
//           alt="Company Logo"
//           className='cursor-pointer w-32 h-28 md:w-36 md:h-[140px] lg:pb-1'
//         />
//       </Link> 

//       {/* Desktop Navigation - Always visible */}
//       <ul className='hidden md:flex'>
//         {navItems.map((item, index) => {
//           // Check if active for highlighting
//           const isActive = (item.link && pathname === item.link) || 
//                            (item.sectionId && pathname === '/' && window.location.hash === `#${item.sectionId}`);
          
//           return (
//             <li
//               key={`${item.id}-${index}`}  // Fixed: Unique key with index to prevent warnings
//               className={`p-4 m-2 cursor-pointer duration-300 hover:text-white ${
//                 isActive ? 'bg-[#123b49]' : 'hover:bg-[#123b49]'
//               }`}
//               onClick={() => handleNavClick(item)}
//             >
//               {item.text}
//             </li>
//           );
//         })}
//       </ul>

//       {/* Mobile Navigation Icon - Hamburger, always visible */}
//       <div onClick={handleNav} className='block md:hidden px-4'>
//         {nav ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
//       </div>

//       {/* Mobile Navigation Menu - Always rendered */}
//       <ul
//         className={
//           nav
//             ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-100 bg-[#0b573d] ease-in-out duration-500 z-[999]'
//             : 'fixed top-0 bottom-0 left-[-100%] w-[60%] ease-in-out duration-500 z-[999]'
//         }
//       >
//         {/* Mobile Logo */}
//         <Link href="/" className="flex items-center p-4">
//           <Image 
//             src="/logo/vemre1.png" 
//             alt="Company Logo"
//             width={100}
//             height={100}
//             className='pr-4 w-32 h-28 cursor-pointer' 
//           /> 
//         </Link>

//         {/* Mobile Navigation Items */}
//         {navItems.map((item, index) => {
//           // Active state for mobile too
//           const isActive = (item.link && pathname === item.link) || 
//                            (item.sectionId && pathname === '/' && window.location.hash === `#${item.sectionId}`);
          
//           return (
//             <li
//               key={`${item.id}-${index}`}  // Fixed: Unique key with index to prevent warnings
//               className={`p-4 px-6 border-b rounded-xl duration-300 hover:text-white cursor-pointer border-gray-300 ${
//                 isActive ? 'bg-[#123b49]' : 'hover:bg-[#123b49]'
//               }`}
//               onClick={() => handleNavClick(item)}
//             >
//               {item.text}
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default Navbar;

// "use client";

// import React, { useEffect, useState } from 'react';
// import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
// import Image from 'next/image';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';

// const navRoute = [
//   { id: 2, text: 'Services', sectionId: 'service' },
//   { id: 3, text: 'About', sectionId: 'about' },
//   { id: 5, text: 'Contact', link: '/contact' },
// ];

// const Navbar = () => {
//   const router = useRouter();
//   const [nav, setNav] = useState(false);
//   const [navItems, setNavItems] = useState(navRoute);
//   const pathname = usePathname();
//   const asPath  = router;  // Use asPath for safe hash access (includes #hash)

//   const handleNav = () => {
//     setNav(!nav);
//   };

//   // Function to handle smooth scrolling (guarded for SSR)
//   const scrollToSection = (id: string) => {
//     if (typeof document !== 'undefined') {
//       const section = document.getElementById(id);
//       if (section) {
//         section.scrollIntoView({ behavior: 'smooth' });
//       }
//     }
//     setNav(false); // Close the mobile navbar after clicking
//   };

//   // Unified click handler for all nav items (guarded for SSR)
//   const handleNavClick = (item: any) => {
//     if (item.id === 6) {
//       // Dashboard: Always navigate
//       router.push('/dashboard');
//     } else if (item.link) {
//       // Contact: Navigate if not already there; otherwise scroll to top (guarded)
//       if (pathname === item.link) {
//         if (typeof window !== 'undefined') {
//           window.scrollTo({ top: 0, behavior: 'smooth' });
//         }
//       } else {
//         router.push(item.link);
//       }
//     } else if (item.sectionId) {
//       // Services/About: Scroll if on home; otherwise navigate to home
//       if (pathname === '/') {
//         scrollToSection(item.sectionId);
//       } else {
//         router.push('/'); // Navigate to home, where sections exist
//       }
//     }
//     setNav(false); // Close mobile nav after any click
//   };

//   useEffect(() => {
//     const checkAuth = () => {
//       const cookies = document.cookie.split(";");  // document.cookie is safe (available on server too)
//       const authCookie = cookies.find((cookie) => cookie.trim().startsWith("auth="));
//       const token = localStorage.getItem("accessToken") || "";  // localStorage: Guard if needed, but useEffect is client-only

//       const isAuthenticated = !!(token && authCookie);
//       const newNavItems = isAuthenticated 
//         ? [...navRoute, { id: 6, text: 'Dashboard', sectionId: 'dashboard' }]
//         : navRoute;

//       // Only update if changed (prevents unnecessary re-renders)
//       if (JSON.stringify(newNavItems) !== JSON.stringify(navItems)) {
//         setNavItems(newNavItems);
//       }
//     };

//     checkAuth();
//   }, [pathname]);

//   return (
//     <div className='bg-[#0b573d] font-bold flex justify-between items-center h-20 mx-auto lg:text-[16px] text-[#ffffff] lg:pr-8 sticky top-0 z-50'>
//       {/* Logo - Always shows */}
//       <Link href="/"> 
//         <Image 
//           src="/logo/vemre1.png" 
//           width={100}
//           height={100}
//           alt="Company Logo"
//           className='cursor-pointer w-32 h-28 md:w-36 md:h-[140px] lg:pb-1'
//         />
//       </Link> 

//       {/* Desktop Navigation - Always visible */}
//       <ul className='hidden md:flex'>
//         {navItems.map((item, index) => {
//           // Check if active for highlighting (uses asPath for safe hash access)
//           const isActive = (item.link && pathname === item.link) || 
//                            (item.sectionId && pathname === '/' && asPath.includes(`#${item.sectionId}`));
          
//           return (
//             <li
//               key={`${item.id}-${index}`}  // Unique key to prevent warnings
//               className={`p-4 m-2 cursor-pointer duration-300 hover:text-white ${
//                 isActive ? 'bg-[#123b49]' : 'hover:bg-[#123b49]'
//               }`}
//               onClick={() => handleNavClick(item)}
//             >
//               {item.text}
//             </li>
//           );
//         })}
//       </ul>

//       {/* Mobile Navigation Icon - Hamburger, always visible */}
//       <div onClick={handleNav} className='block md:hidden px-4'>
//         {nav ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
//       </div>

//       {/* Mobile Navigation Menu - Always rendered */}
//       <ul
//         className={
//           nav
//             ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-100 bg-[#0b573d] ease-in-out duration-500 z-[999]'
//             : 'fixed top-0 bottom-0 left-[-100%] w-[60%] ease-in-out duration-500 z-[999]'
//         }
//       >
//         {/* Mobile Logo */}
//         <Link href="/" className="flex items-center p-4">
//           <Image 
//             src="/logo/vemre1.png" 
//             alt="Company Logo"
//             width={100}
//             height={100}
//             className='pr-4 w-32 h-28 cursor-pointer' 
//           /> 
//         </Link>

//         {/* Mobile Navigation Items */}
//         {navItems.map((item, index) => {
//           // Active state for mobile too (uses asPath for safe hash access)
//           const isActive = (item.link && pathname === item.link) || 
//                            (item.sectionId && pathname === '/' && asPath.includes(`#${item.sectionId}`));
          
//           return (
//             <li
//               key={`${item.id}-${index}`}  // Unique key to prevent warnings
//               className={`p-4 px-6 border-b rounded-xl duration-300 hover:text-white cursor-pointer border-gray-300 ${
//                 isActive ? 'bg-[#123b49]' : 'hover:bg-[#123b49]'
//               }`}
//               onClick={() => handleNavClick(item)}
//             >
//               {item.text}
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default Navbar;


"use client";

import React, { useEffect, useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// Type for nav items (TS-friendly)
type NavItem = {
  id: number;
  text: string;
  sectionId?: string;
  link?: string;
};

const navRoute: NavItem[] = [
  { id: 1, text: 'Home', link: '/' },
  { id: 2, text: 'Services', sectionId: 'service' },
  { id: 3, text: 'About', sectionId: 'about' },
  { id: 5, text: 'Contact', link: '/contact' },
];

const Navbar = () => {
  const router = useRouter();
  const [nav, setNav] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>(navRoute);
  const pathname = usePathname();

  const handleNav = () => {
    setNav(!nav);
  };

  // Function to handle smooth scrolling (guarded for SSR)
  const scrollToSection = (id: string) => {
    if (typeof document !== 'undefined') {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setNav(false); // Close the mobile navbar after clicking
  };

  // Unified click handler for all nav items (guarded for SSR)
  const handleNavClick = (item: NavItem) => {
    if (item.id === 6) {
      // Dashboard: Always navigate
      router.push('/dashboard');
    } else if (item.link) {
      // Contact: Navigate if not already there; otherwise scroll to top (guarded)
      if (pathname === item.link) {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        router.push(item.link);
      }
    } else if (item.sectionId) {
      // Services/About: Scroll if on home; otherwise navigate to home
      if (pathname === '/') {
        scrollToSection(item.sectionId);
      } else {
        router.push('/'); // Navigate to home, where sections exist
      }
    }
    setNav(false); // Close mobile nav after any click
  };

  useEffect(() => {
    const checkAuth = () => {
      // Guard for full client-side execution (prevents SSR errors)
      if (typeof window !== 'undefined') {
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find((cookie) => cookie.trim().startsWith('auth='));
        const token = localStorage.getItem('accessToken') || '';

        const isAuthenticated = !!(token && authCookie);
        const newNavItems: NavItem[] = isAuthenticated
          ? [...navRoute, { id: 6, text: 'Dashboard', sectionId: 'dashboard' }]
          : navRoute;

        // Only update if changed (prevents unnecessary re-renders)
        if (newNavItems.length !== navItems.length || JSON.stringify(newNavItems) !== JSON.stringify(navItems)) {
          setNavItems(newNavItems);
        }
      }
    };

    checkAuth();
  }, [pathname]);  // Stable deps; internal check handles updates

  return (
    <div className="bg-[#0b573d] font-bold flex justify-between items-center h-20 mx-auto lg:text-[16px] text-[#ffffff] lg:pr-8 sticky top-0 z-50">
      {/* Logo - Always shows */}
      <Link href="/">
        <Image
          src="/logo/vemre1.png"
          width={100}
          height={100}
          alt="Company Logo"
          className="cursor-pointer w-32 h-28 md:w-36 md:h-[140px] lg:pb-1"
        />
      </Link>

      {/* Desktop Navigation - Always visible */}
      <ul className="hidden md:flex">
        {navItems.map((item, index) => {
          // Check if active for highlighting (guarded hash check for sectionId)
          const currentHash = typeof window !== 'undefined' ? window.location.hash : '';
          const isActive =
            (item.link && pathname === item.link) ||
            (item.sectionId && pathname === '/' && currentHash === `#${item.sectionId}`);

          return (
            <li
              key={`${item.id}-${index}`}  // Unique key to prevent warnings
              className={`p-4 m-2 cursor-pointer duration-300 hover:text-white ${
                isActive ? 'bg-[#123b49]' : 'hover:bg-[#123b49]'
              }`}
              onClick={() => handleNavClick(item)}
            >
              {item.text}
            </li>
          );
        })}
      </ul>

      {/* Mobile Navigation Icon - Hamburger, always visible */}
      <div onClick={handleNav} className="block md:hidden px-4">
        {nav ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
      </div>

      {/* Mobile Navigation Menu - Always rendered */}
      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-100 bg-[#0b573d] ease-in-out duration-500 z-[999]'
            : 'fixed top-0 bottom-0 left-[-100%] w-[60%] ease-in-out duration-500 z-[999]'
        }
      >
        {/* Mobile Logo */}
        <Link href="/" className="flex items-center p-4">
          <Image
            src="/logo/vemre1.png"
            alt="Company Logo"
            width={100}
            height={100}
            className="pr-4 w-32 h-28 cursor-pointer"
          />
        </Link>

        {/* Mobile Navigation Items */}
        {navItems.map((item, index) => {
          // Active state for mobile too (guarded hash check)
          const currentHash = typeof window !== 'undefined' ? window.location.hash : '';
          const isActive =
            (item.link && pathname === item.link) ||
            (item.sectionId && pathname === '/' && currentHash === `#${item.sectionId}`);

          return (
            <li
              key={`${item.id}-${index}`}  // Unique key to prevent warnings
              className={`p-4 px-6 border-b rounded-xl duration-300 hover:text-white cursor-pointer border-gray-300 ${
                isActive ? 'bg-[#123b49]' : 'hover:bg-[#123b49]'
              }`}
              onClick={() => handleNavClick(item)}
            >
              {item.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Navbar;