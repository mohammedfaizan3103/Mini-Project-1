import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Timetable from './components/Timetable';

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we have user data in sessionStorage first
        const sessionUser = sessionStorage.getItem('authUser');
        if (sessionUser) {
          setUser(JSON.parse(sessionUser));
          if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
            navigate('/dashboard');
          }
          setLoading(false);
          return;
        }

        // If no sessionStorage data, check with the server
        const response = await axios.get('http://localhost:5000/api/auth/session', {
          withCredentials: true,
        });

        if (response.data.user) {
          setUser(response.data.user);
          sessionStorage.setItem('authUser', JSON.stringify(response.data.user));
          if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
            navigate('/dashboard');
          }
        } else {
          if (location.pathname !== '/login' && location.pathname !== '/register') {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate, location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} setUser={setUser} />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/timetable" element={<Timetable user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
        </Routes>
      </main>
    </div>
  );
}

export default AppWrapper;