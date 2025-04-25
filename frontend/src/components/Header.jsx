import React from "react";
import useAuth from "@/redux/dispatch/useAuth";;
import { useNavigate } from "react-router-dom"

const Header = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleShareStory = () => {
    navigate('/stories/create'); 
  };

  return (
    <header className="flex w-screen items-center justify-between bg-white shadow-lg p-4">
      <h1 className="text-2xl font-semibold text-gray-800">Story App</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={handleShareStory}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Share Your Story
        </button>
        <button
          onClick={logoutUser}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
