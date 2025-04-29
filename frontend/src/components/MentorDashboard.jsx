import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const MentorDashboard = () => {
  const [mentees, setMentees] = useState([])
	const navigate = useNavigate()

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/mentor/get-mentees", {
          withCredentials: true
        })
        console.log(response.data)
        setMentees(response.data)
      } catch (error) {
        console.error("Failed to fetch mentees:", error)
      }
    }
    fetchMentees()
  }, [])
	const getMentee = (username) => {
		navigate(`/profile/${username}`);
	}
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Mentees</h2>
        <div className="flex flex-col gap-4">
          {mentees.map((mentee) => (
            <div
							onClick={() => getMentee(mentee.username)}
              key={mentee._id}
              className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 hover:bg-indigo-50 cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-indigo-700">{mentee.username}</h3>
              <p className="text-gray-600 mt-1">Email: {mentee.email || "Not provided"}</p>
              {/* <p className="text-gray-500 text-sm mt-2">ID: {mentee._id}</p> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MentorDashboard
