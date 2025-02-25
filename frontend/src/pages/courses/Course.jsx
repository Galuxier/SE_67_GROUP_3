import { useState } from "react";
import { Trash2, Pencil, } from "lucide-react";
import { Link } from "react-router-dom";
export default function Course() {
  const [activities] = useState([
    { id: 1, time: "09:00-9:30", name: "วัด, กำลัพ", description: "โค้ดเป็นไงบ้าง" },
  ]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-[800px] p-11 shadow-lg bg-white rounded-lg">
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">ชื่อคอร์ส</label>
            <input type="text" placeholder="ระบุชื่อคอร์ส" className="w-full p-4 border rounded-lg" />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">กิจกรรม</label>
            
          </div>
          <table className="w-full border-collapse border rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 border">เวลา</th>
                <th className="p-4 border">กิจกรรม</th>
                <th className="p-4 border">คำอธิบาย</th>
                <th className="p-4 border">แก้ไข</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act) => (
                <tr key={act.id} className="text-center">
                  <td className="p-4 border">{act.time}</td>
                  <td className="p-4 border">{act.name}</td>
                  <td className="p-4 border">{act.description}</td>
                  <td className="p-4 border">
                    <button className="text-blue-500 mr-2">
                      <Pencil size={20} />
                    </button>
                    <button className="text-red-500">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between">
            <button className="px-6 py-4 border rounded-lg">ย้อนกลับ</button>
            <Link to = "/course/createCourse">
            <button className="px-6 py-4 bg-rose-500 text-white rounded-lg hover:bg-red-600">สร้างคอร์ส</button>
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
