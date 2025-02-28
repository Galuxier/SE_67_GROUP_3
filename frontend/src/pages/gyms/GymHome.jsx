import { Link } from "react-router-dom";
import GymList from "../../components/Gyms";

function GymHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gym Home</h1>

      {/* ปุ่มไปที่หน้า AddGym */}
      <Link to="/gym/addgym">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Add Gym
        </button>
      </Link>

      {/* เนื้อหาอื่น ๆ */}
      <GymList/>
    </div>
  );
}

export default GymHome;
