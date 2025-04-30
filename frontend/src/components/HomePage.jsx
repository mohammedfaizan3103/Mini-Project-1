import React from "react";
import { Brain, CheckCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    console.log(user)
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-indigo-100 min-h-screen px-6 py-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold text-indigo-700 leading-tight">
            Boost Your Productivity with <span className="text-indigo-500">AI-Powered</span> Insights
          </h1>
          <p className="mt-6 text-lg text-gray-700">
            ChronoFlow empowers you to manage tasks efficiently, collaborate with mentors, and gain smart insights into your workflow.
          </p>
          <button onClick={handleClick} className="mt-6 px-6 py-3 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition">
            Try ChronoFlow Now
          </button>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src="/dashboard_preview.png"
            alt="ChronoFlow dashboard preview"
            className="rounded-3xl shadow-xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto mt-24">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-12">
          Why ChronoFlow?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<Brain className="text-indigo-600 w-10 h-10" />}
            title="AI-Enhanced Insights"
            desc="Get productivity suggestions based on your activity patterns and project priorities."
          />
          <FeatureCard
            icon={<CheckCircle className="text-indigo-600 w-10 h-10" />}
            title="Intelligent Task Management"
            desc="Organize, prioritize, and track your tasks with a smart and minimal interface."
          />
          <FeatureCard
            icon={<Users className="text-indigo-600 w-10 h-10" />}
            title="Mentor-Mentee Collaboration"
            desc="Seamlessly connect with mentors, share progress, and receive guidance in real-time."
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-32 text-center">
        <h3 className="text-3xl font-semibold text-indigo-700 mb-6">
          Ready to transform the way you work?
        </h3>
        <button onClick={handleClick} className="px-8 py-4 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition">
          Get Started Today
        </button>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition duration-300">
    <div className="mb-4">{icon}</div>
    <h4 className="text-xl font-semibold text-gray-800 mb-2">{title}</h4>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default HomePage;
