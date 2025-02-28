import { useState } from "react";
import PropTypes from "prop-types";

export default function ActivityModal({ isOpen, setIsOpen, setActivities }) {
  const [newActivity, setNewActivity] = useState({
    time: "",
    name: "",
    description: "",
  });

  if (!isOpen) return null; // ไม่ render ถ้า modal ปิด

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity({ ...newActivity, [name]: value });
  };

  const handleAddActivitySubmit = (e) => {
    e.preventDefault();

    setActivities((prevActivities) => {
      const newId =
        prevActivities.length > 0
          ? Math.max(...prevActivities.map((a) => a.id)) + 1
          : 1;
      return [...prevActivities, { id: newId, ...newActivity }];
    });

    setNewActivity({ time: "", name: "", description: "" });
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="w-[450px] p-4 shadow-lg bg-white rounded-lg relative">
        <button
          onClick={() => setIsOpen(false)}
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
            <label className="block text-sm text-gray-700">ชื่อกิจกรรม</label>
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
            <label className="block text-sm text-gray-700">รายละเอียด</label>
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
              onClick={() => setIsOpen(false)}
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
  );
}

ActivityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  setActivities: PropTypes.func.isRequired,
};
