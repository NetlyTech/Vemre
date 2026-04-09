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
    <div className="items-start flex flex-col md:flex-row lg:p-6">
      <div className="w-full md:w-full p-4 ">
        

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
