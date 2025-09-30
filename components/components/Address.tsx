// Address.tsx
import React from "react";

interface AddressProps {
  headOffice?: string;
  branch?: string;
  email?: string;
  phone?: string;
  time?: string;
}

const Address: React.FC<AddressProps> = ({
  headOffice = "3826 Salem Rd Suite 194 Covington GA 30016",
  branch = "6, Alajorin Street, Ilorin, Kwara State, Nigeria.",
  email = "Info@vemre.com",
  phone = "+1 404 939 3126",
  time = "9:00am - 4:00pm, Mon - Sat",
}) => {
  return (
    <div className="items-start flex flex-col md:flex-row">
      <div className="w-full md:w-full p-4 ">
        <h4 className="text-green-800 text-center text-2xl md:text-4xl font-extrabold mb-2">Get In Touch</h4>
        <h1 className="text-center text-[16px] md:text-[20px] font-bold mb-4">
          Visit us on site or contact us today
        </h1>

        <p className="mb-1 lg:text-left">
          <strong className="text-green-800">Head Office:</strong> {headOffice}
        </p>
        <p className="mb-1 lg:text-left">
          <strong className="text-green-800">Branch:</strong> {branch}
        </p>
        <p className="mb-1 lg:text-left">
          <strong className="text-green-800">Email:</strong> {email}
        </p>
        <p className="mb-1 lg:text-left">
          <strong className="text-green-800">Phone:</strong> {phone}
        </p>
        <p className="lg:text-left">
          <strong className="text-green-800">Time:</strong> {time}
        </p>
      </div>
    </div>
  );
};

export default Address;
