import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    role: "mentor", // Default role is Mentor
    mentorUsername: "" // Only needed if role is Mentee
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Data Submitted:", formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Full Name</label>
          <input type="text" name="fullName" className="w-full p-2 border rounded mb-4" onChange={handleChange} required />
          
          <label className="block mb-2">Email</label>
          <input type="email" name="email" className="w-full p-2 border rounded mb-4" onChange={handleChange} required />
          
          <label className="block mb-2">Username</label>
          <input type="text" name="username" className="w-full p-2 border rounded mb-4" onChange={handleChange} required />
          
          <label className="block mb-2">Password</label>
          <input type="password" name="password" className="w-full p-2 border rounded mb-4" onChange={handleChange} required />
          
          <label className="block mb-2">Phone</label>
          <input type="tel" name="phone" className="w-full p-2 border rounded mb-4" onChange={handleChange} required />
          
          <label className="block mb-2">Role</label>
          <select name="role" className="w-full p-2 border rounded mb-4" onChange={handleChange} required>
            <option value="mentor">Mentor</option>
            <option value="mentee">Mentee</option>
          </select>
          
          {formData.role === "mentee" && (
            <>
              <label className="block mb-2">Mentor's Username</label>
              <input type="text" name="mentorUsername" className="w-full p-2 border rounded mb-4" onChange={handleChange} required />
            </>
          )}
          
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Register</button>
        </form>
      </div>
    </div>
  );
}