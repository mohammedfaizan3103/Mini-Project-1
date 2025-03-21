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
  
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(value)) {
        setPasswordError("Password must be at least 8 characters long and include a number and a special character.");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordError) {
      alert("Please fix password requirements before submitting.");
      return;
    }
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
          <input type="password" name="password" className="w-full p-2 border rounded mb-2" onChange={handleChange} required />
          {passwordError && <p className="text-red-500 text-sm mb-4">{passwordError}</p>}
          
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
