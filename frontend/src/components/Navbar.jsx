import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

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
    <nav className="navbar">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/dashboard">Tasks</a></li>
        <li><a href="/timetable">Timetable</a></li>
        <li><a href="#">Profile</a></li>
        {user ? (
          <li>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </li>
        ) : (
          <li>
            <button onClick={handleLoginRedirect} className="login-btn">
              Login
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;