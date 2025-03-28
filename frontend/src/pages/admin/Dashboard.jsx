import React, { useEffect, useState } from "react";
import { getAllUser } from "../../services/api/UserApi";
import { getAllGyms } from "../../services/api/GymApi";
import { motion } from "framer-motion"; // เพิ่ม animation

function UserIcon() {
  return (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.121 17.804A15.876 15.876 0 0112 16 c2.45 0 4.787.552 6.879 1.804M15 11 a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v5 a3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 01-3 3 3 3 0 01-3-3V4z M4 13h16v7a1 1 0 01-1 1H5 a1 1 0 01-1-1v-7z"
      />
    </svg>
  );
}

export default function Dashboard() {
  const [counts, setCounts] = useState({
    nakMuay: 0,
    gym: 0,
    organizer: 0,
    member: 0,
    shopOwner: 0,
    trainer: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const gyms = await getAllGyms();
        const gymCount = gyms.length;

        const users = await getAllUser();
        const hasRole = (user, role) => {
          const roles = user.roles || user.role || [];
          return Array.isArray(roles) && roles.includes(role);
        };

        const nakMuayCount = users.filter((user) => hasRole(user, "boxer")).length;
        const organizerCount = users.filter((user) => hasRole(user, "organizer")).length;
        const memberCount = users.filter((user) => hasRole(user, "member")).length;
        const trainerCount = users.filter((user) => hasRole(user, "trainer")).length;
        const shopOwnerCount = users.filter((user) => hasRole(user, "shop_owner")).length;

        setCounts({
          nakMuay: nakMuayCount,
          gym: gymCount,
          organizer: organizerCount,
          member: memberCount,
          shopOwner: shopOwnerCount,
          trainer: trainerCount,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard counts:", error);
        setCounts((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchCounts();
  }, []);

  function StatCard({ title, count, iconColor, icon }) {
    return (
      <motion.div
        className={`bg-card p-6 rounded-lg shadow-lg flex items-center justify-between border border-border hover:shadow-xl transition-shadow duration-300`}
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-4">
          <div className={`text-${iconColor}-500 bg-${iconColor}-100 p-2 rounded-full`}>
            {icon}
          </div>
          <div>
            <div className="text-lg font-semibold text-text">{title}</div>
            <div className="text-2xl font-bold text-highlight">
              {counts.loading ? "..." : count}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center text-text bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <StatCard
          title="นักมวย"
          count={counts.nakMuay}
          iconColor="blue"
          icon={<UserIcon />}
        />
        <StatCard
          title="ค่าย"
          count={counts.gym}
          iconColor="green"
          icon={
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9.75L12 4l9 5.75v10.5 a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z M9 22V12h6v10"
              />
            </svg>
          }
        />
        <StatCard
          title="ผู้จัด"
          count={counts.organizer}
          iconColor="yellow"
          icon={
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7v.01M8 7a4 4 0 018 0M4 7h16v10H4V7z M3 11h18M3 15h18"
              />
            </svg>
          }
        />
        <StatCard
          title="ร้านค้า"
          count={counts.shopOwner}
          iconColor="pink"
          icon={<ShopIcon />}
        />
        <StatCard
          title="สมาชิก"
          count={counts.member}
          iconColor="red"
          icon={<UserIcon />}
        />
        <StatCard
          title="เทรนเนอร์"
          count={counts.trainer}
          iconColor="purple"
          icon={
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.49 2.45l2.24 6.2 6.67.51 a1 1 0 01.57 1.77l-4.91 3.75 1.5 6.41a1 1 0 01-1.49 1.08L12 18.71 l-5.08 3.46a1 1 0 01-1.49-1.08 l1.5-6.41-4.91-3.75 a1 1 0 01.57-1.77l6.67-.51 2.24-6.2a1 1 0 011.92 0z"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
}