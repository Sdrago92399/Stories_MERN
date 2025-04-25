import React from "react";
import notFoundImage from '../assets/not-found.png'; 

const StoriesList = () => {
  return (
    <div className="flex w-screen h-screen bg-white items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <img 
        src={notFoundImage} 
        alt="No stories found" 
        className="max-w-md rounded-md" 
      />
    </div>
  );
};

export default StoriesList;
