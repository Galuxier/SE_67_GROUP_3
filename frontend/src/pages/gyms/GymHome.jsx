import { Link } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
function GymHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gym Home</h1>

      {/* ปุ่มไปที่หน้า AddGym */}
      <div className="items-center justify-center">
        <Link to="/gym/addgym">
        {/* <PlusCircleIcon className="h-10 w-10"/> */}
          <button className="px-4 py-2 text-black rounded-md">
            <PlusCircleIcon className="h-10 w-10"/>
          </button>
        </Link>
      </div>

      {/* เนื้อหาอื่น ๆ */}
      <p className="mt-4">List of gyms will be shown here...</p>
    </div>
  );
}

export default GymHome;
