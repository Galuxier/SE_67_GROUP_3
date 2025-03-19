import React from "react";

export default function GymManageDashboard() {
  // Sample statistics
  const stats = [
    { title: "Active Courses", value: 12, color: "bg-blue-500" },
    { title: "Total Members", value: 240, color: "bg-green-500" },
    { title: "Today's Sessions", value: 8, color: "bg-rose-500" },
    { title: "Trainers", value: 6, color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold mb-8 text-text">Gym Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card p-6 rounded-lg shadow flex flex-col">
            <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
              <span className="text-white text-xl font-bold">
                {stat.title.charAt(0)}
              </span>
            </div>
            <span className="text-3xl font-bold text-text">{stat.value}</span>
            <span className="text-sm text-gray-500 mt-1">{stat.title}</span>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-card p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-text">Recent Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="p-3 border-b border-border last:border-0">
              <div className="flex justify-between">
                <p className="text-text">New member registered</p>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Gym Management Quick Links */}
      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-text">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <button className="p-4 bg-primary text-white rounded-lg hover:bg-secondary transition">
            Add New Course
          </button>
          <button className="p-4 bg-primary text-white rounded-lg hover:bg-secondary transition">
            Manage Trainers
          </button>
          <button className="p-4 bg-primary text-white rounded-lg hover:bg-secondary transition">
            View Schedule
          </button>
        </div>
      </div>
    </div>
  );
}