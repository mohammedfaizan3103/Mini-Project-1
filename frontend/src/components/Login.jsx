import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "mentee" // Default role
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Store user info in session storage
        sessionStorage.setItem("userId", response.data.userId);
        sessionStorage.setItem("username", response.data.username);
        sessionStorage.setItem("role", response.data.role);
        
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        console.log("Login failed:", response.data.message);
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register"); // Redirect to the registration page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <label className="block mb-2">Username</label>
          <input
            type="text"
            name="username"
            className="w-full p-2 border rounded mb-4"
            onChange={handleChange}
            required
          />

          {/* Password */}
          <label className="block mb-2">Password</label>
          <input
            type="password"
            name="password"
            className="w-full p-2 border rounded mb-4"
            onChange={handleChange}
            required
          />

          {/* Role Dropdown */}
          <label className="block mb-2">Role</label>
          <select
            name="role"
            className="w-full p-2 border rounded mb-4"
            onChange={handleChange}
            value={formData.role}
            required
          >
            <option value="mentee">Mentee</option>
            <option value="mentor">Mentor</option>
          </select>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mb-4">
            Login
          </button>
        </form>

        {/* Register Button */}
        <button
          onClick={handleRegisterClick}
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}