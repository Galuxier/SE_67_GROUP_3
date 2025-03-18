import React from "react";

export default function ShopManageDashboard() {
  // Sample statistics
  const stats = [
    { title: "Total Products", value: 48, color: "bg-blue-500" },
    { title: "Total Orders", value: 126, color: "bg-green-500" },
    { title: "Total Revenue", value: "฿76,500", color: "bg-rose-500" },
    { title: "Pending Orders", value: 5, color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold mb-8 text-text">Shop Dashboard</h1>
      
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

      {/* Recent Orders */}
      <div className="bg-card p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-text">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text">#ORD-{1000 + item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text">Customer {item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text">2025-03-{10 + item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item % 3 === 0 ? 'bg-yellow-100 text-yellow-800' : 
                      item % 2 === 0 ? 'bg-green-100 text-green-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item % 3 === 0 ? 'Pending' : item % 2 === 0 ? 'Completed' : 'Processing'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text">฿{(item * 1500).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Shop Management Quick Links */}
      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-text">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <button className="p-4 bg-primary text-white rounded-lg hover:bg-secondary transition">
            Add New Product
          </button>
          <button className="p-4 bg-primary text-white rounded-lg hover:bg-secondary transition">
            Manage Inventory
          </button>
          <button className="p-4 bg-primary text-white rounded-lg hover:bg-secondary transition">
            View Sales Report
          </button>
        </div>
      </div>
    </div>
  );
}