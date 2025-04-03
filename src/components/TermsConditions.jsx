import React from 'react';

const TermsConditions = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
      <div className="bg-gray-200 p-6  rounded-lg shadow-lg w-full text-black">
        <h2 className="text-lg font-bold mb-4 ">Terms and Conditions</h2>
        <p className="mb-4">Your terms and conditions content goes here. You can add more details as needed.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Id unde dolorem quos quod repellat porro pariatur facere, minima dignissimos in. Ratione necessitatibus totam placeat provident nemo corrupti ab sit qui.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla maiores ex alias quos! Ipsam delectus rem totam aliquam cum eveniet similique quas corporis doloribus doloremque, voluptate, in eos alias quam.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, quo. Similique explicabo recusandae, illum quos deserunt, reiciendis commodi nostrum assumenda ipsum, cumque deleniti nesciunt neque impedit porro sunt. Blanditiis, tempore.
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat autem adipisci culpa sequi alias. Sapiente perspiciatis animi, commodi soluta labore autem molestias, saepe aspernatur fuga amet accusamus natus doloribus quae?
        </p>
        <button onClick={onClose} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">Close</button>
      </div>
    </div>
  );
};

export default TermsConditions;