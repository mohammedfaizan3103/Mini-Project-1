import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", { 
        withCredentials: true 
      });

      // Clear user state and local data
      setUser(null);
      sessionStorage.clear();

      // Redirect to login after slight delay
      setTimeout(() => {
        navigate("/login");
      }, 300);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <div className="text-white font-bold text-xl cursor-pointer" onClick={() => navigate("/")}>
              ChronoFlow
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-white hover:text-indigo-200 transition duration-300">Home</a>
            <a href="/dashboard" className="text-white hover:text-indigo-200 transition duration-300">Tasks</a>
            <a href="/timetable" className="text-white hover:text-indigo-200 transition duration-300">Timetable</a>
            <a href="/profile" className="text-white hover:text-indigo-200 transition duration-300">Profile</a>
            
            {user ? (
              <button 
                onClick={handleLogout} 
                className="bg-white text-indigo-600 px-4 py-1 rounded-md hover:bg-indigo-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={handleLoginRedirect} 
                className="bg-white text-indigo-600 px-4 py-1 rounded-md hover:bg-indigo-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              >
                Login
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="outline-none mobile-menu-button">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu (hidden by default) */}
      <div className="hidden mobile-menu md:hidden bg-indigo-700">
        <ul className="px-2 pt-2 pb-4 space-y-2">
          <li><a href="/" className="block px-2 py-1 text-white hover:bg-indigo-600 rounded">Home</a></li>
          <li><a href="/dashboard" className="block px-2 py-1 text-white hover:bg-indigo-600 rounded">Tasks</a></li>
          <li><a href="/timetable" className="block px-2 py-1 text-white hover:bg-indigo-600 rounded">Timetable</a></li>
          <li><a href="/profile" className="block px-2 py-1 text-white hover:bg-indigo-600 rounded">Profile</a></li>
          <li>
            {user ? (
              <button 
                onClick={handleLogout} 
                className="block w-full text-left px-2 py-1 text-white hover:bg-indigo-600 rounded focus:outline-none"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={handleLoginRedirect} 
                className="block w-full text-left px-2 py-1 text-white hover:bg-indigo-600 rounded focus:outline-none"
              >
                Login
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;