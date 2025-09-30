// Map.tsx
import React from "react";

interface MapProps {
  src?: string;
  width?: string | number;
  height?: string | number;
  title?: string;
}

const Map: React.FC<MapProps> = ({
  src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.944801469005!2d-83.98830380986955!3d33.63267319786009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f44b3c65996e4b%3A0xe3f5ab6f33ffb207!2s3826%20Salem%20Rd%20%23194%2C%20Covington%2C%20GA%2030016%2C%20USA!5e0!3m2!1sen!2sng!4v1741594933492!5m2!1sen!2sng",
  width = "100%",
  height = 300,
  title = "Company Location Map",
}) => {
  return (
    <div className="w-full py-10">
      <h2 className="pt-6 text-center text-green-800 text-2xl md:3xl font-bold mb-4">Find us via the Map</h2>
      <iframe
        src={src}
        width={width}
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
      ></iframe>
    </div>
  );
};

export default Map;
