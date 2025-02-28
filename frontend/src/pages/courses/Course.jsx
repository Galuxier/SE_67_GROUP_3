import { useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import PropTypes from "prop-types";
import CreateCourse from "./CreateCourse";

export default function Course({ isModalOpen, setIsModalOpen }) {
  // Modal state for CreateCourse
  const [createCourseModalOpen, setCreateCourseModalOpen] = useState(false);
  const [activities, setActivities] = useState([
    {
      id: 1,
      time: "09:00-9:30",
      name: "วัด, กำลัพ",
      description: "โค้ดเป็นไงบ้าง",
    },
  ]);

  // State for new activity modal
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    time: "",
    name: "",
    description: "",
  });

  const handleCreateCourseClick = () => {
    setCreateCourseModalOpen(true);
    setIsModalOpen(false); // Close the Course modal when opening CreateCourse
  };

  const handleAddActivityClick = () => {
    setIsAddActivityModalOpen(true);
  };

  const handleAddActivitySubmit = (e) => {
    e.preventDefault();
    // Add new activity to activities array
    const newId =
      activities.length > 0 ? Math.max(...activities.map((a) => a.id)) + 1 : 1;
    setActivities([...activities, { id: newId, ...newActivity }]);

    // Reset form and close modal
    setNewActivity({ time: "", name: "", description: "" });
    setIsAddActivityModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity({ ...newActivity, [name]: value });
  };

  const handleDeleteActivity = (id) => {
    setActivities(activities.filter((activity) => activity.id !== id));
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="w-[700px] p-6 shadow-lg bg-white rounded-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-sm"
            >
              ✕
            </button>
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700">
                  ชื่อคอร์ส:
                </label>
                <input
                  type="text"
                  placeholder="Name of course"
                  className="w-full p-3 border rounded-lg text-sm"
                />
                <label className="block text-base font-medium text-gray-700 mt-3">
                  ระยะเวลา:
                </label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-lg text-sm"
                />
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-base font-medium">กิจกรรม</h3>

                  <div className="flex-grow flex justify-center">
                    <input
                      type="date"
                      className="px-4 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <button className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-all">
                    ถัดไป
                  </button>
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

                {/* Add activity button */}
                <div className="flex justify-center mt-3">
                  <button
                    onClick={handleAddActivityClick}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-sm"
                >
                  ย้อนกลับ
                </button>

                <button
                  onClick={handleCreateCourseClick}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-red-600 text-sm"
                >
                  สร้างคอร์ส
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {isAddActivityModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="w-[450px] p-4 shadow-lg bg-white rounded-lg relative">
            <button
              onClick={() => setIsAddActivityModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-sm"
            >
              ✕
            </button>
            <h3 className="text-base font-medium mb-3">เพิ่มกิจกรรม</h3>
            <form onSubmit={handleAddActivitySubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700">เวลา</label>
                <input
                  type="text"
                  name="time"
                  placeholder="e.g. 09:00-9:30"
                  value={newActivity.time}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">
                  ชื่อกิจกรรม
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="ชื่อกิจกรรม"
                  value={newActivity.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">
                  รายละเอียด
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder="รายละเอียดกิจกรรม"
                  value={newActivity.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddActivityModalOpen(false)}
                  className="px-3 py-1 border rounded-lg text-sm"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  เพิ่ม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CreateCourse modal - only render when createCourseModalOpen is true */}
      {createCourseModalOpen && (
        <CreateCourse
          isOpen={createCourseModalOpen}
          setIsOpen={setCreateCourseModalOpen}
          onSuccessfulCreate={() => setIsModalOpen(true)} // Reopen Course modal on successful creation if needed
        />
      )}
    </div>
  );
}

Course.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};
