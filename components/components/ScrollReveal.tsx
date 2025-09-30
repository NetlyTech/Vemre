// "use client"

// import React, { ReactNode, useEffect, useRef, useState } from 'react';

// const ScrollReveal = ({ children }: {children: ReactNode}) => {
//   const ref = useRef(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//           observer.disconnect(); // Stop observing after the element is visible
//         }
//       },
//       { threshold: 0.1 } // Trigger when 10% of the element is visible
//     );

//     if (ref.current) {
//       observer.observe(ref.current);
//     }

//     return () => {
//       if (ref.current) {
//         observer.unobserve(ref.current);
//       }
//     };
//   }, []);

//   return (
//     <div
//       ref={ref}
//       className={`transition-opacity duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
//     >
//       {children}
//     </div>
//   );
// };

// export default ScrollReveal;