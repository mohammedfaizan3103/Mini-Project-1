import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useParams } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Profile = ({ user }) => {
  const { username_ } = useParams();
  const [username, setUsername] = useState(username_);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState({
    qualitative_trends: [],
    pattern_detection: [],
    improvement_areas: [],
    missed_tasks_text: ''
  });
  const [taskData, setTaskData] = useState({
    tasks: [],
    tasks_completed: 0,
    tasks_delayed: 0,
    average_delay_days: 0,
    previous_week: {
      tasks_completed: 0,
      tasks_delayed: 0
    },
    mentor_feedback: []
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    // console.log(username_)
    if (user?.role != 'mentor' && user?.username) {
      console.log('here')
      console.log(user)
      setUsername(user.username);
      fetchInsights(user.username, false);
      //console.log(insights);
    }
    if(user?.role == 'mentor') {
      //console.log("here")
      //console.log(username_)
      setUsername(username_);
      fetchInsights(username, false);
    }
  }, [user]);

  const fetchInsights = async (username, new_) => {
    setLoading(true);
    setError(null);
    console.log(username)
    try {
      const response = await axios.get(`http://localhost:5000/api/ai-insights?username=${username}&new=${new_}`);
      // console.log("Full API response:", response.data);
      
      // Get the actual insights object (note the nested 'insights' property)
      const insightsData = response.data.insights?.insights || {};
      
      // Update insights state
      setInsights({
        qualitative_trends: insightsData.qualitative_trends || [],
        pattern_detection: insightsData.pattern_detection || [],
        improvement_areas: insightsData.improvement_areas || [],
        missed_tasks_text: insightsData.missed_tasks_text || ''
      });
      
      // Update taskData
      const taskData = response.data.taskData || {};
      setTaskData({
        tasks: taskData.tasks || [],
        tasks_completed: taskData.tasks_completed || 0,
        tasks_delayed: taskData.tasks_delayed || 0,
        average_delay_days: taskData.average_delay_days || 0,
        previous_week: {
          tasks_completed: taskData.previous_week?.tasks_completed || 0,
          tasks_delayed: taskData.previous_week?.tasks_delayed || 0
        },
        mentor_feedback: taskData.mentor_feedback || []
      });
  
    } catch (error) {
      console.error('Error fetching insights:', error);
      setError('Failed to load insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateNewInsights = async () => {
    fetchInsights(username, true);
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim()) return;
    try {
      await axios.post('/api/ai-insights/feedback', {
        username: username,
        text: feedbackText
      });
      setFeedbackText('');
      fetchInsights(username);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Failed to submit feedback. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading insights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  // Prepare chart data with fallbacks
  const completionData = [
    { name: 'Completed', value: taskData.tasks_completed },
    { name: 'Pending', value: Math.max(0, taskData.tasks.length - taskData.tasks_completed) }
  ];

  const urgencyData = [
    { name: 'Urgent & Important', value: taskData.tasks.filter(t => t.category === 'Urgent & Important').length },
    { name: 'Urgent & Not Important', value: taskData.tasks.filter(t => t.category === 'Urgent & Not Important').length },
    { name: 'Not Urgent & Important', value: taskData.tasks.filter(t => t.category === 'Not Urgent & Important').length },
    { name: 'Not Urgent & Not Important', value: taskData.tasks.filter(t => t.category === 'Not Urgent & Not Important').length }
  ];

  const weeklyComparisonData = [
    { name: 'Current Week', completed: taskData.tasks_completed, delayed: taskData.tasks_delayed },
    { name: 'Previous Week', completed: taskData.previous_week.tasks_completed, delayed: taskData.previous_week.tasks_delayed }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Productivity Insights</h1>
        <button 
          onClick={generateNewInsights} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate New Insights'}
        </button>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6">
        <nav className="flex space-x-4 border-b border-gray-200 mb-6">
          <button
            className={`pb-2 px-1 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`pb-2 px-1 ${activeTab === 'analysis' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('analysis')}
          >
            Detailed Analysis
          </button>
          <button
            className={`pb-2 px-1 ${activeTab === 'feedback' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('feedback')}
          >
            Mentor Feedback
          </button>
        </nav>

        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium">Tasks Completed</h3>
                <p className="text-2xl font-bold text-gray-800 my-2">{taskData.tasks_completed} / {taskData.tasks.length}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" 
                    style={{ width: `${(taskData.tasks_completed / taskData.tasks.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium">Completion Rate</h3>
                <p className="text-2xl font-bold text-gray-800">{Math.round((taskData.tasks_completed / taskData.tasks.length) * 100)}%</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium">Delayed Tasks</h3>
                <p className="text-2xl font-bold text-gray-800">{taskData.tasks_delayed}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium">Avg. Delay</h3>
                <p className="text-2xl font-bold text-gray-800">{taskData.average_delay_days.toFixed(1)} days</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Task Completion</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={completionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {completionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Task Urgency Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={urgencyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {urgencyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Weekly Performance Comparison</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#8884d8" name="Tasks Completed" />
                    <Bar dataKey="delayed" fill="#82ca9d" name="Tasks Delayed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Qualitative Trends</h2>
              {insights.qualitative_trends?.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {insights.qualitative_trends.map((trend, index) => (
                    <li key={index} className="text-gray-700">{trend}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No qualitative trends available</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Pattern Detection</h2>
              {insights.pattern_detection?.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {insights.pattern_detection.map((pattern, index) => (
                    <li key={index} className="text-gray-700">{pattern}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No patterns detected</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Improvement Areas</h2>
              {insights.improvement_areas?.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {insights.improvement_areas.map((area, index) => (
                    <li key={index} className="text-gray-700">{area}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No improvement areas identified</p>
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Missed Tasks Summary</h2>
              <p className="text-gray-700">{insights.missed_tasks_text || 'No missed tasks summary available'}</p>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit Feedback</h2>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Enter your feedback here..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[120px]"
              />
              <button 
                onClick={submitFeedback}
                className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Submit Feedback
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Mentor Feedback History</h2>
              {taskData.mentor_feedback?.length > 0 ? (
                <div className="space-y-4">
                  {taskData.mentor_feedback.map((feedback, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">
                        {new Date(feedback.date).toLocaleDateString()}
                      </div>
                      <div className="text-gray-700">{feedback.text}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No feedback received yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;