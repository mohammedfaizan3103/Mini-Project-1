import React from "react";
import "../index.css";
import "./navbar.css"

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Tasks</a></li>
        <li><a href="#">Timetable</a></li>
        <li><a href="#">Profile</a></li>
        <li><a href="#">Logout</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
