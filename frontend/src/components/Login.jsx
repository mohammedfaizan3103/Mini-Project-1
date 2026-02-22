import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { buildApiUrl } from "../config/api";

export default function Login({ setUser }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "mentee" // Default role
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        buildApiUrl("api/auth/login"),
        formData,
        { withCredentials: true }
      );

      if (response.data.message === "Login successful") {
        // Update the user state in the parent component
        setUser({
          _id: response.data.user._id,
          username: response.data.user.username,
          email: response.data.user.email,
          role: formData.role
        });

        // Store minimal data in sessionStorage
        sessionStorage.setItem("authUser", JSON.stringify({
          _id: response.data.user._id,
          username: response.data.user.username,
          role: formData.role
        }));

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        {error && (
          <div className="p-2 mb-4 text-red-500 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* Role Dropdown */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Role</label>
            <select
              name="role"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleChange}
              value={formData.role}
              required
            >
              <option value="mentee">Mentee</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={handleRegisterClick}
              className="font-medium text-green-600 hover:text-green-500 focus:outline-none"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}