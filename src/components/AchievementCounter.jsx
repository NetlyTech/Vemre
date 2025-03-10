
import React, { useEffect, useState, useRef } from 'react';

const achievements = [
  { number: 200, label: "Seamless Integrations Completed" },
  { number: 10000, label: "Transactions Processed" },
  { number: 60, label: "Male Representation (%)" },
  { number: 40, label: "Female Representation (%)" },
  { number: 20, label: "Countries Served" },
  { number: 30, label: "Reduction in Carbon Footprint (%)" },
];

const AchievementCounter = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-10">Impact</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
        {achievements.map((achievement, index) => (
          <Counter key={index} number={achievement.number} label={achievement.label} />
        ))}
      </div>
    </div>
  );
};

const Counter = ({ number, label }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);
  const duration = 2000; // Total duration in milliseconds
  const incrementTime = duration / 100; // Number of increments (100 steps)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(counterRef.current); // Stop observing after it becomes visible
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

  useEffect(() => {
    if (isVisible) {
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

      return () => clearInterval(counter);
    }
  }, [isVisible, number]);

  return (
    <div ref={counterRef} className="flex flex-col items-center md:px-3">
      <h2 className="text-2xl font-bold text-green-600">{count}+</h2>
      <p className="text-sm md:text-lg px-2 text-center text-gray-700">{label}</p>
    </div>
  );
};

export default AchievementCounter;