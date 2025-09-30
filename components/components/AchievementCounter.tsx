"use client"

import React, { useEffect, useState, useRef } from 'react';

const achievements = [
  { number: 200, label: "Seamless Integrations Completed" },
  { number: 10000, label: "Transactions Processed" },
  // { number: 60, label: "Female Representation (%)" },
  // { number: 40, label: "Male Representation (%)" },
  { number: 20, label: "Countries Served (Africa, Europe & USA)" },
  { number: 30, label: "Reduction in Carbon Footprint (%)" },
];

const AchievementCounter = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6 bg-white">
      <h2 className="text-lg md:text-2xl lg:text-3xl font-sans font-bold mb-10 text-black">Impact</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:px-4">
        {achievements.map((achievement, index) => (
          <Counter key={index} number={achievement.number} label={achievement.label} />
        ))}
      </div>
    </div>
  );
};

const Counter = ({ number, label }:{number: number, label: string}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);
  const duration = 8000; // Total duration in milliseconds
  const incrementTime = duration / 100; // Number of increments (100 steps)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setCount(0); // Reset count to 0
          startCounting(); // Start counting
        } else {
          setIsVisible(false); // Reset visibility state
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  const startCounting = () => {
    let start = 0;
    const end = number;
    const increment = Math.ceil(end / 100); // Calculate the increment based on the total number of steps

    const counter = setInterval(() => {
      if (start < end) {
        start += increment; // Increment by the calculated value
        if (start > end) start = end; // Ensure we don't exceed the end value
        setCount(start);
      } else {
        clearInterval(counter);
      }
    }, incrementTime);
  };

  // Function to format the number with commas
  const formatNumber = (num:number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div ref={counterRef} className="flex flex-col items-center md:px-3">
      {isVisible ? (
        <>
          <h2 className="text-2xl font-bold text-green-800">
            {formatNumber(count)}{label.includes('%') ? '+' : ''}
            {label.includes('%') ? '%' : '+'}
          </h2>
          <p className="text-sm md:text-lg px-2 text-center text-gray-700">{label}</p>
        </>
      ) : (
        <div className="flex items-center justify-center w-16 h-16">
          <div className="animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-green-500 w-12 h-12"></div>
        </div>
      )}
    </div>
  );
};

export default AchievementCounter;