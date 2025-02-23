import { Pencil, Trash2 } from "lucide-react";

const ActivityTable = () => {
  return (
    <div className="mt-4 border rounded-lg overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="p-2">กิจกรรม</th>
            <th className="p-2">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-2">9.00-9.30 | วิ่ง </td>
            <td className="p-2 flex space-x-2">
              <Pencil className="text-blue-500 cursor-pointer" size={18} />
              <Trash2 className="text-red-500 cursor-pointer" size={18} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;
