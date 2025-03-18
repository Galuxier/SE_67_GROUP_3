import React from "react";

export default function EventManageDashboard() {
  // Sample statistics
  const stats = [
    { title: "Active Events", value: 5, color: "bg-blue-500" },
    { title: "Total Registrations", value: 142, color: "bg-green-500" },
    { title: "Upcoming Events", value: 3, color: "bg-rose-500" },
    { title: "Completed Events", value: 12, color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold mb-8 text-text">Event Dashboard</h1>
      
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

      {/* Upcoming Events */}
      <div className="bg-card p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-text">Upcoming Events</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-3 border-b border-border last:border-0">
              <div className="flex justify-between">
                <div>
                  <p className="text-text font-medium">Muay Thai Championship {item}</p>
                  <p className="text-sm text-gray-500">Bangkok Stadium</p>
                </div>
                <span className="text-sm text-gray-500">March {item + 10}, 2025</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Event Management Quick Links */}
      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-text">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <button className="p-4 bg-primary text-white rounded-lg hover:bg-secondary transition">
            Create New Event
          </button>
          <button className="p-4 bg-primary text-white rounded-lg hover:bg-secondary transition">
            Manage Registrations
          </button>
          <button className="p-4 bg-primary text-white rounded-lg hover:bg-secondary transition">
            View Event Analytics
          </button>
        </div>
      </div>
    </div>
  );
}