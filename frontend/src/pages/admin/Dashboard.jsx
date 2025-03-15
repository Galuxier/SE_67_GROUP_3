import React from "react";
import { shops } from "../../data/ShopsData";
import { trainer } from "../../components/Trainer";

function UserIcon() {
    return (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.121 17.804A15.876 15.876 0 0112 16
             c2.45 0 4.787.552 6.879 1.804M15 11
             a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    );
  }
  
  function ShopIcon() {
    return (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v5
             a3 3 0 01-3 3 3 3 0 01-3-3 
             3 3 0 01-3 3 3 3 0 01-3-3 
             3 3 0 01-3 3 3 3 0 01-3-3V4z
             M4 13h16v7a1 1 0 01-1 1H5
             a1 1 0 01-1-1v-7z"
        />
      </svg>
    );
  }
  
  export default function Dashboard() {
    const nakMuayCount = 20;
    const gymCount = 20;
    const organizerCount = 20;
    const memberCount = 20;
    const shopCount = shops.length;
    const trainerCount = trainer.length;
  
    function StatCard({ title, count, iconColor, icon }) {
      return (
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`text-${iconColor}-500`}>
              {icon}
            </div>
            <div className="text-2xl font-semibold text-gray-700">
              {title}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {count}
          </div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="นักมวย"
            count={nakMuayCount}
            iconColor="blue"
            icon={<UserIcon />}
          />
          <StatCard
            title="ค่าย"
            count={gymCount}
            iconColor="green"
            icon={
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  d="M3 9.75L12 4l9 5.75v10.5
                     a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z
                     M9 22V12h6v10"
                />
              </svg>
            }
          />
          <StatCard
            title="ผู้จัด"
            count={organizerCount}
            iconColor="yellow"
            icon={
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 7v.01M8 7a4 4 0 018 0M4 7h16v10H4V7z M3 11h18M3 15h18"
                />
              </svg>
            }
          />
          <StatCard
            title="ร้านค้า"
            count={shopCount}
            iconColor="pink"
            icon={<ShopIcon />}
          />
          <StatCard
            title="สมาชิก"
            count={memberCount}
            iconColor="red"
            icon={<UserIcon />}
          />
          <StatCard
            title="เทรนเนอร์"
            count={trainerCount}
            iconColor="purple"
            icon={
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M11.49 2.45l2.24 6.2 6.67.51
                     a1 1 0 01.57 1.77l-4.91 3.75
                     1.5 6.41a1 1 0 01-1.49 1.08L12 18.71
                     l-5.08 3.46a1 1 0 01-1.49-1.08
                     l1.5-6.41-4.91-3.75
                     a1 1 0 01.57-1.77l6.67-.51
                     2.24-6.2a1 1 0 011.92 0z"
                />
              </svg>
            }
          />
        </div>
      </div>
    );
  }