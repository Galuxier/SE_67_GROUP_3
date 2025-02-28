import { useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import ActivityModal from "../../components/courses/ActivityModal";
import { Link } from "react-router-dom";
export default function CourseFrom() {
  const [activities, setActivities] = useState([
    {
      id: 1,
      time: "09:00-9:30",
      name: "วัด, กำลัพ",
      description: "โค้ดเป็นไงบ้าง",
    },
  ]);

  // State สำหรับ modal เพิ่มกิจกรรม
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);

  const handleDeleteActivity = (id) => {
    setActivities(activities.filter((activity) => activity.id !== id));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-[700px] p-6 shadow-lg bg-white rounded-lg relative">
        <div className="flex justify-center mb-6 flex-col items-center">
          <label className="block text-base font-medium text-gray-700 transform -translate-x-20">
            ชื่อคอร์ส:
          </label>

          <label className="block text-base font-medium text-gray-700 transform -translate-x-20">
            ระยะเวลา:
          </label>
        </div>

        <div className="space-y-4">
          {/* Date input and Next button container */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium">กิจกรรม</h3>
            <div className="w-1/3 flex justify-center">
              {/* <input
                type="date"
                className="px-4 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
              /> */}
              <span className="text-gray-500 text-sm">วันที่ 1</span>
            </div>
            <div className="w-1/3 flex justify-end">
              <button className="px-4 py-1 bg-rose-600 text-white rounded-lg hover:bg-rose-800 text-sm transition-all">
                ถัดไป
              </button>
            </div>
          </div>

          <table className="w-full border-collapse border rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Activity</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Edit</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act) => (
                <tr key={act.id} className="text-center">
                  <td className="p-2 border">{act.time}</td>
                  <td className="p-2 border">{act.name}</td>
                  <td className="p-2 border">{act.description}</td>
                  <td className="p-2 border">
                    <button className="text-blue-500 mr-2">
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteActivity(act.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ปุ่มเพิ่มกิจกรรม */}
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setIsAddActivityModalOpen(true)}
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex justify-between gap-3 mt-6">
            <Link to="/course/createCourse">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm transition-all">
              Cancel
            </button>
              </Link>

              <Link to="/course">
            <button className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 text-sm transition-all">
              สร้าง Course
            </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal สำหรับเพิ่มกิจกรรม */}
      <ActivityModal
        isOpen={isAddActivityModalOpen}
        setIsOpen={setIsAddActivityModalOpen}
        setActivities={setActivities}
      />
    </div>
  );
}
