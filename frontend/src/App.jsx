import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import axios from "axios";

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/session", {
          withCredentials: true,
        });

        if (response.data.user) {
          setUser(response.data.user);
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Session check failed:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* ✅ Pass `setUser` prop to Navbar */}
      <Navbar setUser={setUser} />
      <Routes>
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
      </Routes>
    </>
  );
}

export default AppWrapper;
