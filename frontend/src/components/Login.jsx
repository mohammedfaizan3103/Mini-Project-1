import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data Submitted:", formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Username</label>
          <input type="text" name="username" className="w-full p-2 border rounded mb-4" onChange={handleChange} required />
          
          <label className="block mb-2">Password</label>
          <input type="password" name="password" className="w-full p-2 border rounded mb-4" onChange={handleChange} required />
          
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
        </form>
      </div>
    </div>
  );
}
