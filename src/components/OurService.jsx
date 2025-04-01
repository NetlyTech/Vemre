import React from 'react';
import { FaRegCreditCard } from "react-icons/fa";
import { FaComputer } from "react-icons/fa6";
import { GrConnect } from "react-icons/gr";
import { FaPeopleGroup } from "react-icons/fa6";

const services = [
  {
    id: 1,
    title: 'International Payment',
    description: 'Secure, reliable, easy, and robust (SRER) international payment.',
    icon: <FaRegCreditCard /> ,
  },
  {
    id: 2,
    title: 'Rent a workstation',
    description: 'Rent a workstation with high end and advanced technological equipment and softwares to Tech Savvies.',
    icon: <FaComputer /> ,
  },
  {
    id: 3,
    title: 'Third Party Integration',
    description: 'Empowering professionals with seamless access to global opportunities and financial freedom.',
    icon: <GrConnect />,
  },
  {
    id: 4,
    title: "Customer' Driven Solution",
    description: 'Delivering smart, customer driven solutions for seamless global connectivity.',
    icon:<FaPeopleGroup /> ,
  },
];

const OurService = () => {
  return (
   <section id='service'>
     <div className="py-6 lg:pb-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-black ">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-green-800 rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition-transform transform duration-500 hover:scale-105"
            >
              <div className="text-4xl mb-4 text-white">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-[#ffffff] font-">{service.title}</h3>
              <p className="text-gray-100">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
   </section>
  );
};

export default OurService;